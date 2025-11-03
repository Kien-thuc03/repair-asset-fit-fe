// Định nghĩa trạng thái người dùng khớp với database
export enum UserStatus {
  ACTIVE = "ACTIVE", // Hoạt động
  INACTIVE = "INACTIVE", // Không hoạt động
}

// Interface cho vai trò từ database
export interface IRole {
  id: string;
  name: string;
  code?: string;
}

// Interface cho quyền từ database
export interface IPermission {
  id: string;
  name: string;
  code?: string;
}

// Interface quan hệ người dùng - vai trò
export interface IUserRole {
  userId: string;
  roleId: string;
  assignedAt?: Date;
}

// Interface quan hệ vai trò - quyền
export interface IRolePermission {
  roleId: string;
  permissionId: string;
}

// Interface cho người dùng đầy đủ từ database - Khớp với PostgreSQL schema
export interface UserEntity {
  id: string; // text Primary Key
  username: string; // text Unique, required - Tài khoản (mã nhân viên)
  password: string; // text required
  fullName: string; // text required
  email: string; // text required
  unitId?: string; // text Foreign Key to units.id
  phoneNumber?: string; // text optional
  birthDate?: string; // date optional (ISO date string)
  status: UserStatus; // UserStatus enum (ACTIVE, INACTIVE)
  createdAt: string; // timestamp (ISO string)
  updatedAt: string; // timestamp (ISO string)
  deletedAt?: string | null; // timestamp optional, soft delete (ISO string)
}

// Interface quan hệ giữa người dùng và vai trò
export interface UserRole_Relation {
  userId: string;
  roleId: string;
}

// Interface người dùng đầy đủ thông tin để hiển thị
export interface IUserWithRoles extends Omit<UserEntity, "password"> {
  unit?: {
    id: string;
    name: string;
    type: string;
  };
  roles: IRole[];
  permissions: IPermission[];
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

// Interface để tạo người dùng mới
export interface ICreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  unitId?: string;
  phoneNumber?: string;
  birthDate?: string;
  roleIds: string[];
}

// Interface để cập nhật người dùng
export interface IUpdateUserRequest {
  fullName?: string;
  email?: string;
  unitId?: string;
  phoneNumber?: string;
  birthDate?: string;
  status?: UserStatus;
  roleIds?: string[];
}

// Interface người dùng đã đăng nhập
export interface AuthenticatedUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  unitId?: string;
  roles: IRole[];
  activeRole?: IRole;
  unit?: {
    id: string;
    name: string;
    type: string;
  };
  permissions: IPermission[];
  department?: string; // Legacy field for backward compatibility
}

// Interface cho kỹ thuật viên trong quản lý phân công
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "busy" | "offline";
  assignedAreas: string[];
  currentTask?: string;
}

// Interface cho phân công khu vực cho kỹ thuật viên (legacy, đơn giản)
export interface LegacyTechnicianAssignment {
  technicianId: string; // ID của Kỹ thuật viên
  building: string; // Tên tòa nhà được phân công
  floor: string; // Tên tầng được phân công
}


// Interface Call API user
/**
 * Interface cho query parameters khi lấy danh sách người dùng
 */
export interface GetUsersQueryParams {
  search?: string; // Tìm kiếm theo tên đăng nhập, họ tên hoặc email
  status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'DELETED'; // Lọc theo trạng thái người dùng
  unitId?: string; // Lọc theo ID đơn vị
  roleId?: string; // Lọc theo ID vai trò
  page?: number; // Số trang (mặc định: 1)
  limit?: number; // Số lượng bản ghi trên mỗi trang (mặc định: 10)
  sortBy?: 'fullName' | 'email' | 'createdAt' | 'updatedAt'; // Sắp xếp theo trường
  sortOrder?: 'ASC' | 'DESC'; // Thứ tự sắp xếp (mặc định: DESC)
}

/**
 * Interface cho response khi lấy danh sách người dùng
 */
export interface GetUsersResponse {
  data: IUserWithRoles[]; // Danh sách người dùng
  total: number; // Tổng số người dùng
  page: number; // Trang hiện tại
  limit: number; // Số lượng bản ghi trên mỗi trang
  totalPages: number; // Tổng số trang
}
