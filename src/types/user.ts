import { UserRole } from "./repair";

// Định nghĩa trạng thái người dùng
export enum UserStatus {
  ACTIVE = 'ACTIVE',       // Hoạt động
  INACTIVE = 'INACTIVE'    // Không hoạt động
}

// Interface cho người dùng đầy đủ từ database
export interface UserEntity {
  id: string;
  username: string;        // Tài khoản (mã nhân viên)
  password: string;
  fullName: string;
  email?: string;
  unitId?: string;         // ID đơn vị 
  phoneNumber?: string;
  birthDate?: Date;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Interface quan hệ giữa người dùng và vai trò
export interface UserRole_Relation {
  userId: string;
  roleId: string;
}

// Interface người dùng đầy đủ thông tin để hiển thị
export interface UserWithRoles extends Omit<UserEntity, 'password'> {
  roles: UserRole[];
  activeRole: UserRole;
}

// Interface người dùng đã đăng nhập
export interface AuthenticatedUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  unitId?: string;
  roles: UserRole[];
  activeRole: UserRole;
  department?: string;     // Legacy field for backward compatibility
}
