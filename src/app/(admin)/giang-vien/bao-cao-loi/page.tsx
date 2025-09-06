'use client'

import { useState } from 'react'
import { AlertTriangle, Camera, Send } from 'lucide-react'

interface ReportForm {
  assetId: string
  componentId: string
  roomId: string
  errorTypeId: string
  description: string
  mediaFiles: File[]
}

const errorTypes = [
  { id: 'ET001', name: 'Không khởi động được' },
  { id: 'ET002', name: 'Màn hình không hiển thị' },
  { id: 'ET003', name: 'Lỗi phần mềm' },
  { id: 'ET004', name: 'Mất âm thanh' },
  { id: 'ET005', name: 'Chạy chậm' },
  { id: 'ET006', name: 'Lỗi bàn phím/chuột' },
  { id: 'ET007', name: 'Lỗi kết nối mạng' },
  { id: 'ET008', name: 'Khác' }
]

const mockAssets = [
  { id: 'ASSET001', name: 'PC Dell OptiPlex 3080 - Máy 01', assetCode: 'PC-A101-01' },
  { id: 'ASSET002', name: 'PC Dell OptiPlex 3080 - Máy 02', assetCode: 'PC-A101-02' },
  { id: 'ASSET003', name: 'PC HP ProDesk 400 - Máy 03', assetCode: 'PC-A101-03' },
  { id: 'ASSET004', name: 'PC Lenovo ThinkCentre - Máy 04', assetCode: 'PC-A101-04' },
  { id: 'ASSET005', name: 'PC Dell Inspiron - Máy 05', assetCode: 'PC-A102-01' },
  { id: 'ASSET006', name: 'PC HP Pavilion - Máy 06', assetCode: 'PC-A102-02' }
]

const mockRooms = [
  { id: 'ROOM001', name: 'Phòng máy tính A101' },
  { id: 'ROOM002', name: 'Phòng máy tính A102' },
  { id: 'ROOM003', name: 'Phòng máy tính A103' },
  { id: 'ROOM004', name: 'Phòng máy tính B201' },
  { id: 'ROOM005', name: 'Phòng máy tính B202' }
]

const mockComponents = [
  { id: 'COMP001', name: 'CPU', assetId: 'ASSET001' },
  { id: 'COMP002', name: 'RAM', assetId: 'ASSET001' },
  { id: 'COMP003', name: 'Ổ cứng', assetId: 'ASSET001' },
  { id: 'COMP004', name: 'Card màn hình', assetId: 'ASSET001' },
  { id: 'COMP005', name: 'Mainboard', assetId: 'ASSET001' },
  { id: 'COMP006', name: 'Nguồn', assetId: 'ASSET001' },
  { id: 'COMP007', name: 'Màn hình', assetId: 'ASSET001' },
  { id: 'COMP008', name: 'Bàn phím', assetId: 'ASSET001' },
  { id: 'COMP009', name: 'Chuột', assetId: 'ASSET001' },
  { id: 'COMP010', name: 'Loa', assetId: 'ASSET001' },
  { id: 'COMP011', name: 'CPU', assetId: 'ASSET002' },
  { id: 'COMP012', name: 'RAM', assetId: 'ASSET002' },
  { id: 'COMP013', name: 'Ổ cứng', assetId: 'ASSET002' },
  { id: 'COMP014', name: 'Mainboard', assetId: 'ASSET002' },
  { id: 'COMP015', name: 'Màn hình', assetId: 'ASSET002' }
]

export default function BaoCaoLoiPage() {
  const [formData, setFormData] = useState<ReportForm>({
    assetId: '',
    componentId: '',
    roomId: '',
    errorTypeId: '',
    description: '',
    mediaFiles: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filteredComponents, setFilteredComponents] = useState(mockComponents)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Báo cáo đã được gửi thành công!')
    setIsSubmitting(false)
    
    // Reset form
    setFormData({
      assetId: '',
      componentId: '',
      roomId: '',
      errorTypeId: '',
      description: '',
      mediaFiles: []
    })
  }

  const handleAssetChange = (assetId: string) => {
    setFormData(prev => ({ ...prev, assetId, componentId: '' }))
    setFilteredComponents(mockComponents.filter(comp => comp.assetId === assetId))
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, mediaFiles: [...prev.mediaFiles, ...files] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Báo cáo lỗi thiết bị</h1>
            <p className="text-gray-600">Tạo báo cáo lỗi cho thiết bị gặp sự cố</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Asset Selection */}
            <div>
              <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
                Tài sản <span className="text-red-500">*</span>
              </label>
              <select
                id="assetId"
                required
                value={formData.assetId}
                onChange={(e) => handleAssetChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Chọn tài sản</option>
                {mockAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.assetCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Component Selection */}
            <div>
              <label htmlFor="componentId" className="block text-sm font-medium text-gray-700">
                Linh kiện cụ thể
              </label>
              <select
                id="componentId"
                value={formData.componentId}
                onChange={(e) => setFormData(prev => ({ ...prev, componentId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!formData.assetId}
              >
                <option value="">Chọn linh kiện (nếu có)</option>
                {filteredComponents.map((component) => (
                  <option key={component.id} value={component.id}>
                    {component.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Selection */}
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                Phòng <span className="text-red-500">*</span>
              </label>
              <select
                id="roomId"
                required
                value={formData.roomId}
                onChange={(e) => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Chọn phòng</option>
                {mockRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Type Selection */}
            <div>
              <label htmlFor="errorTypeId" className="block text-sm font-medium text-gray-700">
                Loại lỗi <span className="text-red-500">*</span>
              </label>
              <select
                id="errorTypeId"
                required
                value={formData.errorTypeId}
                onChange={(e) => setFormData(prev => ({ ...prev, errorTypeId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Chọn loại lỗi</option>
                {errorTypes.map((errorType) => (
                  <option key={errorType.id} value={errorType.id}>
                    {errorType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả chi tiết tình trạng lỗi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Mô tả chi tiết về tình trạng lỗi, triệu chứng, thời điểm xảy ra, các bước đã thực hiện..."
            />
          </div>

          {/* Media Files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh/Video minh họa
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click để upload</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, MP4 (MAX. 10MB mỗi file)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </label>
            </div>
            {formData.mediaFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Đã chọn {formData.mediaFiles.length} file
                </p>
                <div className="mt-2 space-y-1">
                  {formData.mediaFiles.map((file, index) => (
                    <div key={index} className="text-xs text-gray-500 flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          mediaFiles: prev.mediaFiles.filter((_, i) => i !== index) 
                        }))}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi báo cáo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
