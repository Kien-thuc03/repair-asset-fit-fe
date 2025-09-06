// Trạng thái của đơn vị
export enum UnitStatus {
  ACTIVE = 'ACTIVE',     // Đang hoạt động
  INACTIVE = 'INACTIVE'  // Không hoạt động
}

// Loại đơn vị
export enum UnitType {
  PHONG_KE_HOACH_DAU_TU = 'phòng_kế_hoạch_đầu_tư',
  PHONG_QUAN_TRI = 'phòng_quản_trị',
  DON_VI_SU_DUNG = 'đơn_vị_sử_dụng'
}

// Interface cho đơn vị
export interface Unit {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  type: UnitType;
  representativeId: string;
  status: UnitStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Interface cho phòng
export enum RoomStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Room {
  id: string;
  building?: string;
  floor?: string;
  roomNumber: string;
  status: RoomStatus;
  unitId?: string;
}
