'use client'

import { RepairStatus } from '@/types'
import { useState } from 'react'
import { Button, Form, Input, Select, Space, Radio, Card, Alert } from 'antd'
import { CheckCircle, Settings, Package, FileText } from 'lucide-react'
import ReplacementPartsInput, { ReplacementPart } from './ReplacementPartsInput'

const { Option } = Select
const { TextArea } = Input

interface Props {
	initStatus: RepairStatus
	requestId?: string
	onCreateReplacement: (parts: ReplacementPart[]) => void
	onStatusUpdate?: (newStatus: RepairStatus, notes: string) => void
}

export default function ActionPanel({ initStatus, requestId, onCreateReplacement, onStatusUpdate }: Props) {
	const [form] = Form.useForm()
	const [status, setStatus] = useState<RepairStatus>(initStatus)
	const [inspectionResult, setInspectionResult] = useState<'software' | 'hardware' | 'replacement' | ''>('')
	const [showReplacementParts, setShowReplacementParts] = useState(false)

	const onFinish = (values: any) => {
		console.log('Form values:', values)
		
		// Xác định trạng thái mới dựa trên kết quả kiểm tra
		let newStatus = status
		if (inspectionResult === 'software') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
		} else if (inspectionResult === 'hardware') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
		} else if (inspectionResult === 'replacement') {
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
			)
		}

		if (status === RepairStatus.ĐÃ_TIẾP_NHẬN) {
			return (
				<Form
					form={form}
					onFinish={onFinish}
					layout="vertical"
					initialValues={{ status: RepairStatus.ĐANG_XỬ_LÝ }}
				>
					<Form.Item>
						<Button 
							type="primary" 
							icon={<Settings />}
							onClick={() => {
								setStatus(RepairStatus.ĐANG_XỬ_LÝ)
								if (onStatusUpdate) {
									onStatusUpdate(RepairStatus.ĐANG_XỬ_LÝ, 'Bắt đầu kiểm tra và xử lý')
								}
							}}
						>
							Bắt đầu kiểm tra
						</Button>
					</Form.Item>
				</Form>
			)
		}

		if (status === RepairStatus.ĐANG_XỬ_LÝ) {
			return (
				<Form
					form={form}
					onFinish={onFinish}
					layout="vertical"
				>
					<Form.Item 
						name="inspectionResult" 
						label="Kết quả kiểm tra thực tế"
						rules={[{ required: true, message: 'Vui lòng chọn kết quả kiểm tra!' }]}
					>
						<Radio.Group onChange={(e) => {
							setInspectionResult(e.target.value)
							setShowReplacementParts(e.target.value === 'replacement')
						}}>
							<Space direction="vertical">
								<Radio value="software">Lỗi phần mềm - Đã sửa được</Radio>
								<Radio value="hardware">Lỗi phần cứng - Đã sửa được</Radio>
								<Radio value="replacement">Cần thay thế linh kiện</Radio>
							</Space>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						name="notes"
						label="Mô tả chi tiết quá trình xử lý"
						rules={[{ required: true, message: 'Vui lòng mô tả quá trình xử lý!' }]}
					>
						<TextArea 
							rows={4} 
							placeholder="Mô tả các bước đã thực hiện, nguyên nhân lỗi, cách khắc phục..."
						/>
					</Form.Item>

					{showReplacementParts && (
						<Form.Item 
							name="replacementParts" 
							label="Linh kiện cần thay thế"
						>
							<ReplacementPartsInput />
						</Form.Item>
					)}

					<Form.Item>
						<Button type="primary" htmlType="submit" icon={<FileText />}>
							Cập nhật kết quả xử lý
						</Button>
					</Form.Item>
				</Form>
			)
		}

		if (status === RepairStatus.CHỜ_THAY_THẾ) {
			return (
				<Card>
					<Alert
						message="Đang chờ thay thế linh kiện"
						description="Đã tạo đề xuất thay thế linh kiện. Vui lòng theo dõi tiến độ tại trang 'Quản lý thay thế linh kiện'."
						type="warning"
						icon={<Package />}
						showIcon
						action={
							<Button 
								size="small" 
								type="link"
								onClick={() => window.open('/ky-thuat-vien/quan-ly-thay-the-linh-kien', '_blank')}
							>
								Xem danh sách
							</Button>
						}
					/>
				</Card>
			)
		}

		if (status === RepairStatus.ĐÃ_HOÀN_THÀNH) {
			return (
				<Alert
					message="Yêu cầu đã hoàn thành"
					description="Quá trình sửa chữa/thay thế đã hoàn tất."
					type="success"
					icon={<CheckCircle />}
					showIcon
				/>
			)
		}

		return null
	}

	return (
		<div className="bg-white shadow rounded-lg p-6 space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
				<Settings className="w-5 h-5" />
				Xử lý yêu cầu
			</h3>
			{renderContent()}
		</div>
	)
}



