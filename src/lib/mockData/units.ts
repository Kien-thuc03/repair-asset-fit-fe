// Danh sách các đơn vị trong hệ thống
// Synchronized with database-sync.json
import {UnitType, UnitStatus} from "../../types/unit";
export const units = [
  {
    id: "unit-1",
    name: "Khoa Công nghệ Thông tin",
    phone: "028.38940390",
    email: "cntt@iuh.edu.vn",
    type: UnitType.DON_VI_SU_DUNG,
    representativeId: "user-5", // ID của trưởng khoa (Giảng viên)
    status: UnitStatus.ACTIVE,
    createdBy: "user-2",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "unit-2",
    name: "Phòng Quản trị",
    phone: "028.38940391",
    email: "quantri@iuh.edu.vn",
    type: UnitType.PHONG_QUAN_TRI,
    representativeId: "user-2", // ID của trưởng phòng quản trị
    status: UnitStatus.ACTIVE,
    createdBy: "user-2",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "unit-3",
    name: "Phòng Kế hoạch Đầu tư",
    phone: "028.38940392",
    email: "khdautu@iuh.edu.vn",
    type: UnitType.PHONG_KE_HOACH_DAU_TU,
    representativeId: "user-7", // ID của trưởng phòng kế hoạch
    status: UnitStatus.ACTIVE,
    createdBy: "user-2",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
];
