'use client'

import { useState, useEffect } from 'react'
import { Modal } from 'antd'


interface ImageGalleryProps {
	images: string[]
	className?: string
	maxDisplayCount?: number
	showCounter?: boolean
	allowZoom?: boolean
}

export default function ImageGallery({ 
	images, 
	className = "", 
	maxDisplayCount = 5,
	showCounter = true,
	allowZoom = true
}: ImageGalleryProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [zoomLevel, setZoomLevel] = useState(1)

	useEffect(() => {
		if (selectedImageIndex !== null && isModalVisible) {
			const img = document.querySelector(`[data-zoom="${zoomLevel}"]`) as HTMLElement
			if (img) {
				img.style.transform = `scale(${zoomLevel})`
			}
		}
	}, [zoomLevel, selectedImageIndex, isModalVisible])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isModalVisible || selectedImageIndex === null) return
			
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault()
					navigateImage('prev')
					break
				case 'ArrowRight':
					e.preventDefault()
					navigateImage('next')
					break
				case 'Escape':
					e.preventDefault()
					handleModalClose()
					break
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isModalVisible, selectedImageIndex])

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index)
		setIsModalVisible(true)
		setZoomLevel(1)
	}

	const handleModalClose = () => {
		setIsModalVisible(false)
		setSelectedImageIndex(null)
		setZoomLevel(1)
	}

	const navigateImage = (direction: 'prev' | 'next') => {
		if (selectedImageIndex === null) return
		
		if (direction === 'prev') {
			setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)
		} else {
			setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)
		}
		setZoomLevel(1)
	}

	const handleZoom = (delta: number) => {
		setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)))
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
						className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
						onClick={() => handleImageClick(index)}
					>
						<img 
							src={url} 
							alt={`Image ${index + 1}`} 
							className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
						<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
							<div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
								<svg 
									className="w-5 h-5 text-gray-700" 
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
						</div>
						{remainingCount > 0 && index === maxDisplayCount - 1 && (
							<div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none">
								<span className="text-white font-semibold text-sm">+{remainingCount}</span>
							</div>
						)}
						{showCounter && (
							<div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded pointer-events-none">
								{index + 1}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Enhanced Image Modal */}
			<Modal
				title={
					<div className="flex items-center justify-between">
						<span>Xem ảnh chi tiết</span>
						{selectedImageIndex !== null && showCounter && (
							<span className="text-sm text-gray-500">
								{selectedImageIndex + 1} / {imageCount}
							</span>
						)}
					</div>
				}
				open={isModalVisible}
				onCancel={handleModalClose}
				footer={null}
				width="90%"
				style={{ maxWidth: '1200px' }}
				centered
				className="p-4"
			>
				{selectedImageIndex !== null && (
					<div className="flex flex-col items-center">
						{/* Main Image */}
						<div className="relative mb-4 max-h-[70vh] overflow-hidden rounded-lg bg-gray-50">
							<img 
								src={images[selectedImageIndex]} 
								alt={`Chi tiết ảnh ${selectedImageIndex + 1}`} 
								className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
									zoomLevel !== 1 ? 'cursor-move' : ''
								}`}
								data-zoom={zoomLevel}
							/>
							
							{/* Navigation Arrows */}
							{imageCount > 1 && (
								<>
									<button
										onClick={() => navigateImage('prev')}
										className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
										title="Ảnh trước"
										aria-label="Xem ảnh trước"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									<button
										onClick={() => navigateImage('next')}
										className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
										title="Ảnh tiếp theo"
										aria-label="Xem ảnh tiếp theo"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</>
							)}
						</div>

						{/* Zoom Controls */}
						{allowZoom && (
							<div className="flex items-center gap-2 mb-4">
								<button
									onClick={() => handleZoom(-0.25)}
									disabled={zoomLevel <= 0.5}
									className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
									title="Thu nhỏ"
									aria-label="Thu nhỏ ảnh"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
									</svg>
								</button>
								<span className="text-sm text-gray-600 min-w-[60px] text-center">
									{Math.round(zoomLevel * 100)}%
								</span>
								<button
									onClick={() => handleZoom(0.25)}
									disabled={zoomLevel >= 3}
									className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
									title="Phóng to"
									aria-label="Phóng to ảnh"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
								</button>
								<button
									onClick={() => setZoomLevel(1)}
									className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
									title="Đặt lại kích thước"
								>
									Reset
								</button>
							</div>
						)}

						{/* Thumbnail Navigation */}
						{imageCount > 1 && (
							<div className="flex gap-2 flex-wrap justify-center max-h-20 overflow-y-auto">
								{images.map((url, index) => (
									<img
										key={url}
										src={url}
										alt={`Thumbnail ${index + 1}`}
										className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all duration-200 flex-shrink-0 ${
											selectedImageIndex === index 
												? 'border-blue-500 shadow-lg scale-105' 
												: 'border-gray-200 hover:border-gray-400'
										}`}
										onClick={() => setSelectedImageIndex(index)}
									/>
								))}
							</div>
						)}

						{/* Helper Text */}
						<div className="mt-2 text-xs text-gray-500 text-center">
							{imageCount > 1 && 'Sử dụng phím mũi tên để điều hướng • '}
							ESC để đóng
						</div>
					</div>
				)}
			</Modal>
		</>
	)
}
