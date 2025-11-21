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
import { Breadcrumb, Button, Modal, Form, Input, InputNumber, DatePicker, message, Spin } from 'antd';
import { SoftwareProposalStatus, SoftwareProposalItem, SoftwareProposal } from '@/types/software';
import { useSoftwareProposalDetail } from '@/hooks/useSoftwareProposals';
import { useUpdateSoftwareProposalStatus } from '@/hooks/useSoftwareProposals';
import { completeSoftwareProposal, CompleteSoftwareProposalRequest } from '@/lib/api/software-proposals';
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
      await updateStatus(proposalId, {
        status: SoftwareProposalStatus.ĐANG_TRANG_BỊ,
        technicianId: user?.id,
      });
      message.success('Đã bắt đầu thiết lập phần mềm!');
      setIsStartSetupModalOpen(false);
      setupForm.resetFields();
      refetch();
    } catch (error) {
      console.error('Error starting setup:', error);
      message.error('Có lỗi xảy ra khi bắt đầu thiết lập!');
    }
  };

  const handleComplete = async (values: { softwareInfo: Array<{ itemId: string; name?: string; version?: string; publisher?: string }>; completionNotes?: string }) => {
    if (!proposal || !proposal.items || proposal.items.length === 0) {
      message.error('Không có phần mềm nào trong đề xuất!');
      return;
    }

    try {
      const completeData: CompleteSoftwareProposalRequest = {
        softwareInfo: values.softwareInfo.map((info) => ({
          itemId: info.itemId,
          name: info.name || undefined,
          version: info.version || undefined,
          publisher: info.publisher || undefined,
        })),
        completionNotes: values.completionNotes,
      };

      await completeSoftwareProposal(proposalId, completeData);
      message.success('Đã hoàn thành trang bị phần mềm cho tất cả máy tính trong phòng!');
      setIsCompleteModalOpen(false);
      completeForm.resetFields();
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
              onClick={() => setIsCompleteModalOpen(true)}
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
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
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
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
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
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
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
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
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
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
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
        title="Bắt đầu thiết lập phần mềm"
        open={isStartSetupModalOpen}
        onCancel={() => {
          setIsStartSetupModalOpen(false);
          setupForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={setupForm}
          layout="vertical"
          onFinish={handleStartSetup}
          initialValues={{
            setupInfo: proposalItems.map(item => ({
              itemId: item.id,
              installedQuantity: item.quantity,
            }))
          }}
        >
          <Form.List name="setupInfo">
            {(fields) => (
              <>
                {fields.map((field, index) => {
                  const item = proposalItems[index];
                  return (
                    <div key={field.key} className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {item.softwareName} {item.version && `(${item.version})`}
                      </h4>
                      
                      <Form.Item
                        {...field}
                        name={[field.name, 'itemId']}
                        hidden
                      >
                        <Input type="hidden" />
                      </Form.Item>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                          {...field}
                          name={[field.name, 'installedQuantity']}
                          label="Số lượng đã cài đặt"
                          rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            { type: 'number', min: 0, max: item.quantity, message: `Số lượng không được vượt quá ${item.quantity}!` }
                          ]}
                        >
                          <InputNumber
                            min={0}
                            max={item.quantity}
                            className="w-full"
                            placeholder="Nhập số lượng đã cài đặt"
                          />
                        </Form.Item>
                        
                        <Form.Item
                          {...field}
                          name={[field.name, 'installationDate']}
                          label="Ngày cài đặt"
                        >
                          <DatePicker
                            className="w-full"
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày cài đặt"
                          />
                        </Form.Item>
                      </div>
                      
                      <Form.Item
                        {...field}
                        name={[field.name, 'notes']}
                        label="Ghi chú thiết lập"
                      >
                        <TextArea
                          rows={3}
                          placeholder="Nhập ghi chú về quá trình cài đặt phần mềm này..."
                        />
                      </Form.Item>
                    </div>
                  );
                })}
              </>
            )}
          </Form.List>
          
          <Form.Item className="mb-0 flex justify-end gap-2 mt-6">
            <Button 
              onClick={() => {
                setIsStartSetupModalOpen(false);
                setupForm.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              icon={<Wrench className="h-4 w-4" />}
            >
              Bắt đầu thiết lập
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Hoàn thành */}
      <Modal
        title="Hoàn thành trang bị phần mềm"
        open={isCompleteModalOpen}
        onCancel={() => {
          setIsCompleteModalOpen(false);
          completeForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={completeForm}
          layout="vertical"
          onFinish={handleComplete}
          initialValues={{
            softwareInfo: proposalItems.map(item => ({
              itemId: item.id,
              name: item.softwareName,
              version: item.version || '',
              publisher: item.publisher || '',
            }))
          }}
        >
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Vui lòng kiểm tra và bổ sung thông tin phần mềm nếu cần. 
              Hệ thống sẽ tự động cập nhật phần mềm cho tất cả máy tính trong phòng.
            </p>
          </div>

          <Form.List name="softwareInfo">
            {(fields) => (
              <>
                {fields.map((field, index) => {
                  const item = proposalItems[index];
                  return (
                    <div key={field.key} className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {item.softwareName} {item.version && `(${item.version})`}
                      </h4>
                      
                      <Form.Item
                        {...field}
                        name={[field.name, 'itemId']}
                        hidden
                      >
                        <Input type="hidden" />
                      </Form.Item>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          label="Tên phần mềm"
                          rules={[
                            { required: true, message: 'Vui lòng nhập tên phần mềm!' }
                          ]}
                        >
                          <Input
                            placeholder="Nhập tên phần mềm"
                          />
                        </Form.Item>
                        
                        <Form.Item
                          {...field}
                          name={[field.name, 'version']}
                          label="Phiên bản"
                        >
                          <Input
                            placeholder="Nhập phiên bản (tùy chọn)"
                          />
                        </Form.Item>
                        
                        <Form.Item
                          {...field}
                          name={[field.name, 'publisher']}
                          label="Nhà sản xuất"
                        >
                          <Input
                            placeholder="Nhập nhà sản xuất (tùy chọn)"
                          />
                        </Form.Item>
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
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú về việc hoàn thành trang bị..."
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button 
              onClick={() => {
                setIsCompleteModalOpen(false);
                completeForm.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              loading={updateLoading}
              icon={<Package className="h-4 w-4" />}
            >
              Hoàn thành trang bị
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}