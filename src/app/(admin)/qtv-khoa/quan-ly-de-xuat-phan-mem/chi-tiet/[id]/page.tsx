'use client';

import { useParams, useRouter } from 'next/navigation';
import { 
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
import { Breadcrumb, Button, Spin } from 'antd';
import { SoftwareProposalStatus, SoftwareProposal, SoftwareProposalItem } from '@/types/software';
import { useSoftwareProposalDetail } from '@/hooks/useSoftwareProposals';

// Helper functions
const getUserName = (proposal: SoftwareProposal | null): string => {
  if (!proposal) return 'N/A';
  return proposal.proposer?.fullName || proposal.proposerId || 'N/A';
};

const getRoomName = (proposal: SoftwareProposal | null): string => {
  if (!proposal) return 'N/A';
  return proposal.room?.name || proposal.roomId || 'N/A';
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

export default function QtvKhoaSoftwareProposalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;
  
  // Lấy dữ liệu đề xuất từ API
  const { data: proposal, loading, error } = useSoftwareProposalDetail(proposalId);

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
          onClick={() => router.push('/qtv-khoa/quan-ly-de-xuat-phan-mem')}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const StatusIcon = softwareProposalStatusConfig[proposal.status]?.icon || Monitor;
  const proposalItems = proposal.items || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/qtv-khoa',
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: '/qtv-khoa/quan-ly-de-xuat-phan-mem',
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
              
              {proposal.approver && proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Đã được duyệt</p>
                    <p className="font-medium text-gray-900">
                      Bởi: {proposal.approver.fullName}
                    </p>
                  </div>
                </div>
              )}
              
              {proposal.technician && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Kỹ thuật viên được phân công</p>
                    <p className="font-medium text-gray-900">
                      {proposal.technician.fullName}
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

        {/* Right Column - Timeline */}
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
              {proposal.approver && proposal.status === SoftwareProposalStatus.ĐÃ_DUYỆT && (
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
                    {proposal.technician && (
                      <p className="text-sm text-gray-500">
                        Kỹ thuật viên: {proposal.technician.fullName}
                      </p>
                    )}
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
                    {proposal.technician && (
                      <p className="text-sm text-gray-500">
                        Hoàn thành bởi: {proposal.technician.fullName}
                      </p>
                    )}
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
    </div>
  );
}