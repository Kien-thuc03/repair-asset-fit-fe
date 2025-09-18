import { UserStatus } from "@/types/user";

// Mock users - Synchronized with database-sync.json
export const users = [
  {
    id: "user-1",
    username: "qtv", // Tài khoản đăng nhập
    password: "qtv123",
    fullName: "Quản trị viên Khoa",
    email: "qtv@iuh.edu.vn",
    unitId: "unit-1", // Khoa CNTT
    phoneNumber: "0901234001",
    birthDate: "1985-01-15T00:00:00Z", // Updated to ISO string format to match sampleData
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z", // Updated to ISO string format
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-2",
    username: "quantri",
    password: "quantri123",
    fullName: "Nhân viên Phòng Quản trị",
    email: "quantri@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị
    phoneNumber: "0901234002",
    birthDate: "1987-03-20T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-3",
    username: "totruong",
    password: "totruong123",
    fullName: "Tổ trưởng Kỹ thuật",
    email: "totruong@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị - Tổ Kỹ thuật
    phoneNumber: "0901234003",
    birthDate: "1980-05-10T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-4",
    username: "kythuat",
    password: "kythuat123",
    fullName: "Kỹ thuật viên",
    email: "kythuat@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị - Tổ Kỹ thuật
    phoneNumber: "0901234004",
    birthDate: "1990-07-25T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-5",
    username: "giangvien",
    password: "giangvien123",
    fullName: "Giảng viên",
    email: "giangvien@iuh.edu.vn",
    unitId: "unit-1", // Khoa CNTT
    phoneNumber: "0901234005",
    birthDate: "1988-11-30T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-6",
    username: "gvqtv",
    password: "gvqtv123",
    fullName: "Giảng viên kiêm QTV",
    email: "gv_qtv@iuh.edu.vn",
    unitId: "unit-1", // Khoa CNTT
    phoneNumber: "0901234006",
    birthDate: "1982-09-05T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-7",
    username: "kehoach",
    password: "kehoach123",
    fullName: "Trưởng phòng Kế hoạch Đầu tư",
    email: "kehoach@iuh.edu.vn",
    unitId: "unit-3", // Phòng Kế hoạch Đầu tư
    phoneNumber: "0901234007",
    birthDate: "1975-04-12T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-8",
    username: "anhtuan",
    password: "anhtuan123",
    fullName: "Anh Tuấn",
    email: "anhtuan@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị
    phoneNumber: "0901234008",
    birthDate: "1992-05-15T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
  {
    id: "user-9",
    username: "vandat",
    password: "vandat123",
    fullName: "Văn Đạt",
    email: "vandat@iuh.edu.vn",
    unitId: "unit-2", // Phòng Quản trị
    phoneNumber: "0901234009",
    birthDate: "1993-08-22T00:00:00Z",
    status: UserStatus.ACTIVE,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    deletedAt: null,
  },
];
