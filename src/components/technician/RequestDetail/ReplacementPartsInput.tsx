'use client'

import { useState, useEffect } from 'react'
import { Button, Form, Popconfirm, Select, InputNumber, Input } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Component, ComponentType, ComponentStatus } from '@/types'
import { mockComponents } from '@/lib/mockData/components'

export interface ReplacementPart {
	id: string
	componentId: string // Thay đổi từ name sang componentId
	componentType: ComponentType
	componentName: string
	componentSpecs?: string
	quantity: number
	note?: string
}

interface Props {
	value?: ReplacementPart[]
	onChange?: (value: ReplacementPart[]) => void
	assetId?: string // Thêm prop assetId để lọc components
}

export default function ReplacementPartsInput({ value = [], onChange, assetId }: Props) {
	const [parts, setParts] = useState<ReplacementPart[]>(value)
	const [availableComponents, setAvailableComponents] = useState<Component[]>([])

	// Lọc components theo assetId
	useEffect(() => {
		if (assetId) {
			const filtered = mockComponents.filter(
				(comp) => comp.computerAssetId === assetId && comp.status === ComponentStatus.INSTALLED
			)
			setAvailableComponents(filtered)
		} else {
			setAvailableComponents([])
		}
	}, [assetId])

	const triggerChange = (changedValue: ReplacementPart[]) => {
		onChange?.(changedValue)
	}

	const handleAddPart = () => {
		const newPart: ReplacementPart = {
			id: Date.now().toString(), // Simple unique ID
			componentId: '',
			componentType: ComponentType.OTHER,
			componentName: '',
			quantity: 1,
		}
		const newParts = [...parts, newPart]
		setParts(newParts)
		triggerChange(newParts)
	}

	const handlePartChange = (id: string, field: keyof ReplacementPart, fieldValue: any) => {
		const newParts = parts.map((part) => {
			if (part.id === id) {
				// Nếu thay đổi componentId, cập nhật thông tin component
				if (field === 'componentId') {
					const selectedComponent = availableComponents.find(comp => comp.id === fieldValue)
					if (selectedComponent) {
						return {
							...part,
							componentId: fieldValue,
							componentType: selectedComponent.componentType,
							componentName: selectedComponent.name,
							componentSpecs: selectedComponent.componentSpecs
						}
					}
				}
				return { ...part, [field]: fieldValue }
			}
			return part
		})
		setParts(newParts)
		triggerChange(newParts)
	}

	const handleRemovePart = (id: string) => {
		const newParts = parts.filter((part) => part.id !== id)
		setParts(newParts)
		triggerChange(newParts)
	}

	// Nhóm components theo loại để dễ chọn
	const groupedComponents = availableComponents.reduce((acc, comp) => {
		if (!acc[comp.componentType]) {
			acc[comp.componentType] = []
		}
		acc[comp.componentType].push(comp)
		return acc
	}, {} as Record<ComponentType, Component[]>)

	if (!assetId) {
		return (
			<div className="space-y-3">
				<h4 className="text-md font-semibold text-gray-800">Linh kiện cần thay thế</h4>
				<div className="p-4 bg-gray-50 border rounded-md text-center text-gray-500">
					<p>Không thể xác định thiết bị. Vui lòng kiểm tra lại thông tin yêu cầu.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-3">
			<h4 className="text-md font-semibold text-gray-800">Linh kiện cần thay thế</h4>
			<div className="text-sm text-gray-600 mb-2">
				🔧 Tìm thấy <strong>{availableComponents.length}</strong> linh kiện có thể thay thế cho thiết bị này
			</div>
			{availableComponents.length === 0 ? (
				<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center text-yellow-700">
					<p>⚠️ Không tìm thấy linh kiện nào cho thiết bị này.</p>
					<p className="text-sm mt-2">AssetId: <strong>{assetId}</strong></p>
				</div>
			) : (
				<>
					{parts.map((part, index) => {
						const selectedComponent = availableComponents.find(comp => comp.id === part.componentId)
						return (
							<div key={part.id} className="flex items-start gap-2 p-3 border rounded-md bg-gray-50">
								<div className="flex-grow space-y-3">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<Form.Item label={`Chọn linh kiện`} className="mb-0">
											<Select
												value={part.componentId || undefined}
												placeholder="Chọn linh kiện cần thay thế"
												onChange={(value) => handlePartChange(part.id, 'componentId', value)}
												className="w-full"
												showSearch
												optionFilterProp="label"
												filterOption={(input, option) =>
													option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
												}
											>
												{Object.entries(groupedComponents).map(([type, components]) => (
													<Select.OptGroup key={type} label={type}>
														{components.map((comp) => (
															<Select.Option key={comp.id} value={comp.id}>
																<div className="flex flex-col">
																	<span className="font-medium">{comp.name}</span>
																	{/* {comp.componentSpecs && (
																		<span className="text-xs text-gray-500">{comp.componentSpecs}</span>
																	)} */}
																</div>
															</Select.Option>
														))}
													</Select.OptGroup>
												))}
											</Select>
										</Form.Item>
										<Form.Item label={`Số lượng `} className="mb-0">
											<InputNumber
												value={part.quantity}
												min={1}
												max={10}
												onChange={(value) => handlePartChange(part.id, 'quantity', value || 1)}
												className="w-full"
											/>
										</Form.Item>
									</div>
									
									{selectedComponent && (
										<div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
											<p className="text-blue-800 font-medium">Thông tin linh kiện đã chọn:</p>
											<div className="text-blue-700 mt-1 space-y-1">
												<div><strong>Loại:</strong> {selectedComponent.componentType}</div>
												<div><strong>Model:</strong> {selectedComponent.name}</div>
												{selectedComponent.componentSpecs && (
													<div><strong>Thông số:</strong> {selectedComponent.componentSpecs}</div>
												)}
												{selectedComponent.serialNumber && (
													<div><strong>Serial:</strong> {selectedComponent.serialNumber}</div>
												)}
											</div>
										</div>
									)}

									<Form.Item label={`Ghi chú thêm`} className="mb-0">
										<Input
											value={part.note}
											onChange={(e) => handlePartChange(part.id, 'note', e.target.value)}
											placeholder="Ghi chú về lý do thay thế, yêu cầu đặc biệt..."
										/>
									</Form.Item>
								</div>
								<Popconfirm
									title="Xác nhận xóa linh kiện này?"
									description="Thao tác này không thể hoàn tác."
									onConfirm={() => handleRemovePart(part.id)}
									okText="Xóa"
									cancelText="Hủy"
								>
									<Button icon={<DeleteOutlined />} danger />
								</Popconfirm>
							</div>
						)
					})}
					<Button 
						type="dashed" 
						onClick={handleAddPart} 
						block 
						icon={<PlusOutlined />}
						disabled={parts.length >= availableComponents.length}
					>
						Thêm linh kiện {parts.length >= availableComponents.length ? '(Đã chọn hết)' : ''}
					</Button>
					
					{parts.length > 0 && (
						<div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
							<p className="font-medium">💡 Lưu ý:</p>
							<ul className="mt-1 space-y-1 list-disc list-inside">
								<li>Hãy đảm bảo chọn đúng linh kiện cần thay thế</li>
								<li>Số lượng thay thế thường là 1, trừ khi cần thay thế nhiều module cùng loại</li>
								<li>Ghi rõ lý do thay thế để bộ phận mua sắm hiểu rõ yêu cầu</li>
							</ul>
						</div>
					)}
				</>
			)}
		</div>
	)
}