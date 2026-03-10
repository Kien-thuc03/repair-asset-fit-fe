'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Modal, Button } from 'antd'
import { 
	ChevronLeft, 
	ChevronRight, 
	Download, 
	ZoomIn, 
	ZoomOut, 
	RotateCw, 
	Eye
} from 'lucide-react'

interface ImageViewerProps {
	images: string[]
	className?: string
	maxDisplayCount?: number
	showDownload?: boolean
	title?: string
}

export default function ImageViewer({ 
	images, 
	className = "", 
	maxDisplayCount = 5,
	showDownload = true,
	title = "Xem ảnh chi tiết"
}: ImageViewerProps) {
	const [selectedIndex, setSelectedIndex] = useState<number>(0)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [imageLoading, setImageLoading] = useState(true)
	const [zoom, setZoom] = useState(1)
	const [rotation, setRotation] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)

	const handleImageClick = (imageUrl: string) => {
		const index = images.findIndex(img => img === imageUrl)
		setSelectedIndex(index >= 0 ? index : 0)
		setIsModalVisible(true)
		setZoom(1)
		setRotation(0)
		setImageLoading(true) // Reset loading state when opening modal
	}

	const handleModalClose = () => {
		setIsModalVisible(false)
		setImageLoading(true)
		setZoom(1)
		setRotation(0)
	}

	const handlePrevious = useCallback(() => {
		setSelectedIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
		setImageLoading(true)
		setZoom(1)
		setRotation(0)
	}, [images.length])

	const handleNext = useCallback(() => {
		setSelectedIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
		setImageLoading(true)
		setZoom(1)
		setRotation(0)
	}, [images.length])

	const handleZoomIn = useCallback(() => {
		setZoom(prev => Math.min(prev + 0.5, 3))
	}, [])
	
	const handleZoomOut = useCallback(() => {
		setZoom(prev => Math.max(prev - 0.5, 0.5))
	}, [])
	
	const handleRotate = useCallback(() => {
		setRotation(prev => (prev + 90) % 360)
	}, [])
	
	const handleResetTransform = useCallback(() => {
		setZoom(1)
		setRotation(0)
	}, [])

	const handleDownload = async (imageUrl: string, index: number) => {
		try {
			const response = await fetch(imageUrl)
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `image-${index + 1}.jpg`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Download failed:', error)
		}
	}

	// Apply CSS variables for transform
	useEffect(() => {
		if (containerRef.current) {
			const imageContainer = containerRef.current.querySelector('.image-transform-container') as HTMLElement
			if (imageContainer) {
				imageContainer.style.transform = `scale(${zoom}) rotate(${rotation}deg)`
			}
		}
	}, [zoom, rotation])

	// Keyboard navigation
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (!isModalVisible) return
			
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault()
					handlePrevious()
					break
				case 'ArrowRight':
					e.preventDefault()
					handleNext()
					break
				case 'Escape':
					e.preventDefault()
					handleModalClose()
					break
				case '+':
				case '=':
					e.preventDefault()
					handleZoomIn()
					break
				case '-':
					e.preventDefault()
					handleZoomOut()
					break
				case 'r':
				case 'R':
					e.preventDefault()
					handleRotate()
					break
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [isModalVisible, handlePrevious, handleNext])

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

			{/* Enhanced Image Modal */}
			<Modal
				title={
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<Eye className="w-5 h-5" />
							{title} ({selectedIndex + 1}/{images.length})
						</span>
						<div className="flex items-center gap-2">
							<Button 
								size="small" 
								icon={<ZoomOut className="w-4 h-4" />}
								onClick={handleZoomOut}
								disabled={zoom <= 0.5}
								title="Zoom out"
							/>
							<span className="text-sm text-gray-500 min-w-[50px] text-center font-medium">
								{Math.round(zoom * 100)}%
							</span>
							<Button 
								size="small" 
								icon={<ZoomIn className="w-4 h-4" />}
								onClick={handleZoomIn}
								disabled={zoom >= 3}
								title="Zoom in"
							/>
							<Button 
								size="small" 
								icon={<RotateCw className="w-4 h-4" />}
								onClick={handleRotate}
								title="Xoay ảnh"
							/>
							<Button 
								size="small" 
								onClick={handleResetTransform}
								title="Đặt lại"
							>
								Reset
							</Button>
							{showDownload && (
								<Button 
									size="small" 
									icon={<Download className="w-4 h-4" />}
									onClick={() => handleDownload(images[selectedIndex], selectedIndex)}
								>
									Tải về
								</Button>
							)}
						</div>
					</div>
				}
				open={isModalVisible}
				onCancel={handleModalClose}
				footer={null}
				width="90%"
				style={{ maxWidth: '1200px' }}
				centered
				closable={false}
			>
				<div className="relative">
					{/* Main Image */}
					<div 
						ref={containerRef}
						className="relative flex justify-center items-center bg-black/90 rounded-lg overflow-hidden min-h-[400px] max-h-[70vh]"
					>
						{/* Loading Spinner */}
						{imageLoading && (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							</div>
						)}
						
						{/* Navigation Buttons */}
						{images.length > 1 && (
							<>
								<Button
									className="absolute! top-1/2! left-2! -translate-y-1/2! z-10"
									shape="circle"
									icon={<ChevronLeft className="w-5 h-5" />}
									onClick={handlePrevious}
								/>
								<Button
									className="absolute! top-1/2! right-2! -translate-y-1/2 z-10 "
									shape="circle"
									icon={<ChevronRight className="w-5 h-5" />}
									onClick={handleNext}
								/>
							</>
						)}
						
						<div 
							className="image-transform-container max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
						>
							<img 
								key={`${selectedIndex}-${images[selectedIndex]}`} // Force re-render when image changes
								src={images[selectedIndex]} 
								alt={`Ảnh ${selectedIndex + 1}`}
								className={`max-w-full max-h-full object-contain cursor-move origin-center transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
								onLoad={() => setImageLoading(false)}
								onError={() => setImageLoading(false)}
								draggable={false}
							/>
						</div>
					</div>

					{/* Thumbnails */}
					{images.length > 1 && (
						<div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2">
							{images.map((url, index) => (
								<div
									key={url}
									className={`relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
										selectedIndex === index 
											? 'border-blue-500 shadow-lg scale-105' 
											: 'border-gray-200 hover:border-gray-400 hover:scale-102'
									}`}
									onClick={() => {
										setSelectedIndex(index)
										setImageLoading(true)
										setZoom(1)
										setRotation(0)
									}}
								>
									<img
										src={url}
										alt={`Thumbnail ${index + 1}`}
										className="w-16 h-16 object-cover"
									/>
									{selectedIndex === index && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="w-2 h-2  rounded-full"></div>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Instructions */}
					<div className=" mt-4 text-center text-xs text-gray-700">
						<p>Sử dụng mũi tên ← → để điều hướng, +/- để zoom, R để xoay, ESC để đóng</p>
					</div>
				</div>
			</Modal>
		</>
	)
}
