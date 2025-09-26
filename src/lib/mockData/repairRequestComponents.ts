import { RepairRequestComponent } from '@/types'

// Mock data cho bảng RepairRequestComponents (quan hệ nhiều-nhiều)
// Thể hiện linh kiện cụ thể bị lỗi trong từng yêu cầu sửa chữa
export const mockRepairRequestComponents: RepairRequestComponent[] = [
  // Repair Request req-001: Máy không khởi động - Nguồn điện bị cháy
  {
    repairRequestId: "req-001",
    componentId: "CC005", // Dell 200W PSU
    note: "Nguồn điện có mùi cháy, không cấp điện được"
  },
  {
    repairRequestId: "req-001", 
    componentId: "CC004", // Dell OptiPlex 3080 Motherboard
    note: "Nghi ngờ mainboard bị ảnh hưởng do nguồn cháy"
  },

  // Repair Request req-002: SSD bị bad sectors
  {
    repairRequestId: "req-002",
    componentId: "CC003", // Samsung 980 SSD
    note: "SSD bị bad sectors, không đọc được dữ liệu"
  },

  // Repair Request req-004: Không kết nối được mạng
//   {
//     repairRequestId: "req-004",
//     componentId: "CC009", // Network card (sẽ tạo thêm)
//     note: "Card mạng không nhận diện được, có thể hỏng driver"
//   },

  // Repair Request req-005: Màn hình không hiển thị
  {
    repairRequestId: "req-005",
    componentId: "CC001", // Intel Core i5-12400 (integrated graphics)
    note: "Card màn hình tích hợp không xuất tín hiệu"
  },
  {
    repairRequestId: "req-005",
    componentId: "CC006", // Dell P2214H Monitor
    note: "Màn hình có thể bị lỗi, không hiển thị được"
  },

  // Repair Request req-006: Bàn phím không hoạt động
  {
    repairRequestId: "req-006",
    componentId: "CC007", // Dell KB216
    note: "Một số phím không nhấn được, cần thay thế"
  },

  // Repair Request req-007: Máy chạy chậm
  {
    repairRequestId: "req-007",
    componentId: "CC002", // Kingston Fury Beast DDR4
    note: "RAM có thể bị lỗi, cần test memory"
  },

  // Repair Request req-008: Chuột không hoạt động
  {
    repairRequestId: "req-008",
    componentId: "CC008", // Dell MS116
    note: "Chuột không di chuyển được, có thể hỏng sensor"
  }
]

/**
 * Lấy danh sách linh kiện bị lỗi theo repair request ID
 * @param repairRequestId - ID của yêu cầu sửa chữa
 * @returns Danh sách RepairRequestComponent với thông tin chi tiết linh kiện
 */
export const getComponentsByRepairRequestId = (repairRequestId: string) => {
  return mockRepairRequestComponents.filter(
    item => item.repairRequestId === repairRequestId
  )
}