'use client'

import { useState } from 'react'
import { Modal } from 'antd'

interface ImageViewerProps {
	images: string[]
	className?: string
	maxDisplayCount?: number
}

export default function ImageViewer({ 
	images, 
	className = "", 
	maxDisplayCount = 5 
}: ImageViewerProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [isModalVisible, setIsModalVisible] = useState(false)

	const handleImageClick = (imageUrl: string) => {
		setSelectedImage(imageUrl)
		setIsModalVisible(true)
	}

	const handleModalClose = () => {
		setIsModalVisible(false)
		setSelectedImage(null)
	}

	if (!images?.length) return null

	const imageCount = images.length
	const displayImages = images.slice(0, maxDisplayCount)
	const remainingCount = imageCount - maxDisplayCount

	return (
		<>
			<div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 ${className}`}>
				{displayImages.map((url, index) => (
					<div 
						key={url} 
						className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
						onClick={() => handleImageClick(url)}
					>
						<img 
							src={url} 
							alt={`Image ${index + 1}`} 
							className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200"
						/>
						<div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center pointer-events-none">
							<svg 
								className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={2} 
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
								/>
							</svg>
						</div>
						{remainingCount > 0 && index === maxDisplayCount - 1 && (
							<div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center pointer-events-none">
								<span className="text-white font-semibold text-sm">+{remainingCount}</span>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Image Modal */}
			<Modal
				title="Xem ảnh chi tiết"
				open={isModalVisible}
				onCancel={handleModalClose}
				footer={null}
				width="80%"
				style={{ maxWidth: '800px' }}
				centered
			>
				{selectedImage && (
					<div className="flex flex-col items-center">
						<img 
							src={selectedImage} 
							alt="Chi tiết ảnh" 
							className="max-w-full max-h-[70vh] object-contain rounded-lg"
						/>
						<div className="mt-4 flex gap-2 flex-wrap justify-center max-h-20 overflow-y-auto">
							{images.map((url, index) => (
								<img
									key={url}
									src={url}
									alt={`Thumbnail ${index + 1}`}
									className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all duration-200 flex-shrink-0 ${
										selectedImage === url 
											? 'border-blue-500 shadow-lg' 
											: 'border-gray-200 hover:border-gray-400'
									}`}
									onClick={() => setSelectedImage(url)}
								/>
							))}
						</div>
					</div>
				)}
			</Modal>
		</>
	)
}
