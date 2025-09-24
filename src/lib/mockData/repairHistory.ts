export interface RepairLogItem {
  id: string
  repairRequestId: string
  actorId: string
  action: string
  fromStatus: string | null
  toStatus: string
  comment: string
  createdAt: string
  requestCode: string
  computerAssetId: string
  errorTypeName: string
  actorName: string
}

export interface RepairHistoryItem {
  id: string
  requestCode: string
  assetId: string
  assetCode: string
  errorType: string
  description: string
  solution?: string
  status: string
  technicianId: string
  technicianName: string
  reportDate: string
  completedDate?: string
  processingTime?: number // in hours
}

// Real repair logs data from database - Synchronized with RepairLogs table
export const repairLogs: RepairLogItem[] = [
  {
    id: "LOG013",
    repairRequestId: "req-006",
    actorId: "user-5",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: "CHỜ_TIẾP_NHẬN",
    comment: "Báo cáo lỗi chuột không hoạt động",
    createdAt: "2024-01-18T02:15:00.000Z",
    requestCode: "YCSC-2025-0006",
    computerAssetId: "ASSET009",
    errorTypeName: "Máy hư chuột",
    actorName: "Giảng viên"
  },
  {
    id: "LOG012",
    repairRequestId: "req-005",
    actorId: "user-9",
    action: "Chờ thay thế",
    fromStatus: "ĐÃ_TIẾP_NHẬN",
    toStatus: "CHỜ_THAY_THẾ",
    comment: "Đang chờ chuột mới để thay thế",
    createdAt: "2024-01-17T08:30:00.000Z",
    requestCode: "YCSC-2025-0005",
    computerAssetId: "ASSET005",
    errorTypeName: "Máy mất chuột",
    actorName: "Văn Đạt"
  },
  {
    id: "LOG011",
    repairRequestId: "req-005",
    actorId: "user-9",
    action: "Tiếp nhận xử lý",
    fromStatus: "CHỜ_TIẾP_NHẬN",
    toStatus: "ĐÃ_TIẾP_NHẬN",
    comment: "Đã tiếp nhận, xác nhận chuột bị mất",
    createdAt: "2024-01-17T08:00:00.000Z",
    requestCode: "YCSC-2025-0005",
    computerAssetId: "ASSET005",
    errorTypeName: "Máy mất chuột",
    actorName: "Văn Đạt"
  },
  {
    id: "LOG010",
    repairRequestId: "req-005",
    actorId: "user-5",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: "CHỜ_TIẾP_NHẬN",
    comment: "Báo cáo chuột bị mất",
    createdAt: "2024-01-17T07:20:00.000Z",
    requestCode: "YCSC-2025-0005",
    computerAssetId: "ASSET005",
    errorTypeName: "Máy mất chuột",
    actorName: "Giảng viên"
  },
  {
    id: "LOG009",
    repairRequestId: "req-004",
    actorId: "user-8",
    action: "Tiếp nhận xử lý",
    fromStatus: "CHỜ_TIẾP_NHẬN",
    toStatus: "ĐÃ_TIẾP_NHẬN",
    comment: "Đã tiếp nhận yêu cầu kiểm tra mạng",
    createdAt: "2024-01-16T04:00:00.000Z",
    requestCode: "YCSC-2025-0004",
    computerAssetId: "ASSET004",
    errorTypeName: "Máy hư phần mềm",
    actorName: "Anh Tuấn"
  },
  {
    id: "LOG008",
    repairRequestId: "req-004",
    actorId: "user-5",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: "CHỜ_TIẾP_NHẬN",
    comment: "Báo cáo lỗi mạng",
    createdAt: "2024-01-16T03:30:00.000Z",
    requestCode: "YCSC-2025-0004",
    computerAssetId: "ASSET004",
    errorTypeName: "Máy hư phần mềm",
    actorName: "Giảng viên"
  },
  {
    id: "LOG001",
    repairRequestId: "req-001",
    actorId: "user-5",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: "CHỜ_TIẾP_NHẬN",
    comment: "Báo cáo lỗi máy không khởi động",
    createdAt: "2024-01-15T01:30:00.000Z",
    requestCode: "YCSC-2025-0001",
    computerAssetId: "ASSET001",
    errorTypeName: "Máy không khởi động",
    actorName: "Giảng viên"
  },
  {
    id: "LOG004",
    repairRequestId: "req-002",
    actorId: "user-4",
    action: "Bắt đầu xử lý",
    fromStatus: "ĐÃ_TIẾP_NHẬN",
    toStatus: "ĐANG_XỬ_LÝ",
    comment: "Bắt đầu kiểm tra và sửa chữa",
    createdAt: "2024-01-14T08:30:00.000Z",
    requestCode: "YCSC-2025-0002",
    computerAssetId: "ASSET002",
    errorTypeName: "Máy hư phần mềm",
    actorName: "Kỹ thuật viên"
  },
  {
    id: "LOG003",
    repairRequestId: "req-002",
    actorId: "user-4",
    action: "Tiếp nhận xử lý",
    fromStatus: "CHỜ_TIẾP_NHẬN",
    toStatus: "ĐÃ_TIẾP_NHẬN",
    comment: "Đã tiếp nhận yêu cầu sửa chữa",
    createdAt: "2024-01-14T08:00:00.000Z",
    requestCode: "YCSC-2025-0002",
    computerAssetId: "ASSET002",
    errorTypeName: "Máy hư phần mềm",
    actorName: "Kỹ thuật viên"
  },
  {
    id: "LOG002",
    repairRequestId: "req-002",
    actorId: "user-5",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: "CHỜ_TIẾP_NHẬN",
    comment: "Báo cáo lỗi RAM",
    createdAt: "2024-01-14T07:15:00.000Z",
    requestCode: "YCSC-2025-0002",
    computerAssetId: "ASSET002",
    errorTypeName: "Máy hư phần mềm",
    actorName: "Giảng viên"
  },
  {
    id: "LOG007",
    repairRequestId: "req-003",
    actorId: "user-4",
    action: "Hoàn tất",
    fromStatus: "ĐANG_XỬ_LÝ",
    toStatus: "ĐÃ_HOÀN_THÀNH",
    comment: "Đã thay màn hình mới thành công",
    createdAt: "2024-01-13T09:00:00.000Z",
    requestCode: "YCSC-2025-0003",
    computerAssetId: "ASSET003",
    errorTypeName: "Máy hư màn hình",
    actorName: "Kỹ thuật viên"
  },
  {
    id: "LOG006",
    repairRequestId: "req-003",
    actorId: "user-4",
    action: "Tiếp nhận xử lý",
    fromStatus: "CHỜ_TIẾP_NHẬN",
    toStatus: "ĐÃ_TIẾP_NHẬN",
    comment: "Đã tiếp nhận yêu cầu sửa chữa",
    createdAt: "2024-01-12T03:00:00.000Z",
    requestCode: "YCSC-2025-0003",
    computerAssetId: "ASSET003",
    errorTypeName: "Máy hư màn hình",
    actorName: "Kỹ thuật viên"
  },
  {
    id: "LOG005",
    repairRequestId: "req-003",
    actorId: "user-5",
    action: "Tạo yêu cầu",
    fromStatus: null,
    toStatus: "CHỜ_TIẾP_NHẬN",
    comment: "Báo cáo lỗi màn hình",
    createdAt: "2024-01-12T02:00:00.000Z",
    requestCode: "YCSC-2025-0003",
    computerAssetId: "ASSET003",
    errorTypeName: "Máy hư màn hình",
    actorName: "Giảng viên"
  }
]

// Transform repair logs into history format for display
export const mockRepairHistory: RepairHistoryItem[] = repairLogs.map(log => {
  // Get asset code based on computerAssetId
  const getAssetCode = (assetId: string) => {
    switch (assetId) {
      case 'ASSET001': return '19-0205/01'
      case 'ASSET002': return '19-0205/02'
      case 'ASSET003': return '19-0205/03'
      case 'ASSET004': return '19-0205/04'
      case 'ASSET005': return '19-0205/05'
      case 'ASSET009': return '19-0205/09'
      default: return 'Unknown'
    }
  }

  // Generate solution text for completed repairs
  const getSolution = (action: string, toStatus: string, errorType: string, comment: string) => {
    if (toStatus === 'ĐÃ_HOÀN_THÀNH') {
      switch (errorType) {
        case 'Máy không khởi động':
          return 'Đã khắc phục sự cố khởi động, kiểm tra nguồn điện và thay thế linh kiện hỏng'
        case 'Máy hư phần mềm':
          return 'Đã cài đặt lại phần mềm và khôi phục hệ thống'
        case 'Máy hư màn hình':
          return 'Đã thay màn hình mới thành công'
        case 'Máy mất chuột':
          return 'Đã thay thế chuột mới'
        case 'Máy hư chuột':
          return 'Đã sửa chữa/thay chuột mới'
        default:
          return comment
      }
    }
    return undefined
  }

  // Get status for display
  const getDisplayStatus = (toStatus: string) => {
    switch (toStatus) {
      case 'CHỜ_TIẾP_NHẬN': return 'Chờ tiếp nhận'
      case 'ĐÃ_TIẾP_NHẬN': return 'Đã tiếp nhận'
      case 'ĐANG_XỬ_LÝ': return 'Đang xử lý'
      case 'CHỜ_THAY_THẾ': return 'Chờ thay thế'
      case 'ĐÃ_HOÀN_THÀNH': return 'Đã hoàn thành'
      case 'ĐÃ_HỦY': return 'Đã hủy'
      default: return toStatus
    }
  }

  return {
    id: log.id,
    requestCode: log.requestCode,
    assetId: log.computerAssetId,
    assetCode: getAssetCode(log.computerAssetId),
    errorType: log.errorTypeName,
    description: log.comment,
    solution: getSolution(log.action, log.toStatus, log.errorTypeName, log.comment),
    status: getDisplayStatus(log.toStatus),
    technicianId: log.actorId,
    technicianName: log.actorName,
    reportDate: log.createdAt,
    completedDate: log.toStatus === 'ĐÃ_HOÀN_THÀNH' ? log.createdAt : undefined,
    processingTime: log.toStatus === 'ĐÃ_HOÀN_THÀNH' ? Math.floor(Math.random() * 24) + 1 : undefined // Simulated processing time
  }
}).sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())



// Helper functions for repair history
export const getAssetRepairHistory = (assetId: string): RepairHistoryItem[] => {
  return mockRepairHistory
    .filter(item => item.assetId === assetId)
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
}

export const getRecentRepairHistory = (limit: number = 10): RepairHistoryItem[] => {
  return mockRepairHistory
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
    .slice(0, limit)
}

export const getCompletedRepairHistory = (): RepairHistoryItem[] => {
  return mockRepairHistory.filter(item => item.status === 'Đã hoàn thành')
}

export const getTechnicianRepairHistory = (technicianId: string): RepairHistoryItem[] => {
  return mockRepairHistory
    .filter(item => item.technicianId === technicianId)
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
}

export const getRepairHistoryStats = () => {
  const total = mockRepairHistory.length
  const completed = mockRepairHistory.filter(item => item.status === 'Đã hoàn thành').length
  const inProgress = mockRepairHistory.filter(item => item.status === 'Đang xử lý').length
  const cancelled = mockRepairHistory.filter(item => item.status === 'Đã hủy').length
  
  const completedItems = mockRepairHistory.filter(item => item.status === 'Đã hoàn thành' && item.processingTime)
  const avgProcessingTime = completedItems.length > 0 
    ? completedItems.reduce((sum, item) => sum + (item.processingTime || 0), 0) / completedItems.length
    : 0

  return {
    total,
    completed,
    inProgress,
    cancelled,
    completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0',
    avgProcessingTime: Math.round(avgProcessingTime * 10) / 10 // Round to 1 decimal
  }
}

export interface AssetFailureStats {
  assetId: string
  assetCode: string
  assetName: string
  totalIssues: number
  completedIssues: number
  successRate: number
  lastIssueDate?: string
  commonIssues: string[]
}

export const getAssetFailureStats = (): AssetFailureStats[] => {
  // Group repair history by asset
  const assetGroups = mockRepairHistory.reduce((groups, item) => {
    if (!groups[item.assetId]) {
      groups[item.assetId] = []
    }
    groups[item.assetId].push(item)
    return groups
  }, {} as Record<string, RepairHistoryItem[]>)

  // Calculate stats for each asset
  const stats: AssetFailureStats[] = Object.entries(assetGroups).map(([assetId, issues]) => {
    const totalIssues = issues.length
    const completedIssues = issues.filter(issue => issue.status === 'Đã hoàn thành').length
    const successRate = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0
    
    // Get the most recent issue date
    const lastIssueDate = issues
      .map(issue => issue.reportDate)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
    
    // Get common issue types
    const issueTypes = issues.map(issue => issue.errorType)
    const commonIssues = [...new Set(issueTypes)] // Remove duplicates
    
    // Get asset info from first issue (all should have same asset info)
    const firstIssue = issues[0]
    
    return {
      assetId,
      assetCode: firstIssue.assetCode,
      assetName: firstIssue.assetCode.includes('01') ? 'PC Dell OptiPlex 3080' :
                 firstIssue.assetCode.includes('02') ? 'PC Acer Aspire TC-885' :
                 firstIssue.assetCode.includes('03') ? 'PC HP EliteDesk 800 G5' :
                 firstIssue.assetCode.includes('04') ? 'PC ASUS VivoPC VM42' :
                 firstIssue.assetCode.includes('05') ? 'PC Lenovo ThinkCentre M720s' :
                 firstIssue.assetCode.includes('09') ? 'PC MSI Modern' : 'Unknown Asset',
      totalIssues,
      completedIssues,
      successRate,
      lastIssueDate,
      commonIssues
    }
  })

  // Sort by total issues (descending) and return top 10
  return stats
    .sort((a, b) => b.totalIssues - a.totalIssues)
    .slice(0, 10)
}