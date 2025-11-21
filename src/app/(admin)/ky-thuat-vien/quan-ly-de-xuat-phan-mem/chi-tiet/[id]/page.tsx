'use client';

import { useState, useMemo } from 'react';
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
import { Breadcrumb, Button, Modal, Form, Input, message } from 'antd';
import { SoftwareProposalStatus, SoftwareProposalItem } from '@/types/software';
import { 
  getSoftwareProposalById,
  getSoftwareProposalItems 
} from '@/lib/mockData/softwareProposals';

const { TextArea } = Input;

// Mock users và rooms data để hiển thị tên
const mockUsers = {
  'user-5': 'Nguyễn Văn A',
  'user-6': 'Trần Thị B', 
  'user-1': 'Lê Văn C'
} as const;

const mockRooms = {
  'ROOM001': 'H101',
  'ROOM002': 'H102',
  'ROOM003': 'H103', 
  'ROOM004': 'H201',
  'ROOM005': 'H202'
} as const;

// Helper functions
const getUserName = (userId: string): string => {
  return (mockUsers as Record<string, string>)[userId] || userId;
};

const getRoomName = (roomId: string): string => {
  return (mockRooms as Record<string, string>)[roomId] || roomId;
};



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
  
  // State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Lấy dữ liệu đề xuất
  const proposal = useMemo(() => {
    return getSoftwareProposalById(proposalId);
  }, [proposalId]);

  // Lấy items của proposal
  const proposalItems = useMemo(() => {
    return getSoftwareProposalItems(proposalId);
  }, [proposalId]);

  if (!proposal) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không tìm thấy đề xuất
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Đề xuất phần mềm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  const StatusIcon = softwareProposalStatusConfig[proposal.status].icon;

  // Handlers
  const handleApprove = async (values: { approvalNotes?: string }) => {
    try {
      setLoading(true);
      // TODO: Gọi API để duyệt đề xuất
      console.log('Approving proposal:', proposalId, values);
      message.success('Đã duyệt đề xuất phần mềm thành công!');
      setIsApproveModalOpen(false);
      form.resetFields();
      router.refresh();
    } catch (error) {
      console.error('Error approving proposal:', error);
      message.error('Có lỗi xảy ra khi duyệt đề xuất!');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (values: { rejectionReason: string }) => {
    try {
      setLoading(true);
      // TODO: Gọi API để từ chối đề xuất
      console.log('Rejecting proposal:', proposalId, values);
      message.success('Đã từ chối đề xuất phần mềm!');
      setIsRejectModalOpen(false);
      form.resetFields();
      router.refresh();
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      message.error('Có lỗi xảy ra khi từ chối đề xuất!');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (values: { completionNotes?: string }) => {
    try {
      setLoading(true);
      // TODO: Gọi API để hoàn thành trang bị phần mềm
      console.log('Completing proposal:', proposalId, values);
      message.success('Đã hoàn thành trang bị phần mềm!');
      setIsCompleteModalOpen(false);
      form.resetFields();
      router.refresh();
    } catch (error) {
      console.error('Error completing proposal:', error);
      message.error('Có lỗi xảy ra khi hoàn thành trang bị!');
    } finally {
      setLoading(false);
    }
  };

  // Check quyền thao tác theo trạng thái
  const canApprove = proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;
  const canReject = proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;
  const canComplete = proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT;

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
          {canApprove && (
            <Button 
              type="primary"
              icon={<CheckCircle className="h-4 w-4" />}
              onClick={() => setIsApproveModalOpen(true)}
            >
              Duyệt đề xuất
            </Button>
          )}
          {canReject && (
            <Button 
              danger
              icon={<XCircle className="h-4 w-4" />}
              onClick={() => setIsRejectModalOpen(true)}
            >
              Từ chối
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
                  <p className="font-medium text-gray-900">{getUserName(proposal.proposerId)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phòng</p>
                  <p className="font-medium text-gray-900">{getRoomName(proposal.roomId)}</p>
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
              
              {proposal.approverId && proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Đã được duyệt</p>
                    <p className="font-medium text-gray-900">
                      Bởi: {getUserName(proposal.approverId)}
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
                      <p className="text-sm text-gray-500">
                        {item.publisher} • {item.licenseType}
                      </p>
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
              {proposal.approverId && proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã duyệt</p>
                    <p className="text-sm text-gray-500">
                      Bởi: {getUserName(proposal.approverId)}
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
                    {proposal.approverId && (
                      <p className="text-sm text-gray-500">
                        Bởi: {getUserName(proposal.approverId)}
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

      {/* Modal Duyệt */}
      <Modal
        title="Duyệt đề xuất phần mềm"
        open={isApproveModalOpen}
        onCancel={() => {
          setIsApproveModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApprove}
        >
          <Form.Item
            name="approvalNotes"
            label="Ghi chú duyệt (tùy chọn)"
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú về việc duyệt đề xuất..."
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button 
              onClick={() => {
                setIsApproveModalOpen(false);
                form.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              icon={<CheckCircle className="h-4 w-4" />}
            >
              Duyệt đề xuất
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Từ chối */}
      <Modal
        title="Từ chối đề xuất phần mềm"
        open={isRejectModalOpen}
        onCancel={() => {
          setIsRejectModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReject}
        >
          <Form.Item
            name="rejectionReason"
            label="Lý do từ chối"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do từ chối!' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập lý do từ chối đề xuất..."
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button 
              onClick={() => {
                setIsRejectModalOpen(false);
                form.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button 
              danger
              htmlType="submit"
              loading={loading}
              icon={<XCircle className="h-4 w-4" />}
            >
              Từ chối
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
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleComplete}
        >
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
                form.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              loading={loading}
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