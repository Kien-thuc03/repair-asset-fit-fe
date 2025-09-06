import { UserRole } from "@/types/repair";

// Danh sách các vai trò trong hệ thống
export const roles = [
  {
    id: "role-1",
    name: "Giảng viên",
    code: UserRole.GIANG_VIEN,
  },
  {
    id: "role-2",
    name: "Kỹ thuật viên",
    code: UserRole.KY_THUAT_VIEN,
  },
  {
    id: "role-3",
    name: "Tổ trưởng Kỹ thuật",
    code: UserRole.TO_TRUONG_KY_THUAT,
  },
  {
    id: "role-4",
    name: "Nhân viên Phòng Quản trị",
    code: UserRole.PHONG_QUAN_TRI,
  },
  {
    id: "role-5",
    name: "Quản trị viên Khoa",
    code: UserRole.QTV_KHOA,
  },
];
