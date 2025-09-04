import { UserRole } from "@/types/repair";

// Mock users for authentication system
export const demoUsers = [
  {
    id: "1",
    name: "Quản trị viên Khoa",
    email: "qtv@iuh.edu.vn",
    username: "qtv",
    password: "qtv123",
    roles: [UserRole.QTV_KHOA],
    activeRole: UserRole.QTV_KHOA,
    department: "Khoa CNTT"
  },
  {
    id: "2",
    name: "Nhân viên Phòng Quản trị",
    email: "quantri@iuh.edu.vn",
    username: "quantri",
    password: "quantri123",
    roles: [UserRole.PHONG_QUAN_TRI],
    activeRole: UserRole.PHONG_QUAN_TRI,
    department: "Phòng Quản trị"
  },
  {
    id: "3",
    name: "Tổ trưởng Kỹ thuật",
    email: "totruong@iuh.edu.vn",
    username: "totruong",
    password: "totruong123",
    roles: [UserRole.TO_TRUONG_KY_THUAT],
    activeRole: UserRole.TO_TRUONG_KY_THUAT,
    department: "Tổ Kỹ thuật"
  },
  {
    id: "4", 
    name: "Kỹ thuật viên",
    email: "kythuat@iuh.edu.vn",
    username: "kythuat",
    password: "kythuat123",
    roles: [UserRole.KY_THUAT_VIEN],
    activeRole: UserRole.KY_THUAT_VIEN,
    department: "Tổ Kỹ thuật"
  },
  {
    id: "5",
    name: "Giảng viên",
    email: "giangvien@iuh.edu.vn",
    username: "giangvien",
    password: "giangvien123",
    roles: [UserRole.GIANG_VIEN],
    activeRole: UserRole.GIANG_VIEN,
    department: "Khoa CNTT"
  },
  {
    id: "6",
    name: "Giảng viên kiêm QTV",
    email: "gv_qtv@iuh.edu.vn",
    username: "gvqtv",
    password: "gvqtv123",
    roles: [UserRole.GIANG_VIEN, UserRole.QTV_KHOA],
    activeRole: UserRole.GIANG_VIEN, 
    department: "Khoa CNTT"
  }
];
