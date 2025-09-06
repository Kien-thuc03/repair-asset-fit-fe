import { UserStatus } from "@/types/user";

// Mock users - data theo cấu trúc bảng users trong database
export const users = [
  {
    id: "user-1",
    username: "qtv", // Tài khoản đăng nhập
    password: "qtv123",
    fullName: "Quản trị viên Khoa",
    email: "qtv@iuh.edu.vn",
    unitId: "unit-1", // Khoa CNTT
    phoneNumber: "0901234001",
    birthDate: new Date("1985-01-15"),
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    deletedAt: null
  },
  {
    id: "user-2",
    username: "quantri",
    password: "quantri123",
    fullName: "Nhân viên Phòng Quản trị",
    email: "quantri@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị
    phoneNumber: "0901234002",
    birthDate: new Date("1987-03-20"),
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    deletedAt: null
  },
  {
    id: "user-3",
    username: "totruong",
    password: "totruong123",
    fullName: "Tổ trưởng Kỹ thuật",
    email: "totruong@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị - Tổ Kỹ thuật
    phoneNumber: "0901234003",
    birthDate: new Date("1980-05-10"),
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    deletedAt: null
  },
  {
    id: "user-4",
    username: "kythuat",
    password: "kythuat123",
    fullName: "Kỹ thuật viên",
    email: "kythuat@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị - Tổ Kỹ thuật
    phoneNumber: "0901234004",
    birthDate: new Date("1990-07-25"),
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    deletedAt: null
  },
  {
    id: "user-5",
    username: "giangvien",
    password: "giangvien123",
    fullName: "Giảng viên",
    email: "giangvien@iuh.edu.vn",
    unitId: "unit-1", // Khoa CNTT
    phoneNumber: "0901234005",
    birthDate: new Date("1988-11-30"),
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    deletedAt: null
  },
  {
    id: "user-6",
    username: "gvqtv",
    password: "gvqtv123",
    fullName: "Giảng viên kiêm QTV",
    email: "gv_qtv@iuh.edu.vn",
    unitId: "unit-1", // Khoa CNTT
    phoneNumber: "0901234006",
    birthDate: new Date("1982-09-05"),
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    deletedAt: null
  },
  {
    id: "user-7",
    username: "kehoach",
    password: "kehoach123",
    fullName: "Trưởng phòng Kế hoạch Đầu tư",
    email: "kehoach@iuh.edu.vn",
    unitId: "unit-3", // Phòng Kế hoạch Đầu tư
    phoneNumber: "0901234007",
    birthDate: new Date("1975-04-12"),
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    deletedAt: null
  }
];

// Bỏ legacy code không cần thiết nữa