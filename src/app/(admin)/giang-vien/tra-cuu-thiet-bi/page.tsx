'use client'

import { useState, useEffect } from 'react'
import { Search, Monitor, Wifi, CheckCircle, AlertTriangle, Clock, Eye, QrCode, X } from 'lucide-react'

interface Asset {
  id: string
  assetCode: string
  name: string
  category: string
  model: string
  serialNumber: string
  roomId: string
  roomName: string
  status: 'HOẠT_ĐỘNG' | 'BẢO_TRÌ' | 'HỎNG_HÓC' | 'NGỪNG_SỬ_DỤNG'
  purchaseDate: string
  warrantyExpiry: string
  lastMaintenanceDate?: string
  assignedTo?: string
  specifications?: Record<string, string>
  qrCode: string
}

const mockAssets: Asset[] = [
  {
    id: 'ASSET001',
    assetCode: 'PC-A101-01',
    name: 'PC Dell OptiPlex 3080 - Máy 01',
    category: 'Máy tính để bàn',
    model: 'Dell OptiPlex 3080',
    serialNumber: 'DL2024001',
    roomId: 'ROOM001',
    roomName: 'Phòng máy tính A101',
    status: 'HOẠT_ĐỘNG',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    lastMaintenanceDate: '2024-12-10',
    assignedTo: 'Phòng máy tính A101',
    specifications: {
      'CPU': 'Intel Core i5-12400',
      'RAM': '16GB DDR4',
      'Ổ cứng': '512GB SSD',
      'Card màn hình': 'Intel UHD Graphics',
      'Hệ điều hành': 'Windows 11 Pro'
    },
    qrCode: 'QR-PC-A101-01'
  },
  {
    id: 'ASSET002',
    assetCode: 'PC-A101-02',
    name: 'PC Dell OptiPlex 3080 - Máy 02',
    category: 'Máy tính để bàn',
    model: 'Dell OptiPlex 3080',
    serialNumber: 'DL2024002',
    roomId: 'ROOM001',
    roomName: 'Phòng máy tính A101',
    status: 'BẢO_TRÌ',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    lastMaintenanceDate: '2024-12-12',
    assignedTo: 'Phòng máy tính A101',
    specifications: {
      'CPU': 'Intel Core i5-12400',
      'RAM': '16GB DDR4',
      'Ổ cứng': '512GB SSD',
      'Card màn hình': 'Intel UHD Graphics',
      'Hệ điều hành': 'Windows 11 Pro'
    },
    qrCode: 'QR-PC-A101-02'
  },
  {
    id: 'ASSET003',
    assetCode: 'PC-A101-03',
    name: 'PC HP ProDesk 400 - Máy 03',
    category: 'Máy tính để bàn',
    model: 'HP ProDesk 400 G9',
    serialNumber: 'HP2024003',
    roomId: 'ROOM001',
    roomName: 'Phòng máy tính A101',
    status: 'HỎNG_HÓC',
    purchaseDate: '2023-03-20',
    warrantyExpiry: '2026-03-20',
    lastMaintenanceDate: '2024-11-15',
    assignedTo: 'Phòng máy tính A101',
    specifications: {
      'CPU': 'Intel Core i3-12100',
      'RAM': '8GB DDR4',
      'Ổ cứng': '256GB SSD',
      'Card màn hình': 'Intel UHD Graphics',
      'Hệ điều hành': 'Windows 11 Pro'
    },
    qrCode: 'QR-PC-A101-03'
  },
  {
    id: 'ASSET004',
    assetCode: 'PC-A101-04',
    name: 'PC Lenovo ThinkCentre - Máy 04',
    category: 'Máy tính để bàn',
    model: 'Lenovo ThinkCentre M70q',
    serialNumber: 'LV2024004',
    roomId: 'ROOM001',
    roomName: 'Phòng máy tính A101',
    status: 'HOẠT_ĐỘNG',
    purchaseDate: '2023-06-10',
    warrantyExpiry: '2025-06-10',
    lastMaintenanceDate: '2024-12-05',
    assignedTo: 'Phòng máy tính A101',
    specifications: {
      'CPU': 'Intel Core i5-11400T',
      'RAM': '16GB DDR4',
      'Ổ cứng': '512GB SSD',
      'Card màn hình': 'Intel UHD Graphics',
      'Hệ điều hành': 'Windows 11 Pro'
    },
    qrCode: 'QR-PC-A101-04'
  },
  {
    id: 'ASSET005',
    assetCode: 'PC-A102-01',
    name: 'PC Dell Inspiron - Máy 05',
    category: 'Máy tính để bàn',
    model: 'Dell Inspiron 3020',
    serialNumber: 'DL2024005',
    roomId: 'ROOM002',
    roomName: 'Phòng máy tính A102',
    status: 'HOẠT_ĐỘNG',
    purchaseDate: '2023-02-28',
    warrantyExpiry: '2025-02-28',
    lastMaintenanceDate: '2024-12-08',
    assignedTo: 'Phòng máy tính A102',
    specifications: {
      'CPU': 'Intel Core i3-13100',
      'RAM': '8GB DDR4',
      'Ổ cứng': '256GB SSD',
      'Card màn hình': 'Intel UHD Graphics',
      'Hệ điều hành': 'Windows 11 Home'
    },
    qrCode: 'QR-PC-A102-01'
  },
  {
    id: 'ASSET006',
    assetCode: 'PC-A102-02',
    name: 'PC HP Pavilion - Máy 06',
    category: 'Máy tính để bàn',
    model: 'HP Pavilion TP01',
    serialNumber: 'HP2024006',
    roomId: 'ROOM002',
    roomName: 'Phòng máy tính A102',
    status: 'HOẠT_ĐỘNG',
    purchaseDate: '2023-04-15',
    warrantyExpiry: '2025-04-15',
    lastMaintenanceDate: '2024-11-20',
    assignedTo: 'Phòng máy tính A102',
    specifications: {
      'CPU': 'AMD Ryzen 5 5600G',
      'RAM': '16GB DDR4',
      'Ổ cứng': '512GB SSD',
      'Card màn hình': 'AMD Radeon Graphics',
      'Hệ điều hành': 'Windows 11 Home'
    },
    qrCode: 'QR-PC-A102-02'
  }
]

const statusConfig = {
  HOẠT_ĐỘNG: { 
    label: 'Hoạt động', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle 
  },
  BẢO_TRÌ: { 
    label: 'Bảo trì', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock 
  },
  HỎNG_HÓC: { 
    label: 'Hỏng hóc', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle 
  },
  NGỪNG_SỬ_DỤNG: { 
    label: 'Ngừng sử dụng', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Clock 
  }
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Máy tính': Monitor,
  'Thiết bị trình chiếu': Monitor,
  'Thiết bị điện': AlertTriangle,
  'Thiết bị mạng': Wifi
}

export default function TraCuuThietBiPage() {
  const [assets] = useState<Asset[]>(mockAssets)
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(mockAssets)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  useEffect(() => {
    let filtered = assets

    if (searchTerm) {
      filtered = filtered.filter(asset => 
        asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(asset => asset.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter)
    }

    setFilteredAssets(filtered)
  }, [assets, searchTerm, categoryFilter, statusFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const today = new Date()
    const expiry = new Date(warrantyExpiry)
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft < 0) {
      return { status: 'expired', label: 'Hết hạn', color: 'text-red-600' }
    } else if (daysLeft < 30) {
      return { status: 'expiring', label: `Còn ${daysLeft} ngày`, color: 'text-orange-600' }
    } else {
      return { status: 'valid', label: `Còn ${Math.ceil(daysLeft / 30)} tháng`, color: 'text-green-600' }
    }
  }

  const categories = Array.from(new Set(assets.map(asset => asset.category)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tra cứu tài sản</h1>
            <p className="text-gray-600">Tìm kiếm và xem thông tin chi tiết tài sản thiết bị</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {assets.filter(e => e.status === 'HOẠT_ĐỘNG').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bảo trì
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {assets.filter(e => e.status === 'BẢO_TRÌ').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hỏng hóc
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {assets.filter(e => e.status === 'HỎNG_HÓC').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {assets.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, model, phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="HOẠT_ĐỘNG">Hoạt động</option>
              <option value="BẢO_TRÌ">Bảo trì</option>
              <option value="HỎNG_HÓC">Hỏng hóc</option>
              <option value="NGỪNG_SỬ_DỤNG">Ngừng sử dụng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => {
          const StatusIcon = statusConfig[asset.status].icon
          const CategoryIcon = categoryIcons[asset.category] || Monitor
          const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry)
          
          return (
            <div key={asset.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CategoryIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                      <p className="text-sm text-gray-500">{asset.assetCode}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[asset.status].color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[asset.status].label}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Model:</span>
                    <span className="text-gray-900">{asset.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phòng:</span>
                    <span className="text-gray-900">{asset.roomName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bảo hành:</span>
                    <span className={`font-medium ${warrantyStatus.color}`}>
                      {warrantyStatus.label}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Chi tiết
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <QrCode className="w-3 h-3 mr-1" />
                    QR Code
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy tài sản</h3>
          <p className="mt-1 text-sm text-gray-500">
            Không có tài sản nào phù hợp với bộ lọc.
          </p>
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  Chi tiết tài sản: {selectedAsset.name}
                </h3>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Mã tài sản:</span>
                      <span className="text-sm text-gray-900">{selectedAsset.assetCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Tên tài sản:</span>
                      <span className="text-sm text-gray-900">{selectedAsset.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Danh mục:</span>
                      <span className="text-sm text-gray-900">{selectedAsset.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Model:</span>
                      <span className="text-sm text-gray-900">{selectedAsset.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Serial Number:</span>
                      <span className="text-sm text-gray-900">{selectedAsset.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Phòng:</span>
                      <span className="text-sm text-gray-900">{selectedAsset.roomName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[selectedAsset.status].color}`}>
                        {statusConfig[selectedAsset.status].label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warranty & Maintenance */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Bảo hành & Bảo trì</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Ngày mua:</span>
                      <span className="text-sm text-gray-900">{formatDate(selectedAsset.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Hết hạn bảo hành:</span>
                      <span className="text-sm text-gray-900">{formatDate(selectedAsset.warrantyExpiry)}</span>
                    </div>
                    {selectedAsset.lastMaintenanceDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Bảo trì lần cuối:</span>
                        <span className="text-sm text-gray-900">{formatDate(selectedAsset.lastMaintenanceDate)}</span>
                      </div>
                    )}
                    {selectedAsset.assignedTo && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Được giao cho:</span>
                        <span className="text-sm text-gray-900">{selectedAsset.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                {selectedAsset.specifications && (
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Thông số kỹ thuật</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(selectedAsset.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">{key}:</span>
                            <span className="text-sm text-gray-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
