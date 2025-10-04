"use client";

import { RepairStatus } from '@/types'
import { ReplacementPart } from '@/lib/mockData'
import { useState } from 'react'
import { Button, Form, Input, Radio, Card, Alert } from 'antd'
import { CheckCircle, Settings, Package, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ReplacementPartsInput from './ReplacementPartsInput'
import { ProposalConfirmModal } from '@/components/modal'

const { TextArea } = Input;

interface Props {
	initStatus: RepairStatus
	assetId?: string // Thêm prop assetId
	errorTypeName?: string // Thêm prop errorTypeName để xác định loại lỗi
	requestCode?: string // Thêm prop requestCode
	assetName?: string // Thêm prop assetName
	onCreateReplacement: (parts: ReplacementPart[]) => void
	onStatusUpdate?: (newStatus: RepairStatus, notes: string) => void
}

export default function ActionPanel({ initStatus, assetId, errorTypeName, requestCode, assetName, onCreateReplacement, onStatusUpdate }: Props) {
	const router = useRouter()
	const [form] = Form.useForm()
	const [status, setStatus] = useState<RepairStatus>(initStatus)
	const [inspectionResult, setInspectionResult] = useState<'software' | 'hardware' | 'replacement' | ''>('')
	const [showReplacementParts, setShowReplacementParts] = useState(false)
	const [showProposalModal, setShowProposalModal] = useState(false)
	const [formValues, setFormValues] = useState<FormValues | null>(null) // Lưu form values để xử lý sau

	// Xác định loại lỗi dựa trên errorTypeName - tuân thủ database schema
	const getErrorCategory = () => {
		if (!errorTypeName) return 'unknown'
		
		// Chỉ có ET002 "Máy hư phần mềm" mới là lỗi phần mềm duy nhất trong database
		if (errorTypeName === "Máy hư phần mềm") {
			return 'software'
		}
		
		// Tất cả các loại lỗi khác đều là lỗi phần cứng
		const hardwareErrors = [
			"Máy không khởi động",      // ET001
			"Máy hư bàn phím",         // ET003  
			"Máy hư chuột",            // ET004
			"Máy không sử dụng được",   // ET005
			"Máy hư loa",              // ET006
			"Máy hư màn hình",         // ET007
			"Máy hư ổ cứng",           // ET008
			"Máy chạy chậm",           // ET009
			"Máy nhiễm virus",         // ET010
			"Máy không kết nối mạng",   // ET011
			"Máy hư RAM",              // ET012
			"Máy hư nguồn",            // ET013
			"Máy mất bàn phím",        // ET014
			"Máy mất chuột"            // ET015
		]
		
		if (hardwareErrors.includes(errorTypeName)) {
			return 'hardware'
		}
		
		// Mặc định là hardware nếu không xác định được
		return 'hardware'
	}

  // Xác định loại lỗi dựa trên errorTypeName
  const getErrorCategory = () => {
    if (!errorTypeName) return "unknown";

	// Interface cho form values
	interface FormValues {
		inspectionResult: string
		notes: string
		replacementParts?: ReplacementPart[]
	}

	const onFinish = (values: FormValues) => {
		console.log('Form values:', values)
		
		// Lưu form values và hiển thị modal xác nhận
		setFormValues(values)
		setShowProposalModal(true)
	}

	// Xử lý khi người dùng xác nhận lập phiếu đề xuất
	const handleConfirmCreateProposal = () => {
		if (formValues) {
			processFormSubmission(formValues)
			// Chuyển đến trang lập phiếu đề xuất
			router.push('/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat')
		}
		setShowProposalModal(false)
	}

	// Xử lý khi người dùng chọn trở về danh sách
	const handleConfirmReturnToList = () => {
		if (formValues) {
			processFormSubmission(formValues)
			// Chuyển về trang danh sách
			router.push('/ky-thuat-vien/quan-ly-bao-loi')
		}
		setShowProposalModal(false)
	}

	// Hàm xử lý form submission chung
	const processFormSubmission = (values: FormValues) => {
		// Xác định trạng thái mới dựa trên kết quả kiểm tra
		let newStatus = status
		if (values.inspectionResult === 'software') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
		} else if (values.inspectionResult === 'hardware') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
		} else if (values.inspectionResult === 'replacement') {
			newStatus = RepairStatus.CHỜ_THAY_THẾ
			// Nếu có linh kiện cần thay thế, tạo đề xuất
			if (values.replacementParts && values.replacementParts.length > 0) {
				onCreateReplacement(values.replacementParts)
			}
		}
		
		// Gọi callback để cập nhật trạng thái
		if (onStatusUpdate) {
			onStatusUpdate(newStatus, values.notes || '')
		}
	}

    // Mặc định là phần mềm nếu không xác định được
    return "software";
  };

  const errorCategory = getErrorCategory();

  const onFinish = (values: {
    inspectionResult: string;
    notes: string;
    replacementParts?: ReplacementPart[];
  }) => {
    console.log("Form values:", values);

    // Xác định trạng thái mới dựa trên kết quả kiểm tra
    let newStatus = status;
    if (values.inspectionResult === "software") {
      newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH;
    } else if (values.inspectionResult === "hardware") {
      newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH;
    } else if (values.inspectionResult === "replacement") {
      newStatus = RepairStatus.CHỜ_THAY_THẾ;
      // Nếu có linh kiện cần thay thế, tạo đề xuất
      if (values.replacementParts && values.replacementParts.length > 0) {
        onCreateReplacement(values.replacementParts);
      }
    }

    // Gọi callback để cập nhật trạng thái
    if (onStatusUpdate) {
      onStatusUpdate(newStatus, values.notes || "");
    }
  };

  // Hiển thị UI khác nhau tùy theo trạng thái
  const renderContent = () => {
    if (status === RepairStatus.CHỜ_TIẾP_NHẬN) {
      return (
        <Alert
          message="Yêu cầu đã được tiếp nhận"
          description="Hệ thống đã tự động cập nhật trạng thái. Vui lòng đến kiểm tra thực tế và cập nhật kết quả."
          type="info"
          icon={<CheckCircle />}
          showIcon
        />
      );
    }

    if (status === RepairStatus.ĐÃ_TIẾP_NHẬN) {
      return (
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ status: RepairStatus.ĐANG_XỬ_LÝ }}>
          <Form.Item>
            <Button
              type="primary"
              icon={<Settings />}
              onClick={() => {
                setStatus(RepairStatus.ĐANG_XỬ_LÝ);
                if (onStatusUpdate) {
                  onStatusUpdate(
                    RepairStatus.ĐANG_XỬ_LÝ,
                    "Bắt đầu kiểm tra và xử lý"
                  );
                }
              }}>
              Bắt đầu kiểm tra
            </Button>
          </Form.Item>
        </Form>
      );
    }

    if (status === RepairStatus.ĐANG_XỬ_LÝ) {
      return (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Alert
            message={`Xử lý lỗi ${
              errorCategory === "hardware"
                ? "phần cứng"
                : errorCategory === "software"
                ? "phần mềm"
                : "không xác định"
            }`}
            description={
              errorCategory === "hardware"
                ? "Đối với lỗi phần cứng, bạn có thể sửa chữa tại chỗ hoặc yêu cầu thay thế linh kiện."
                : errorCategory === "software"
                ? "Đối với lỗi phần mềm, thường có thể khắc phục bằng cách cài đặt lại, cập nhật driver hoặc xử lý virus."
                : "Vui lòng kiểm tra và xác định loại lỗi để xử lý phù hợp."
            }
            type="info"
            showIcon
            className="mb-4"
          />

          <Form.Item
            name="inspectionResult"
            label="Kết quả kiểm tra thực tế"
            rules={[
              { required: true, message: "Vui lòng chọn kết quả kiểm tra!" },
            ]}>
            <Radio.Group
              onChange={(e) => {
                setInspectionResult(e.target.value);
                setShowReplacementParts(e.target.value === "replacement");
              }}>
              <div className="space-y-3">
                {/* Hiển thị option phần mềm chỉ khi errorCategory là software */}
                {errorCategory === "software" && (
                  <Radio value="software" className="flex items-start">
                    <div className="ml-2">
                      <div className="font-medium">
                        Lỗi phần mềm - Đã sửa được
                      </div>
                      <div className="text-sm text-gray-500">
                        Cài đặt lại phần mềm, cập nhật driver, khắc phục
                        virus...
                      </div>
                    </div>
                  </Radio>
                )}

                {/* Hiển thị options phần cứng chỉ khi errorCategory là hardware */}
                {errorCategory === "hardware" && (
                  <>
                    <Radio value="hardware" className="flex items-start">
                      <div className="ml-2">
                        <div className="font-medium">
                          Lỗi phần cứng - Đã sửa được
                        </div>
                        <div className="text-sm text-gray-500">
                          Sửa chữa tại chỗ, thay cáp kết nối, làm sạch tiếp
                          xúc...
                        </div>
                      </div>
                    </Radio>
                    <Radio value="replacement" className="flex items-start">
                      <div className="ml-2">
                        <div className="font-medium">
                          Cần thay thế linh kiện
                        </div>
                        <div className="text-sm text-gray-500">
                          Linh kiện hỏng không thể sửa chữa, cần thay thế mới
                        </div>
                      </div>
                    </Radio>
                  </>
                )}

                {/* Hiển thị tất cả options nếu không xác định được loại lỗi */}
                {errorCategory === "unknown" && (
                  <>
                    <Radio value="software" className="flex items-start">
                      <div className="ml-2">
                        <div className="font-medium">
                          Lỗi phần mềm - Đã sửa được
                        </div>
                        <div className="text-sm text-gray-500">
                          Cài đặt lại phần mềm, cập nhật driver, khắc phục
                          virus...
                        </div>
                      </div>
                    </Radio>
                    <Radio value="hardware" className="flex items-start">
                      <div className="ml-2">
                        <div className="font-medium">
                          Lỗi phần cứng - Đã sửa được
                        </div>
                        <div className="text-sm text-gray-500">
                          Sửa chữa tại chỗ, thay cáp kết nối, làm sạch tiếp
                          xúc...
                        </div>
                      </div>
                    </Radio>
                    <Radio value="replacement" className="flex items-start">
                      <div className="ml-2">
                        <div className="font-medium">
                          Cần thay thế linh kiện
                        </div>
                        <div className="text-sm text-gray-500">
                          Linh kiện hỏng không thể sửa chữa, cần thay thế mới
                        </div>
                      </div>
                    </Radio>
                  </>
                )}
              </div>
            </Radio.Group>
          </Form.Item>

	return (
		<>
			<div className="bg-white shadow rounded-lg p-6 space-y-4">
				<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<Settings className="w-5 h-5" />
					Xử lý yêu cầu
				</h3>
				{renderContent()}
			</div>

			{/* Modal xác nhận lập phiếu đề xuất */}
			<ProposalConfirmModal
				isOpen={showProposalModal}
				onClose={() => setShowProposalModal(false)}
				onConfirmCreate={handleConfirmCreateProposal}
				onConfirmReturn={handleConfirmReturnToList}
				requestCode={requestCode || ''}
				assetName={assetName}
				isLoading={false}
			/>
		</>
	)
}
