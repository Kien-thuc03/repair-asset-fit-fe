export interface Role {
  id: string;
  name: string;
  code: string;
}

// Danh sách các vai trò trong hệ thống
export const roles: Role[] = [
  {
    id: "role-1",
    name: "Giảng viên",
    code: "GIANG_VIEN",
  },
  {
    id: "role-2",
    name: "Kỹ thuật viên",
    code: "KY_THUAT_VIEN",
  },
  {
    id: "role-3",
    name: "Tổ trưởng Kỹ thuật",
    code: "TO_TRUONG_KY_THUAT",
  },
  {
    id: "role-4",
    name: "Nhân viên Phòng Quản trị",
    code: "PHONG_QUAN_TRI",
  },
  {
    id: "role-5",
    name: "Quản trị viên Khoa",
    code: "QTV_KHOA",
  },
];
