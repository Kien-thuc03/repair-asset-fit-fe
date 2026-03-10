"use client"

import { Button, Select } from 'antd'

const { Option } = Select

interface PaginationProps {
	currentPage: number
	pageSize: number
	total: number
	onPageChange: (page: number) => void
	onPageSizeChange: (pageSize: number) => void
	showSizeChanger?: boolean
	pageSizeOptions?: number[]
	showQuickJumper?: boolean
	showTotal?: boolean
	className?: string
}

export default function Pagination({
	currentPage,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange,
	showSizeChanger = true,
	pageSizeOptions = [10, 20, 50, 100],
	showQuickJumper = true,
	showTotal = true,
	className = ""
}: PaginationProps) {
	const totalPages = Math.ceil(total / pageSize)
	const startIndex = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
	const endIndex = Math.min(currentPage * pageSize, total)

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			onPageChange(newPage)
		}
	}

	const handlePageSizeChange = (newPageSize: number) => {
		onPageSizeChange(newPageSize)
		// Reset về trang 1 khi thay đổi page size
		onPageChange(1)
	}

	if (total === 0) {
		return (
			<div className={`bg-white px-4 py-3 border-t border-gray-200 ${className}`}>
				<div className="text-sm text-gray-700">
					Không có dữ liệu
				</div>
			</div>
		)
	}

	return (
		<div className={`bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 ${className}`}>
			{/* Mobile View */}
			<div className="flex-1 flex justify-between sm:hidden">
				<Button
					disabled={currentPage === 1}
					onClick={() => handlePageChange(currentPage - 1)}
				>
					Trước
				</Button>
				<span className="text-sm text-gray-700">
					Trang {currentPage} / {totalPages}
				</span>
				<Button
					disabled={currentPage === totalPages}
					onClick={() => handlePageChange(currentPage + 1)}
				>
					Sau
				</Button>
			</div>

			{/* Desktop View */}
			<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
				{/* Total Info */}
				{showTotal && (
					<div>
						<p className="text-sm text-gray-700">
							Hiển thị{' '}
							<span className="font-medium">{startIndex}</span>
							{' '}đến{' '}
							<span className="font-medium">{endIndex}</span>
							{' '}trong tổng số{' '}
							<span className="font-medium">{total}</span> mục
						</p>
					</div>
				)}

				{/* Controls */}
				<div className="flex items-center space-x-2">
					{/* Page Size Selector */}
					{showSizeChanger && (
						<>
							<Select
								value={pageSize}
								onChange={handlePageSizeChange}
								style={{ width: 80 }}
							>
								{pageSizeOptions.map(option => (
									<Option key={option} value={option}>
										{option}
									</Option>
								))}
							</Select>
							<span className="text-sm text-gray-700">/ trang</span>
						</>
					)}

					{/* Navigation Controls */}
					<div className="flex space-x-1">
						<Button
							disabled={currentPage === 1}
							onClick={() => handlePageChange(1)}
							size="small"
						>
							Đầu
						</Button>
						<Button
							disabled={currentPage === 1}
							onClick={() => handlePageChange(currentPage - 1)}
							size="small"
						>
							Trước
						</Button>
						
						{/* Current Page Indicator */}
						<span className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded">
							{currentPage} / {totalPages}
						</span>
						
						<Button
							disabled={currentPage === totalPages}
							onClick={() => handlePageChange(currentPage + 1)}
							size="small"
						>
							Sau
						</Button>
						<Button
							disabled={currentPage === totalPages}
							onClick={() => handlePageChange(totalPages)}
							size="small"
						>
							Cuối
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

// Export types for reuse
export type { PaginationProps }