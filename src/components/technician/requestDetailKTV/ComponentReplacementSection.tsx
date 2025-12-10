"use client"

import { useState, useEffect } from 'react'
import { Card, Alert, Button, Form, Input, message, Tag, Select } from 'antd'
import { Package, ArrowRight, CheckCircle2, AlertCircle, Info, RefreshCw, CheckCircle } from 'lucide-react'
import { ReplacementItem } from '@/lib/api/replacement-proposals'
import { replaceComponent, getComponentById, getStockComponents, StockComponentDto } from '@/lib/api/components'
import { completeRepair } from '@/lib/api/repairs'
import { RepairStatus } from '@/types'
import { ReplacementProposalStatus } from '@/types/repair'

const { Option } = Select

interface ComponentReplacementSectionProps {
	repairRequestId: string
	items: ReplacementItem[]
	onReplaced?: () => void
}

export default function ComponentReplacementSection({
	repairRequestId,
	items,
	onReplaced
}: ComponentReplacementSectionProps) {
	const [form] = Form.useForm()
	const [replacingItemId, setReplacingItemId] = useState<string | null>(null)
	const [replaceFormVisible, setReplaceFormVisible] = useState<Record<string, boolean>>({})
	// State cho linh kiện trong kho và mapping thay thế
	const [stockComponents, setStockComponents] = useState<StockComponentDto[]>([])
	const [replacementMapping, setReplacementMapping] = useState<Record<string, string>>({}) // oldComponentId -> newComponentId
	const [availableReplacements, setAvailableReplacements] = useState<Record<string, StockComponentDto[]>>({}) // componentType -> StockComponentDto[]

	// Load stock components on mount
	useEffect(() => {
		const fetchStockComponents = async () => {
			try {
				const stock = await getStockComponents()
				setStockComponents(stock)
				
				// Group by componentType
				const grouped: Record<string, StockComponentDto[]> = {}
				stock.forEach(comp => {
					const type = comp.componentType
					if (!grouped[type]) {
						grouped[type] = []
					}
					grouped[type].push(comp)
				})
				setAvailableReplacements(grouped)
			} catch (error) {
				console.error('Error fetching stock components:', error)
				// Không hiển thị lỗi vì đây là tính năng bổ sung
			}
		}
		
		fetchStockComponents()
	}, [])

	// Chỉ hiển thị các items thuộc đề xuất đã hoàn tất mua sắm
	const displayItems = items.filter(
		item => item.proposalStatus === ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
	)

	// Lọc các items có thể thay thế (có oldComponentId và chưa được thay thế) trong các DXTT đã hoàn tất mua sắm
	const replaceableItems = displayItems.filter(
		item => item.oldComponentId && item.oldComponent?.status !== 'REMOVED'
	)

	// Kiểm tra xem tất cả linh kiện (mọi DXTT) đã được thay thế chưa
	const allPendingAcrossAll = items.filter(
		item => item.oldComponentId && item.oldComponent?.status !== 'REMOVED'
	)
	const allReplaced = allPendingAcrossAll.length === 0

	// Hàm xử lý thay thế linh kiện
	const handleReplaceComponent = async (item: ReplacementItem) => {
		if (!item.oldComponentId) {
			message.error('Thiếu thông tin linh kiện cần thay thế')
			return
		}

		try {
			setReplacingItemId(item.id)
			
			// Lấy giá trị từ form hoặc từ replacement mapping (nếu chọn từ kho)
			const formValues = form.getFieldsValue()
			const itemKey = `item_${item.id}`
			
			// Kiểm tra xem có chọn linh kiện từ kho không
			const selectedStockComponentId = replacementMapping[item.oldComponentId!]
			let newItemName: string
			let newItemSpecs: string
			let serialNumber: string | undefined
			
			if (selectedStockComponentId) {
				// Nếu có chọn từ kho, lấy thông tin từ stock component
				const stockComponent = stockComponents.find(c => c.id === selectedStockComponentId)
				if (!stockComponent) {
					throw new Error('Không tìm thấy thông tin linh kiện đã chọn từ kho')
				}
				newItemName = stockComponent.name
				newItemSpecs = stockComponent.componentSpecs || ''
				serialNumber = stockComponent.serialNumber
			} else {
				// Nếu không chọn từ kho, lấy từ form (nhập thủ công)
				newItemName = formValues[`${itemKey}_name`] || item.newItemName
				newItemSpecs = formValues[`${itemKey}_specs`] || item.newItemSpecs || ''
				serialNumber = formValues[`${itemKey}_serial`] || undefined
			}
			
			const notes = formValues[`${itemKey}_notes`] || `Thay thế linh kiện cho YCSC ${item.requestCode || repairRequestId}`

			// Lấy computerId từ oldComponent
			let computerId: string | null = null
			
			try {
				const componentDetail = await getComponentById(item.oldComponentId)
				if (componentDetail?.computer?.id) {
					computerId = componentDetail.computer.id
				}
			} catch (error) {
				console.error('Error getting component detail:', error)
				throw new Error('Không thể lấy thông tin máy tính chứa linh kiện này')
			}

			if (!computerId) {
				throw new Error(
					'Không thể xác định máy tính chứa linh kiện này. Vui lòng kiểm tra lại thông tin linh kiện cũ.'
				)
			}

			// Gọi API thay thế linh kiện
			await replaceComponent(computerId, {
				oldComponentId: item.oldComponentId,
				newItemName,
				newItemSpecs,
				serialNumber,
				notes,
				newlyPurchasedComponentId: selectedStockComponentId || item.newlyPurchasedComponentId,
			})
			
			// Xóa mapping sau khi thay thế thành công
			if (selectedStockComponentId) {
				setReplacementMapping(prev => {
					const newMapping = { ...prev }
					delete newMapping[item.oldComponentId!]
					return newMapping
				})
			}

			message.success(`Đã thay thế linh kiện "${newItemName}" thành công!`)
			
			// Đóng form
			setReplaceFormVisible(prev => ({ ...prev, [item.id]: false }))
			
			// Kiểm tra xem tất cả linh kiện đã được thay thế chưa
			// Nếu có, tự động cập nhật repair request status thành ĐÃ_HOÀN_THÀNH
			if (onReplaced) {
				await onReplaced()
			}
		} catch (error) {
			console.error('Error replacing component:', error)
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi thay thế linh kiện!'
			message.error(errorMessage)
		} finally {
			setReplacingItemId(null)
		}
	}

	// Nếu không có items hoặc không có items cần thay thế, không hiển thị
	if (!displayItems || displayItems.length === 0) {
		return null
	}

	// Chỉ hiển thị khi có items cần thay thế hoặc đã có items được thay thế
	const hasReplaceableItems = replaceableItems.length > 0
	const hasReplacedItems = displayItems.some(item => item.oldComponent?.status === 'REMOVED')

	if (!hasReplaceableItems && !hasReplacedItems) {
		return null
	}

	return (
		<Card 
			title={
				<div className="flex items-center gap-2">
					<Package className="w-5 h-5 text-blue-600" />
					<span>Xử lý thay thế linh kiện</span>
					<Tag color="blue" className="ml-auto">
						{replaceableItems.length} có thể thay thế
					</Tag>
				</div>
			}
			className="shadow-lg border-2 border-blue-100"
		>
			{allReplaced ? (
				<Alert
					message="Tất cả linh kiện đã được thay thế"
					description="Tất cả linh kiện trong yêu cầu sửa chữa này đã được thay thế thành công."
					type="success"
					icon={<CheckCircle2 className="w-5 h-5" />}
					showIcon
				/>
			) : (
				<>
					<Alert
						message="Linh kiện đã sẵn sàng để thay thế"
						description={
							<div className="mt-2">
								<p className="mb-1">Vui lòng thực hiện thay thế linh kiện cho các linh kiện trong danh sách bên dưới.</p>
								<ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
									<li>Linh kiện cũ sẽ được chuyển sang trạng thái <strong>REMOVED</strong></li>
									<li>Linh kiện mới sẽ có trạng thái <strong>INSTALLED</strong></li>
									<li>Hệ thống sẽ tự động cập nhật thời gian và log liên quan</li>
									<li>Khi hoàn thành tất cả linh kiện, YCSC sẽ tự động chuyển sang trạng thái <strong>ĐÃ_HOÀN_THÀNH</strong></li>
								</ul>
							</div>
						}
						type="info"
						icon={<Info className="w-5 h-5" />}
						className="mb-6"
					/>
					<div className="space-y-4">
						{displayItems.map((item) => {
							const isReplacing = replacingItemId === item.id
							const showForm = replaceFormVisible[item.id]
							const canReplace = item.oldComponentId && item.oldComponent?.status !== 'REMOVED'
							const isReplaced = item.oldComponent?.status === 'REMOVED'

							if (!canReplace) {
								return (
									<div 
										key={item.id} 
										className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50 transition-all hover:shadow-md"
									>
										<div className="flex items-start gap-3">
											<div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
												isReplaced ? 'bg-green-100' : 'bg-yellow-100'
											}`}>
												{isReplaced ? (
													<CheckCircle2 className="w-6 h-6 text-green-600" />
												) : (
													<AlertCircle className="w-6 h-6 text-yellow-600" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-3 mb-2">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 flex-wrap mb-1">
															<h4 className="font-semibold text-gray-900 text-base">{item.newItemName}</h4>
														</div>
														{item.newItemSpecs && (
															<p className="text-sm text-gray-600 mb-2">{item.newItemSpecs}</p>
														)}
													</div>
												</div>
												<div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs ${
													isReplaced 
														? 'bg-green-50 text-green-700' 
														: 'bg-yellow-50 text-yellow-700'
												}`}>
													{isReplaced ? (
														<>
															<CheckCircle2 className="w-3.5 h-3.5" />
															<span>Đã được thay thế thành công</span>
														</>
													) : (
														<>
															<AlertCircle className="w-3.5 h-3.5" />
															<span>Không thể thay thế (thiếu thông tin linh kiện cũ)</span>
														</>
													)}
												</div>
												{item.oldComponent && (
													<div className="mt-2 pt-2 border-t border-gray-200">
														<p className="text-xs text-gray-500">
															Linh kiện cũ: <span className="font-medium text-gray-700">{item.oldComponent.name}</span> ({item.oldComponent.componentType})
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								)
							}

							return (
								<div 
									key={item.id} 
									className={`relative border-2 rounded-lg p-4 transition-all duration-300 ${
										showForm 
											? 'border-blue-400 bg-blue-50 shadow-lg' 
											: 'border-blue-200 bg-white hover:border-blue-300 hover:shadow-md'
									}`}
								>
									{/* Header Section */}
									<div className="flex items-start gap-3 mb-3">
										<div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
											<Package className="w-5 h-5 text-blue-600" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-3 mb-2">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 flex-wrap mb-1">
														<h4 className="font-semibold text-gray-900 text-base">{item.newItemName}</h4>
													</div>
													{item.newItemSpecs && (
														<p className="text-sm text-gray-600 mb-2">{item.newItemSpecs}</p>
													)}
													{item.oldComponent && (
														<div className="flex items-center gap-2 text-sm flex-wrap">
															<span className="text-gray-500">Thay thế cho:</span>
															<span className="font-medium text-gray-900">{item.oldComponent.name}</span>
															<Tag color="default" className="text-xs">{item.oldComponent.componentType}</Tag>
														</div>
													)}
												</div>
												{!showForm && (
													<Button
														type="primary"
														size="middle"
														icon={<RefreshCw className="w-4 h-4" />}
														onClick={() => {
															setReplaceFormVisible(prev => ({ ...prev, [item.id]: true }))
															form.setFieldsValue({
																[`item_${item.id}_name`]: item.newItemName,
																[`item_${item.id}_specs`]: item.newItemSpecs || '',
																[`item_${item.id}_serial`]: '',
																[`item_${item.id}_notes`]: `Thay thế linh kiện cho YCSC ${item.requestCode || repairRequestId}`,
															})
														}}
														className="shrink-0"
													>
														Bắt đầu thay thế
													</Button>
												)}
											</div>
										</div>
									</div>

									{/* Form Section */}
									{showForm && (
										<div className="mt-4 pt-4 border-t-2 border-blue-200">
											<div className="mb-3 flex items-center gap-2 text-blue-700">
												<Info className="w-4 h-4" />
												<span className="text-sm font-medium">Điền thông tin linh kiện mới</span>
											</div>
											
											{/* Comparison View - Compact */}
											<div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
												<div className="flex items-center gap-3">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
															<Package className="w-3.5 h-3.5 text-red-500" />
															Linh kiện cũ
														</div>
														{item.oldComponent && (
															<>
																<p className="font-semibold text-sm text-gray-900 truncate">{item.oldComponent.name}</p>
																{item.oldComponent.componentSpecs && (
																	<p className="text-xs text-gray-600 truncate">{item.oldComponent.componentSpecs}</p>
																)}
																<Tag color="red" className="text-xs mt-1">{item.oldComponent.status}</Tag>
															</>
														)}
													</div>
													<div className="shrink-0 px-2">
														<ArrowRight className="w-5 h-5 text-blue-400" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
															<Package className="w-3.5 h-3.5 text-green-500" />
															Linh kiện mới
														</div>
														<p className="text-xs text-gray-500 italic">Sẽ được cập nhật sau khi điền form</p>
													</div>
												</div>
											</div>

											<Form
												form={form}
												layout="vertical"
												className="space-y-3"
											>
												{/* Chọn linh kiện từ kho */}
												{item.oldComponent && (
													<Form.Item
														label={<span className="font-medium text-sm">Chọn linh kiện thay thế từ kho (tùy chọn)</span>}
														className="mb-0"
													>
														<Select
															placeholder="Chọn linh kiện từ kho hoặc để trống để nhập thủ công"
															value={replacementMapping[item.oldComponentId!]}
															onChange={(value) => {
																setReplacementMapping(prev => ({
																	...prev,
																	[item.oldComponentId!]: value
																}))
																
																// Tự động điền thông tin khi chọn từ kho
																if (value) {
																	const stockComp = stockComponents.find(c => c.id === value)
																	if (stockComp) {
																		form.setFieldsValue({
																			[`item_${item.id}_name`]: stockComp.name,
																			[`item_${item.id}_specs`]: stockComp.componentSpecs || '',
																			[`item_${item.id}_serial`]: stockComp.serialNumber || '',
																		})
																	}
																} else {
																	// Xóa mapping và reset form về giá trị mặc định
																	form.setFieldsValue({
																		[`item_${item.id}_name`]: item.newItemName,
																		[`item_${item.id}_specs`]: item.newItemSpecs || '',
																		[`item_${item.id}_serial`]: '',
																	})
																}
															}}
															allowClear
															showSearch
															filterOption={(input, option) => {
																const label = typeof option?.label === 'string' 
																	? option.label 
																	: String(option?.children || '')
																return label.toLowerCase().includes(input.toLowerCase())
															}}
														>
															{(availableReplacements[item.oldComponent.componentType] || []).map(stockComp => (
																<Option key={stockComp.id} value={stockComp.id}>
																	{stockComp.name} {stockComp.componentSpecs && `- ${stockComp.componentSpecs}`}
																	{stockComp.serialNumber && ` (SN: ${stockComp.serialNumber})`}
																</Option>
															))}
														</Select>
														<div className="text-xs text-gray-500 mt-1">
															{(availableReplacements[item.oldComponent.componentType] || []).length > 0 
																? `Có ${(availableReplacements[item.oldComponent.componentType] || []).length} linh kiện cùng loại trong kho`
																: 'Không có linh kiện cùng loại trong kho. Vui lòng nhập thủ công.'}
														</div>
													</Form.Item>
												)}

												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<Form.Item
														label={<span className="font-medium text-sm">Tên linh kiện mới <span className="text-red-500">*</span></span>}
														name={`item_${item.id}_name`}
														rules={[{ required: true, message: 'Vui lòng nhập tên linh kiện' }]}
														className="mb-0"
													>
														<Input 
															placeholder="Nhập tên linh kiện mới" 
															size="middle"
															prefix={<Package className="w-4 h-4 text-gray-400" />}
															disabled={!!replacementMapping[item.oldComponentId!]}
														/>
													</Form.Item>

													<Form.Item
														label={<span className="font-medium text-sm">Số serial (tùy chọn)</span>}
														name={`item_${item.id}_serial`}
														className="mb-0"
													>
														<Input 
															placeholder="Nhập số serial nếu có" 
															size="middle"
															disabled={!!replacementMapping[item.oldComponentId!]}
														/>
													</Form.Item>
												</div>

												<Form.Item
													label={<span className="font-medium text-sm">Thông số kỹ thuật <span className="text-red-500">*</span></span>}
													name={`item_${item.id}_specs`}
													rules={[{ required: true, message: 'Vui lòng nhập thông số kỹ thuật' }]}
													className="mb-0"
												>
													<Input.TextArea 
														rows={2} 
														placeholder="Nhập thông số kỹ thuật linh kiện mới" 
														className="resize-none"
														disabled={!!replacementMapping[item.oldComponentId!]}
													/>
												</Form.Item>

												<Form.Item
													label={<span className="font-medium text-sm">Ghi chú</span>}
													name={`item_${item.id}_notes`}
													className="mb-0"
												>
													<Input.TextArea 
														rows={2} 
														placeholder="Ghi chú về việc thay thế (tùy chọn)" 
														className="resize-none"
													/>
												</Form.Item>

												<div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
													<Button
														size="middle"
														onClick={() => {
															setReplaceFormVisible(prev => ({ ...prev, [item.id]: false }))
														}}
													>
														Hủy
													</Button>
													<Button
														type="primary"
														size="middle"
														loading={isReplacing}
														icon={!isReplacing && <CheckCircle className="w-4 h-4" />}
														onClick={() => handleReplaceComponent(item)}
													>
														{isReplacing ? 'Đang xử lý...' : 'Xác nhận thay thế'}
													</Button>
												</div>
											</Form>
										</div>
									)}
								</div>
							)
						})}
					</div>
				</>
			)}
		</Card>
	)
}

