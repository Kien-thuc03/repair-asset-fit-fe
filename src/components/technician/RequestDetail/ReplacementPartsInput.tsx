'use client'

import { useState } from 'react'
import { Button, Input, Form, Popconfirm } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

export interface ReplacementPart {
	id: string
	name: string
	quantity: number
	note?: string
}

interface Props {
	value?: ReplacementPart[]
	onChange?: (value: ReplacementPart[]) => void
}

export default function ReplacementPartsInput({ value = [], onChange }: Props) {
	const [parts, setParts] = useState<ReplacementPart[]>(value)

	const triggerChange = (changedValue: ReplacementPart[]) => {
		onChange?.(changedValue)
	}

	const handleAddPart = () => {
		const newPart: ReplacementPart = {
			id: Date.now().toString(), // Simple unique ID
			name: '',
			quantity: 1,
		}
		const newParts = [...parts, newPart]
		setParts(newParts)
		triggerChange(newParts)
	}

	const handlePartChange = (id: string, field: keyof ReplacementPart, fieldValue: any) => {
		const newParts = parts.map((part) => {
			if (part.id === id) {
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

	return (
		<div className="space-y-3">
			<h4 className="text-md font-semibold text-gray-800">Linh kiện cần thay thế</h4>
			{parts.map((part, index) => (
				<div key={part.id} className="flex items-start gap-2 p-2 border rounded-md bg-gray-50">
					<div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2">
						<Form.Item label={`Tên linh kiện ${index + 1}`} className="mb-0">
							<Input
								value={part.name}
								onChange={(e) => handlePartChange(part.id, 'name', e.target.value)}
								placeholder="VD: RAM, Ổ cứng SSD"
							/>
						</Form.Item>
						<Form.Item label={`Số lượng ${index + 1}`} className="mb-0">
							<Input
								type="number"
								value={part.quantity}
								min={1}
								onChange={(e) => handlePartChange(part.id, 'quantity', parseInt(e.target.value, 10) || 1)}
							/>
						</Form.Item>
						<Form.Item label={`Ghi chú ${index + 1}`} className="mb-0">
							<Input
								value={part.note}
								onChange={(e) => handlePartChange(part.id, 'note', e.target.value)}
								placeholder="Thông số, model..."
							/>
						</Form.Item>
					</div>
					<Popconfirm
						title="Xác nhận xóa?"
						onConfirm={() => handleRemovePart(part.id)}
					>
						<Button icon={<DeleteOutlined />} danger />
					</Popconfirm>
				</div>
			))}
			<Button type="dashed" onClick={handleAddPart} block icon={<PlusOutlined />}>
				Thêm linh kiện
			</Button>
		</div>
	)
}