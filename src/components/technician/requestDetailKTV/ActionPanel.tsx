'use client'

import { RepairStatus, Component, ComponentStatus, ComponentType } from '@/types'
import { useState, useEffect } from 'react'
import { Button, Form, Input, Radio, Card, Alert, Select, message } from 'antd'
import { CheckCircle, Settings, Package, FileText } from 'lucide-react'
import { getComponentsByAssetId } from '@/lib/api/components'

const { TextArea } = Input
const { Option } = Select

interface Props {
	initStatus: RepairStatus
	assetId?: string // Asset ID để lấy danh sách linh kiện
	errorTypeName?: string // Tên loại lỗi để xác định category
	onCreateReplacement: () => void // Callback khi cần tạo đề xuất thay thế (không cần parts nữa)
	onStatusUpdate?: (
		newStatus: RepairStatus,
		notes: string,
		componentIds?: string[],
		options?: { showSuccessModal?: boolean }
	) => void
}

export default function ActionPanel({ initStatus, assetId, errorTypeName, onCreateReplacement, onStatusUpdate }: Props) {
	const [form] = Form.useForm()
	const [status, setStatus] = useState<RepairStatus>(initStatus)
	const [inspectionResult, setInspectionResult] = useState<'software' | 'hardware' | 'replacement' | ''>('')
	const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([])
	const [filteredComponents, setFilteredComponents] = useState<Component[]>([])
	const [loadingComponents, setLoadingComponents] = useState(false)

	const getErrorCategory = () => {
		if (!errorTypeName) return 'unknown'
		
		if (errorTypeName === "Máy hư phần mềm") {
			return 'software'
		}
		
		// Tất cả các loại lỗi khác đều là lỗi phần cứng
		const hardwareErrors = [
			"Máy không khởi động",      
			"Máy hư bàn phím",        
			"Máy hư chuột",            
			"Máy không sử dụng được",   
			"Máy hư loa",              
			"Máy hư màn hình",        		
			"Máy hư ổ cứng",           
			"Máy chạy chậm",           
			"Máy nhiễm virus",         
			"Máy không kết nối mạng",   
			"Máy hư RAM",              
			"Máy hư nguồn",            
			"Máy mất bàn phím",        
			"Máy mất chuột"            
		]
		
		if (hardwareErrors.includes(errorTypeName)) {
			return 'hardware'
		}
		
		return 'hardware'
	}

	const errorCategory = getErrorCategory()

	// Fetch components khi assetId thay đổi
	useEffect(() => {
		const fetchComponents = async () => {
			if (!assetId || errorCategory !== 'hardware') {
				setFilteredComponents([])
				return
			}

			setLoadingComponents(true)
			try {
				const components = await getComponentsByAssetId(assetId)
				// Map ComponentResponseDto to Component interface
				const mappedComponents: Component[] = components.map((comp) => ({
					id: comp.id,
					computerAssetId: assetId, // Sử dụng assetId
					componentType: comp.componentType as unknown as ComponentType,
					name: comp.name,
					componentSpecs: comp.componentSpecs,
					serialNumber: comp.serialNumber,
					status: comp.status as unknown as ComponentStatus,
					installedAt: comp.installedAt,
					removedAt: comp.removedAt,
					notes: comp.notes,
				}))
				setFilteredComponents(mappedComponents)
			} catch (error) {
				console.error('Error fetching components:', error)
				message.error('Không thể tải danh sách linh kiện')
				setFilteredComponents([])
			} finally {
				setLoadingComponents(false)
			}
		}

		fetchComponents()
	}, [assetId, errorCategory])

	// Interface cho form values
	interface FormValues {
		inspectionResult: string
		notes: string
		componentIds?: string[]
	}

	const onFinish = async (values: FormValues) => {
		console.log('Form values:', values)
		
		// Xác định trạng thái mới dựa trên kết quả kiểm tra
		let newStatus = status
		let componentIds: string[] | undefined = undefined
		
		if (values.inspectionResult === 'software') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
			// Lỗi phần mềm không cần componentIds
		} else if (values.inspectionResult === 'hardware') {
			newStatus = RepairStatus.ĐÃ_HOÀN_THÀNH
			// Lỗi phần cứng đã sửa được - bắt buộc phải có componentIds
			if (selectedComponentIds.length === 0) {
				message.error('Vui lòng chọn ít nhất 1 linh kiện bị lỗi')
				return
			}
			componentIds = selectedComponentIds
		} else if (values.inspectionResult === 'replacement') {
			newStatus = RepairStatus.CHỜ_THAY_THẾ
			// Cần thay thế linh kiện - bắt buộc phải có componentIds
			if (selectedComponentIds.length === 0) {
				message.error('Vui lòng chọn ít nhất 1 linh kiện cần thay thế')
				return
			}
			componentIds = selectedComponentIds
		}
		
		// Gọi callback để cập nhật trạng thái với componentIds
		if (onStatusUpdate) {
			try {
				await onStatusUpdate(newStatus, values.notes || '', componentIds, {
					showSuccessModal: true, // Chỉ hiển thị modal khi nhấn nút cập nhật kết quả
				})
				// Nếu là replacement và cập nhật thành công, chuyển đến trang tạo đề xuất
				if (values.inspectionResult === 'replacement') {
					onCreateReplacement()
				}
			} catch (error) {
				// Error đã được xử lý trong onStatusUpdate callback
				console.error('Update status error:', error)
			}
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
									onStatusUpdate(RepairStatus.ĐANG_XỬ_LÝ, 'Bắt đầu kiểm tra và xử lý', undefined, {
										showSuccessModal: false, // Không bật modal cho hành động bắt đầu kiểm tra
									})
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
					<Alert
						message={`Xử lý lỗi ${errorCategory === 'hardware' ? 'phần cứng' : errorCategory === 'software' ? 'phần mềm' : 'không xác định'}`}
						description={
							errorCategory === 'hardware' 
								? "Đối với lỗi phần cứng, bạn có thể sửa chữa tại chỗ hoặc yêu cầu thay thế linh kiện." 
								: errorCategory === 'software'
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
						rules={[{ required: true, message: 'Vui lòng chọn kết quả kiểm tra!' }]}
					>
						<Radio.Group onChange={(e) => {
							setInspectionResult(e.target.value)
							// Reset componentIds khi thay đổi kết quả
							if (e.target.value !== 'replacement' && e.target.value !== 'hardware') {
								setSelectedComponentIds([])
							}
						}}>
							<div className="space-y-3">
								{/* Hiển thị option phần mềm chỉ khi errorCategory là software */}
								{errorCategory === "software" && (
									<Radio value="software" className="flex items-start">
										<div className="ml-2">
											<div className="font-medium">Lỗi phần mềm - Đã sửa được</div>
											<div className="text-sm text-gray-500">Cài đặt lại phần mềm, cập nhật driver, khắc phục virus...</div>
										</div>
									</Radio>
								)}
								
								{/* Hiển thị options phần cứng chỉ khi errorCategory là hardware */}
								{errorCategory === "hardware" && (
									<>
										<Radio value="hardware" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Lỗi phần cứng - Đã sửa được</div>  
												<div className="text-sm text-gray-500">Sửa chữa tại chỗ, thay cáp kết nối, làm sạch tiếp xúc...</div>
											</div>
										</Radio>
										<Radio value="replacement" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Cần thay thế linh kiện</div>
												<div className="text-sm text-gray-500">Linh kiện hỏng không thể sửa chữa, cần thay thế mới</div>
											</div>
										</Radio>
									</>
								)}
								
								{/* Hiển thị tất cả options nếu không xác định được loại lỗi */}
								{errorCategory === "unknown" && (
									<>
										<Radio value="software" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Lỗi phần mềm - Đã sửa được</div>
												<div className="text-sm text-gray-500">Cài đặt lại phần mềm, cập nhật driver, khắc phục virus...</div>
											</div>
										</Radio>
										<Radio value="hardware" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Lỗi phần cứng - Đã sửa được</div>
												<div className="text-sm text-gray-500">Sửa chữa tại chỗ, thay cáp kết nối, làm sạch tiếp xúc...</div>
											</div>
										</Radio>
										<Radio value="replacement" className="flex items-start">
											<div className="ml-2">
												<div className="font-medium">Cần thay thế linh kiện</div>
												<div className="text-sm text-gray-500">Linh kiện hỏng không thể sửa chữa, cần thay thế mới</div>
											</div>
										</Radio>
									</>
								)}
							</div>
						</Radio.Group>
					</Form.Item>

					{/* Chọn linh kiện cho lỗi phần cứng - luôn hiển thị khi errorCategory là hardware */}
					{errorCategory === 'hardware' && (
						<Form.Item 
							label="Linh kiện cụ thể" 
							required
							help="Vui lòng chọn ít nhất 1 linh kiện bị lỗi"
							rules={[
								{ 
									validator: () => {
										if (selectedComponentIds.length === 0) {
											return Promise.reject('Vui lòng chọn ít nhất 1 linh kiện')
										}
										return Promise.resolve()
									}
								}
							]}
						>
							<Select
								mode="multiple"
								placeholder={
									!assetId 
										? "Không thể xác định thiết bị" 
										: loadingComponents
											? "Đang tải danh sách linh kiện..."
											: filteredComponents.length === 0
												? "Không có linh kiện nào"
												: "Chọn linh kiện bị lỗi"
								}
								value={selectedComponentIds}
								onChange={setSelectedComponentIds}
								disabled={!assetId || loadingComponents || filteredComponents.length === 0}
								loading={loadingComponents}
								notFoundContent={
									filteredComponents.length === 0 && assetId && !loadingComponents
										? "Không có linh kiện nào trong thiết bị này"
										: "Không có dữ liệu"
								}
							>
								{filteredComponents
									.filter(component => component.status == ComponentStatus.INSTALLED)
									.map(component => (
										<Option key={component.id} value={component.id}>
											{component.name} ({component.componentType})
										</Option>
									))}
							</Select>
						</Form.Item>
					)}

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

					{/* Cảnh báo khi chưa chọn linh kiện cho lỗi phần cứng */}
					{errorCategory === 'hardware' && 
					inspectionResult && 
					inspectionResult !== 'software' &&
					selectedComponentIds.length === 0 && (
						<Alert
							message="⚠️ Chưa chọn linh kiện"
							description="Vui lòng chọn ít nhất 1 linh kiện bị lỗi ở trên."
							type="warning"
							showIcon
							className="mb-4"
						/>
					)}

					{/* Hiển thị phần chọn linh kiện thay thế nếu cần */}
					{errorCategory === 'hardware' && inspectionResult === 'replacement' && (
						<div className="mt-4 p-4 border rounded-lg bg-orange-50 border-orange-200">
							<h4 className="text-md font-semibold text-orange-800 mb-3">Linh kiện cần thay thế</h4>
							{selectedComponentIds.length === 0 ? (
								<Alert
									message="⚠️ Bắt buộc: Chọn linh kiện cần thay thế"
									description="Bạn đã chọn 'Cần thay thế linh kiện'. Vui lòng chọn linh kiện cụ thể ở trên."
									type="error"
									showIcon
								/>
							) : (
								<Alert
									message={`Đã chọn ${selectedComponentIds.length} linh kiện để thay thế`}
									description={
										<div className="mt-2">
											<div className="text-sm">Linh kiện được chọn:</div>
											<ul className="mt-1 list-disc list-inside text-sm">
												{selectedComponentIds.map(id => {
													const component = filteredComponents.find(c => c.id === id);
													return component ? (
														<li key={id}>{component.name} ({component.componentType})</li>
													) : null;
												})}
											</ul>
										</div>
									}
									type="info"
									showIcon
								/>
							)}
						</div>
					)}

					{/* Thông báo trạng thái sẽ được cập nhật */}
					{inspectionResult && (
						<div className="my-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
							<div className="text-sm text-blue-800">
								<strong>💡 Trạng thái sẽ được cập nhật:</strong>
								<div className="mt-1">
									{inspectionResult === 'software' ? (
										<div>
											<span className="text-green-600 font-medium">→ Đã hoàn thành</span>
											<div className="text-xs text-gray-600 mt-1">Lỗi phần mềm đã được khắc phục hoàn toàn</div>
										</div>
									) : inspectionResult === 'hardware' ? (
										<div>
											<span className="text-green-600 font-medium">→ Đã hoàn thành</span>
											<div className="text-xs text-gray-600 mt-1">Lỗi phần cứng đã được sửa chữa thành công</div>
										</div>
									) : inspectionResult === 'replacement' ? (
										<div>
											<span className="text-orange-600 font-medium">→ Chờ thay thế linh kiện</span>
											<div className="text-xs text-gray-600 mt-1">Yêu cầu sẽ chuyển sang quy trình thay thế linh kiện</div>
										</div>
									) : (
										<span className="text-blue-900 font-medium">→ Đang xử lý</span>
									)}
								</div>
							</div>
						</div>
					)}

					<Form.Item>
						<Button 
							type="primary" 
							htmlType="submit" 
							icon={<FileText />}
							disabled={
								errorCategory === 'hardware' && 
								inspectionResult !== '' && 
								inspectionResult !== 'software' &&
								selectedComponentIds.length === 0
							}
						>
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
						description="Đã tạo đề xuất thay thế linh kiện. Vui lòng theo dõi tiến độ tại phần 'Quản lý thay thế linh kiện'."
						type="warning"
						icon={<Package />}
						showIcon
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