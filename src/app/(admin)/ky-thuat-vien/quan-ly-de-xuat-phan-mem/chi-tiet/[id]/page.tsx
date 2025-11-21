'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Monitor,
  User,
  Building,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { Breadcrumb, Button, Modal, Form, Input, message, Spin } from 'antd';
import { SoftwareProposalStatus, SoftwareProposalItem, SoftwareProposal } from '@/types/software';
import { useSoftwareProposalDetail } from '@/hooks/useSoftwareProposals';
import { useUpdateSoftwareProposalStatus } from '@/hooks/useSoftwareProposals';
import { completeSoftwareProposal, CompleteSoftwareProposalRequest } from '@/lib/api/software-proposals';
import { getComputersByRoomId } from '@/lib/api/computers';
import { useAuth } from '@/contexts/AuthContext';

const { TextArea } = Input;



// Config cho trạng thái đề xuất
const softwareProposalStatusConfig = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: {
    label: 'Chờ duyệt',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: Clock
  },
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: {
    label: 'Đã duyệt',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: CheckCircle
  },
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: {
    label: 'Đã từ chối',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: XCircle
  },
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: {
    label: 'Đang trang bị',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: Wrench
  },
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: {
    label: 'Đã trang bị',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: Monitor
  }
};


export default function SoftwareProposalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;
  const { user } = useAuth();
  
  // State
  const [isStartSetupModalOpen, setIsStartSetupModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [setupForm] = Form.useForm();
  const [completeForm] = Form.useForm();
  const [computersCount, setComputersCount] = useState<number>(0);
  const [loadingComputers, setLoadingComputers] = useState(false);
  
  // Lấy dữ liệu đề xuất từ API
  const { data: proposal, loading, error, refetch } = useSoftwareProposalDetail(proposalId);
  const { updateStatus, loading: updateLoading } = useUpdateSoftwareProposalStatus();

  // Helper functions
  const getUserName = (proposal: SoftwareProposal | null): string => {
    if (!proposal) return 'N/A';
    return proposal.proposer?.fullName || proposal.proposerId || 'N/A';
  };

  const getRoomName = (proposal: SoftwareProposal | null): string => {
    if (!proposal) return 'N/A';
    return proposal.room?.name || proposal.roomId || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {error || 'Không tìm thấy đề xuất'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Đề xuất phần mềm không tồn tại hoặc đã bị xóa.
        </p>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/ky-thuat-vien/quan-ly-de-xuat-phan-mem')}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const StatusIcon = softwareProposalStatusConfig[proposal.status]?.icon || Monitor;
  const proposalItems = proposal.items || [];

  // Handlers
  const handleStartSetup = async () => {
    try {
      // Cập nhật trạng thái đề xuất
      await updateStatus(proposalId, {
        status: SoftwareProposalStatus.ĐANG_TRANG_BỊ,
        technicianId: user?.id,
      });
      
      // Lưu ý: Publisher info từ form không được gửi lên API vì API update status không nhận thông tin này
      // Thông tin publisher sẽ được cập nhật khi hoàn thành đề xuất (trong modal hoàn thành)
      
      message.success('Đã bắt đầu thiết lập phần mềm!');
      setIsStartSetupModalOpen(false);
      setupForm.resetFields();
      refetch();
    } catch (error) {
      console.error('Error starting setup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi bắt đầu thiết lập!';
      message.error(errorMessage);
    }
  };

  // Lấy số lượng máy tính trong phòng khi mở modal
  const fetchComputersCount = async () => {
    if (!proposal?.roomId) return;
    
    try {
      setLoadingComputers(true);
      const computers = await getComputersByRoomId(proposal.roomId);
      setComputersCount(computers.length);
    } catch (error) {
      console.error('Error fetching computers:', error);
      setComputersCount(0);
    } finally {
      setLoadingComputers(false);
    }
  };

  const handleOpenCompleteModal = () => {
    setIsCompleteModalOpen(true);
    fetchComputersCount();
  };

  const handleComplete = async (values: { 
    softwareInfo: Array<{ 
      itemId: string; 
      name?: string; 
      version?: string; 
      publisher?: string;
    }>; 
    completionNotes?: string;
  }) => {
    if (!proposal || !proposal.items || proposal.items.length === 0) {
      message.error('Không có phần mềm nào trong đề xuất!');
      return;
    }

    try {
      // Xử lý dữ liệu: sử dụng giá trị từ form nếu có, nếu không thì dùng từ proposal item
      const completeData: CompleteSoftwareProposalRequest = {
        softwareInfo: values.softwareInfo.map((info, index) => {
          const item = proposalItems[index];
          
          // Lấy giá trị từ form nếu có, nếu không thì dùng từ proposal item
          const name = (info.name && info.name.trim() !== '') 
            ? info.name.trim() 
            : (item.softwareName && item.softwareName.trim() !== '' ? item.softwareName.trim() : undefined);
          
          const version = (info.version && info.version.trim() !== '') 
            ? info.version.trim() 
            : (item.version && item.version.trim() !== '' ? item.version.trim() : undefined);
          
          const publisher = (info.publisher && info.publisher.trim() !== '') 
            ? info.publisher.trim() 
            : (item.publisher && item.publisher.trim() !== '' ? item.publisher.trim() : undefined);
          
          // Validate: name là required trong Software entity
          if (!name || name.trim() === '') {
            throw new Error(`Phần mềm ${index + 1} thiếu tên phần mềm. Vui lòng nhập tên phần mềm!`);
          }
          
          return {
            itemId: info.itemId,
            name: name,
            version: version || undefined,
            publisher: publisher || undefined,
          };
        }),
        completionNotes: values.completionNotes,
      };

      await completeSoftwareProposal(proposalId, completeData);
      message.success(`Đã hoàn thành trang bị phần mềm cho ${computersCount} máy tính trong phòng ${getRoomName(proposal)}!`);
      setIsCompleteModalOpen(false);
      completeForm.resetFields();
      setComputersCount(0);
      refetch();
      // Chuyển về trang danh sách sau 1.5 giây
      setTimeout(() => {
        router.push('/ky-thuat-vien/quan-ly-de-xuat-phan-mem');
      }, 1500);
    } catch (error) {
      console.error('Error completing proposal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi hoàn thành trang bị!';
      message.error(errorMessage);
    }
  };

  // Check quyền thao tác theo trạng thái
  const canStartSetup = proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT;
  const canComplete = proposal.status === SoftwareProposalStatus.ĐANG_TRANG_BỊ;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/ky-thuat-vien',
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: '/ky-thuat-vien/quan-ly-de-xuat-phan-mem',
            title: (
              <div className="flex items-center">
                <span>Quản lý đề xuất phần mềm</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chi tiết đề xuất</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Monitor className="h-6 w-6 text-blue-600" />
              Chi tiết đề xuất phần mềm
            </h1>
            <p className="mt-1 text-gray-600">
              Mã đề xuất: <span className="font-medium">{proposal.proposalCode}</span>
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/ky-thuat-vien/quan-ly-de-xuat-phan-mem')}
          >
            Quay lại
          </Button>
          {canStartSetup && (
            <Button 
              type="primary"
              icon={<Wrench className="h-4 w-4" />}
              onClick={() => setIsStartSetupModalOpen(true)}
            >
              Bắt đầu thiết lập
            </Button>
          )}
          {canComplete && (
            <Button 
              type="primary"
              icon={<Package className="h-4 w-4" />}
              onClick={handleOpenCompleteModal}
            >
              Hoàn thành trang bị
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${softwareProposalStatusConfig[proposal.status].color}`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {softwareProposalStatusConfig[proposal.status].label}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Người đề xuất</p>
                  <p className="font-medium text-gray-900">{getUserName(proposal)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phòng</p>
                  <p className="font-medium text-gray-900">{getRoomName(proposal)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium text-gray-900">
                    {new Date(proposal.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              {proposal.approver && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Đã được duyệt bởi</p>
                    <p className="font-medium text-gray-900">
                      {proposal.approver.fullName}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {proposal.reason && (
              <div className="mt-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Lý do đề xuất</p>
                    <p className="mt-1 text-gray-900">{proposal.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danh sách phần mềm */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh sách phần mềm đề xuất</h2>
            
            <div className="space-y-3">
              {proposalItems.map((item: SoftwareProposalItem) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.softwareName} {item.version}
                      </p>
                      {item.publisher && (
                        <p className="text-sm text-gray-500">
                          {item.publisher}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Số lượng</p>
                    <p className="font-medium text-gray-900">{item.quantity}</p>
                  </div>
                </div>
              ))}
              {proposalItems.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Chưa có phần mềm nào trong đề xuất này.
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tiến trình xử lý</h2>
            
            <div className="space-y-4">
              {/* Tạo đề xuất */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tạo đề xuất</p>
                  <p className="text-sm text-gray-500">
                    {new Date(proposal.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              
              {/* Duyệt đề xuất */}
              {proposal.approver && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã duyệt</p>
                    <p className="text-sm text-gray-500">
                      Bởi: {proposal.approver.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(proposal.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Đang trang bị */}
              {proposal.status === SoftwareProposalStatus.ĐANG_TRANG_BỊ && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đang trang bị</p>
                    <p className="text-sm text-gray-500">
                      Đang trong quá trình thiết lập phần mềm
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(proposal.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Từ chối */}
              {proposal.status === SoftwareProposalStatus.ĐÃ_TỪ_CHỐI && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã từ chối</p>
                    {proposal.approver && (
                      <p className="text-sm text-gray-500">
                        Bởi: {proposal.approver.fullName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(proposal.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Hoàn thành */}
              {proposal.status === SoftwareProposalStatus.ĐÃ_TRANG_BỊ && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã trang bị</p>
                    <p className="text-sm text-gray-500">
                      Hoàn thành cài đặt phần mềm
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(proposal.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Bắt đầu thiết lập */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-orange-600" />
            <span>Bắt đầu thiết lập phần mềm</span>
          </div>
        }
        open={isStartSetupModalOpen}
        onCancel={() => {
          setIsStartSetupModalOpen(false);
          setupForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={setupForm}
          layout="vertical"
          onFinish={handleStartSetup}
          initialValues={{
            publisherInfo: proposalItems.map(item => ({
              itemId: item.id,
              publisher: item.publisher || '',
            }))
          }}
        >
          {/* Thông báo */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  Bạn đang bắt đầu quá trình thiết lập phần mềm. Thông tin phần mềm sẽ được lấy từ phiếu đề xuất.
                  Vui lòng bổ sung <strong>Nhà sản xuất (Publisher)</strong> nếu còn thiếu.
                </p>
              </div>
            </div>
          </div>

          {/* Danh sách phần mềm */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Danh sách phần mềm cần thiết lập
            </h3>
            
            <Form.List name="publisherInfo">
              {(fields) => (
                <>
                  {fields.map((field, index) => {
                    const item = proposalItems[index];
                    if (!item) return null; // Safety check
                    const hasPublisher = item.publisher && item.publisher.trim() !== '';
                    
                    return (
                      <div key={`publisher-${item.id || field.key}`} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center gap-3 mb-3">
                          <Monitor className="h-5 w-5 text-blue-600 shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {item.softwareName || 'Chưa có tên'}
                            </h4>
                            <div className="mt-1 space-y-1">
                              {item.version && (
                                <p className="text-sm text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    Phiên bản: <span className="font-medium">{item.version}</span>
                                  </span>
                                </p>
                              )}
                              {hasPublisher && (
                                <p className="text-sm text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    Nhà sản xuất: <span className="font-medium">{item.publisher}</span>
                                  </span>
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Số lượng: <span className="font-medium">{item.quantity}</span> license
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Form.Item
                          {...field}
                          name={[field.name, 'itemId']}
                          hidden
                        >
                          <Input type="hidden" />
                        </Form.Item>
                        
                        {/* Chỉ hiển thị trường publisher nếu chưa có */}
                        {!hasPublisher && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'publisher']}
                            label={
                              <span className="font-medium">
                                Nhà sản xuất <span className="text-xs text-gray-500">(Tùy chọn - Bổ sung nếu có)</span>
                              </span>
                            }
                            rules={[
                              { max: 255, message: 'Nhà sản xuất không được vượt quá 255 ký tự!' }
                            ]}
                            help="Chưa có trong đề xuất - Bổ sung nhà sản xuất phần mềm nếu có"
                          >
                            <Input
                              placeholder="Ví dụ: Microsoft Corporation, Adobe Inc."
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </Form.List>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Lưu ý:</strong> Sau khi bắt đầu thiết lập, trạng thái đề xuất sẽ chuyển sang <strong>&quot;Đang trang bị&quot;</strong>.
              Bạn sẽ cần hoàn thành việc cài đặt phần mềm cho tất cả máy tính trong phòng trước khi đánh dấu hoàn thành.
            </p>
          </div>
          
          <Form.Item className="mb-0 flex justify-end gap-2 mt-6">
            <Button 
              onClick={() => {
                setIsStartSetupModalOpen(false);
                setupForm.resetFields();
              }}
              disabled={updateLoading}
            >
              Hủy
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              icon={<Wrench className="h-4 w-4" />}
              size="large"
            >
              Xác nhận bắt đầu thiết lập
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Hoàn thành */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span>Hoàn thành trang bị phần mềm</span>
          </div>
        }
        open={isCompleteModalOpen}
        onCancel={() => {
          setIsCompleteModalOpen(false);
          completeForm.resetFields();
          setComputersCount(0);
        }}
        footer={null}
        width={900}
      >
        <Form
          form={completeForm}
          layout="vertical"
          onFinish={handleComplete}
          initialValues={{
            softwareInfo: proposalItems.map(item => {
              // Chỉ set giá trị cho các trường còn thiếu hoặc cần chỉnh sửa
              const hasName = item.softwareName && item.softwareName.trim() !== '';
              const hasVersion = item.version && item.version.trim() !== '';
              const hasPublisher = item.publisher && item.publisher.trim() !== '';
              
              return {
                itemId: item.id,
                // Chỉ set name nếu chưa có hoặc để chỉnh sửa
                ...(hasName ? {} : { name: '' }),
                // Chỉ set version nếu chưa có
                ...(hasVersion ? {} : { version: '' }),
                // Chỉ set publisher nếu chưa có
                ...(hasPublisher ? {} : { publisher: '' }),
              };
            })
          }}
        >
          {/* Thông tin phòng và số lượng máy tính */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  Phòng: {getRoomName(proposal)}
                </p>
                {loadingComputers ? (
                  <p className="text-sm text-gray-600">Đang tải thông tin máy tính...</p>
                ) : (
                  <p className="text-sm text-gray-700">
                    <strong className="text-blue-700">{computersCount}</strong> máy tính sẽ được cài đặt phần mềm
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Lưu ý quan trọng */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 mb-2">Lưu ý quan trọng:</p>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li><strong>Tên phần mềm</strong> là trường bắt buộc. Nếu đề xuất chưa có, bạn phải nhập.</li>
                  <li><strong>Phiên bản</strong> và <strong>Nhà sản xuất</strong> là tùy chọn, chỉ hiển thị nếu đề xuất chưa có để bạn bổ sung.</li>
                  <li>Hệ thống sẽ tự động tạo mới hoặc cập nhật phần mềm trong bảng <code className="bg-amber-100 px-1 rounded">Software</code> với thông tin đầy đủ.</li>
                  <li>Phần mềm sẽ được cài đặt cho <strong>TẤT CẢ {computersCount} máy tính</strong> trong phòng <strong>{getRoomName(proposal)}</strong>.</li>
                  <li>Nếu phần mềm đã tồn tại trên máy tính, hệ thống sẽ bỏ qua để tránh trùng lặp.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thông tin phần mềm cần cài đặt
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng kiểm tra và bổ sung thông tin phần mềm cho từng item trong đề xuất.
            </p>
          </div>

          <Form.List name="softwareInfo">
            {(fields) => (
              <>
                {fields.map((field, index) => {
                  const item = proposalItems[index];
                  if (!item) return null; // Safety check
                  
                  // Xác định các trường còn thiếu (null, undefined, hoặc empty string)
                  const hasName = item.softwareName && item.softwareName.trim() !== '';
                  const hasVersion = item.version && item.version.trim() !== '';
                  const hasPublisher = item.publisher && item.publisher.trim() !== '';
                  
                  // Tên phần mềm là required trong Software entity
                  const nameRequired = !hasName;
                  
                  return (
                    <div key={item.id || `software-${field.key}`} className="mb-6 p-5 border-2 border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                        <Monitor className="h-5 w-5 text-blue-600 shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            Phần mềm {index + 1}: {item.softwareName || 'Chưa có tên'}
                          </h4>
                          <div className="mt-2 space-y-1">
                            {hasVersion && (
                              <p className="text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  Phiên bản: <span className="font-medium">{item.version}</span>
                                </span>
                              </p>
                            )}
                            {hasPublisher && (
                              <p className="text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  Nhà sản xuất: <span className="font-medium">{item.publisher}</span>
                                </span>
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Số lượng: <span className="font-medium">{item.quantity}</span> license
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Form.Item
                        {...field}
                        name={[field.name, 'itemId']}
                        hidden
                      >
                        <Input type="hidden" />
                      </Form.Item>
                      
                      {/* Chỉ hiển thị các trường còn thiếu hoặc cho phép chỉnh sửa */}
                      <div className="space-y-4">
                        {/* Tên phần mềm - Required nếu chưa có */}
                        {(!hasName || nameRequired) && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            label={
                              <span className="font-medium">
                                Tên phần mềm {nameRequired && <span className="text-red-500">*</span>}
                                {hasName && <span className="text-xs text-gray-500 ml-2">(Chỉnh sửa nếu cần)</span>}
                              </span>
                            }
                            initialValue={item.softwareName || ''}
                            rules={[
                              ...(nameRequired ? [{ required: true, message: 'Vui lòng nhập tên phần mềm!' }] : []),
                              { max: 255, message: 'Tên phần mềm không được vượt quá 255 ký tự!' }
                            ]}
                            help={hasName ? 'Đã có trong đề xuất, bạn có thể chỉnh sửa nếu cần' : 'Trường bắt buộc - Vui lòng nhập tên phần mềm'}
                          >
                            <Input
                              placeholder="Ví dụ: Microsoft Office 2021 Professional Plus"
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                        
                        {/* Phiên bản - Optional, chỉ hiển thị nếu chưa có hoặc cho phép chỉnh sửa */}
                        {!hasVersion && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'version']}
                            label={
                              <span className="font-medium">
                                Phiên bản <span className="text-xs text-gray-500">(Tùy chọn - Bổ sung nếu có)</span>
                              </span>
                            }
                            initialValue={item.version || ''}
                            rules={[
                              { max: 100, message: 'Phiên bản không được vượt quá 100 ký tự!' }
                            ]}
                            help="Chưa có trong đề xuất - Bổ sung phiên bản phần mềm nếu có"
                          >
                            <Input
                              placeholder="Ví dụ: 2021, 2024, v1.0.0"
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                        
                        {/* Nhà sản xuất - Optional, chỉ hiển thị nếu chưa có hoặc cho phép chỉnh sửa */}
                        {!hasPublisher && (
                          <Form.Item
                            {...field}
                            name={[field.name, 'publisher']}
                            label={
                              <span className="font-medium">
                                Nhà sản xuất <span className="text-xs text-gray-500">(Tùy chọn - Bổ sung nếu có)</span>
                              </span>
                            }
                            initialValue={item.publisher || ''}
                            rules={[
                              { max: 255, message: 'Nhà sản xuất không được vượt quá 255 ký tự!' }
                            ]}
                            help="Chưa có trong đề xuất - Bổ sung nhà sản xuất phần mềm nếu có"
                          >
                            <Input
                              placeholder="Ví dụ: Microsoft Corporation, Adobe Inc."
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                        
                        {/* Thông báo nếu đã có đầy đủ thông tin */}
                        {hasName && hasVersion && hasPublisher && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                              <p className="text-sm text-green-800">
                                <strong>Đã có đầy đủ thông tin!</strong> Tất cả các trường (tên, phiên bản, nhà sản xuất) đã được điền trong đề xuất.
                                Bạn có thể chỉnh sửa tên phần mềm nếu cần bằng cách nhập lại vào trường bên dưới.
                              </p>
                            </div>
                            <Form.Item
                              {...field}
                              name={[field.name, 'name']}
                              label={
                                <span className="font-medium text-sm mt-2">
                                  Chỉnh sửa tên phần mềm (nếu cần)
                                </span>
                              }
                              initialValue={item.softwareName || ''}
                              rules={[
                                { max: 255, message: 'Tên phần mềm không được vượt quá 255 ký tự!' }
                              ]}
                              className="mt-2"
                            >
                              <Input
                                placeholder={item.softwareName || "Nhập tên phần mềm nếu muốn thay đổi"}
                                className="w-full"
                              />
                            </Form.Item>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </Form.List>

          <Form.Item
            name="completionNotes"
            label="Ghi chú hoàn thành (tùy chọn)"
            rules={[
              { max: 1000, message: 'Ghi chú không được vượt quá 1000 ký tự!' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú về việc hoàn thành trang bị phần mềm (ví dụ: Đã cài đặt thành công, có vấn đề gì cần lưu ý...)"
              maxLength={1000}
              showCount
            />
          </Form.Item>
          
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Tóm tắt:</strong> Bạn đang hoàn thành việc trang bị <strong>{proposalItems.length}</strong> phần mềm 
              cho <strong>{computersCount}</strong> máy tính trong phòng <strong>{getRoomName(proposal)}</strong>.
            </p>
          </div>
          
          <Form.Item className="mb-0 flex justify-end gap-2 mt-6">
            <Button 
              onClick={() => {
                setIsCompleteModalOpen(false);
                completeForm.resetFields();
                setComputersCount(0);
              }}
              disabled={updateLoading}
            >
              Hủy
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              icon={<Package className="h-4 w-4" />}
              size="large"
            >
              Xác nhận hoàn thành trang bị
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}