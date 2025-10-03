import { IUserWithRoles, IRole, IPermission, UserStatus, ICreateUserRequest, IUpdateUserRequest } from "@/types";

// Mock roles data - Synchronized with database
export const mockRoles: IRole[] = [
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

// Mock permissions data
export const mockPermissions: IPermission[] = [
  {
    id: "perm-1",
    name: "Xem thông tin thiết bị",
    code: "VIEW_ASSETS",
  },
  {
    id: "perm-2", 
    name: "Tạo báo cáo sửa chữa",
    code: "CREATE_REPAIR_REPORT",
  },
  {
    id: "perm-3",
    name: "Xử lý yêu cầu sửa chữa",
    code: "HANDLE_REPAIR_REQUEST",
  },
  {
    id: "perm-4",
    name: "Phê duyệt thay thế thiết bị",
    code: "APPROVE_REPLACEMENT",
  },
  {
    id: "perm-5",
    name: "Quản lý người dùng",
    code: "MANAGE_USERS",
  },
];

// Mock units data - Synchronized with database  
export const mockUnits = [
  {
    id: "CNTT001",
    name: "Khoa Công nghệ Thông tin",
    type: "đơn_vị_sử_dụng",
    status: "ACTIVE",
  },
  {
    id: "QTRI001",
    name: "Phòng Quản trị", 
    type: "phòng_quản_trị",
    status: "ACTIVE",
  },
  {
    id: "KHDT001",
    name: "Phòng Kế hoạch Đầu tư",
    type: "phòng_kế_hoạch_đầu_tư", 
    status: "ACTIVE",
  },
  {
    id: "KTOAN001",
    name: "Khoa Kinh tế",
    type: "đơn_vị_sử_dụng",
    status: "ACTIVE",
  },
  {
    id: "COKHI001",
    name: "Khoa Cơ khí",
    type: "đơn_vị_sử_dụng",
    status: "ACTIVE",
  },
];

// Mock users data - Synchronized with database
export const mockUsersManagement: IUserWithRoles[] = [
  {
    id: "user-1",
    username: "qtv",
    fullName: "Quản trị viên Khoa",
    email: "qtv@iuh.edu.vn",
    phoneNumber: "0901234001",
    unitId: "unit-1",
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    unit: {
      id: "unit-1",
      name: "Khoa Công nghệ Thông tin",
      type: "đơn_vị_sử_dụng",
    },
    roles: [
      {
        id: "role-5",
        name: "Quản trị viên Khoa", 
        code: "QTV_KHOA",
      },
    ],
    permissions: [
      mockPermissions[0], // VIEW_ASSETS
      mockPermissions[3], // APPROVE_REPLACEMENT
      mockPermissions[4], // MANAGE_USERS
    ],
  },
  {
    id: "user-5",
    username: "giangvien",
    fullName: "Giảng viên",
    email: "giangvien@iuh.edu.vn",
    phoneNumber: "0901234005",
    unitId: "unit-1", 
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    unit: {
      id: "unit-1",
      name: "Khoa Công nghệ Thông tin",
      type: "đơn_vị_sử_dụng",
    },
    roles: [
      {
        id: "role-1",
        name: "Giảng viên",
        code: "GIANG_VIEN",
      },
    ],
    permissions: [
      mockPermissions[0], // VIEW_ASSETS
      mockPermissions[1], // CREATE_REPAIR_REPORT
    ],
  },
  {
    id: "user-6",
    username: "gvqtv",
    fullName: "Giảng viên kiêm QTV",
    email: "gv_qtv@iuh.edu.vn",
    phoneNumber: "0901234006",
    unitId: "unit-1",
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    unit: {
      id: "unit-1", 
      name: "Khoa Công nghệ Thông tin",
      type: "đơn_vị_sử_dụng",
    },
    roles: [
      {
        id: "role-1",
        name: "Giảng viên",
        code: "GIANG_VIEN",
      },
      {
        id: "role-5",
        name: "Quản trị viên Khoa",
        code: "QTV_KHOA",
      },
    ],
    permissions: [
      mockPermissions[0], // VIEW_ASSETS
      mockPermissions[1], // CREATE_REPAIR_REPORT
      mockPermissions[3], // APPROVE_REPLACEMENT
      mockPermissions[4], // MANAGE_USERS
    ],
  },
  {
    id: "user-4",
    username: "kythuat",
    fullName: "Kỹ thuật viên",
    email: "kythuat@iuh.edu.vn", 
    phoneNumber: "0901234004",
    unitId: "unit-2",
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    unit: {
      id: "unit-2",
      name: "Phòng Quản trị",
      type: "phòng_quản_trị",
    },
    roles: [
      {
        id: "role-2",
        name: "Kỹ thuật viên",
        code: "KY_THUAT_VIEN",
      },
    ],
    permissions: [
      mockPermissions[0], // VIEW_ASSETS
      mockPermissions[2], // HANDLE_REPAIR_REQUEST
    ],
  },
  {
    id: "user-8",
    username: "anhtuan",
    fullName: "Anh Tuấn",
    email: "anhtuan@iuh.edu.vn",
    phoneNumber: "0901234008", 
    unitId: "unit-2",
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    unit: {
      id: "unit-2",
      name: "Phòng Quản trị",
      type: "phòng_quản_trị",
    },
    roles: [
      {
        id: "role-2",
        name: "Kỹ thuật viên",
        code: "KY_THUAT_VIEN",
      },
    ],
    permissions: [
      mockPermissions[0], // VIEW_ASSETS
      mockPermissions[2], // HANDLE_REPAIR_REQUEST
    ],
  },
  {
    id: "user-9",
    username: "vandat", 
    fullName: "Văn Đạt",
    email: "vandat@iuh.edu.vn",
    phoneNumber: "0901234009",
    unitId: "unit-2",
    status: UserStatus.ACTIVE,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    unit: {
      id: "unit-2",
      name: "Phòng Quản trị",
      type: "phòng_quản_trị",
    },
    roles: [
      {
        id: "role-2",
        name: "Kỹ thuật viên", 
        code: "KY_THUAT_VIEN",
      },
    ],
    permissions: [
      mockPermissions[0], // VIEW_ASSETS
      mockPermissions[2], // HANDLE_REPAIR_REQUEST
    ],
  },
];

// Helper functions for users management

/**
 * Lấy danh sách người dùng theo đơn vị
 */
export const getUsersByUnit = (unitId: string): IUserWithRoles[] => {
  return mockUsersManagement.filter(user => user.unitId === unitId);
};

/**
 * Lấy danh sách người dùng theo vai trò
 */
export const getUsersByRole = (roleCode: string): IUserWithRoles[] => {
  return mockUsersManagement.filter(user => 
    user.roles.some(role => role.code === roleCode)
  );
};

/**
 * Tìm kiếm người dùng theo từ khóa
 */
export const searchUsers = (keyword: string): IUserWithRoles[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockUsersManagement.filter(user => 
    user.fullName.toLowerCase().includes(lowerKeyword) ||
    user.username.toLowerCase().includes(lowerKeyword) ||
    user.email?.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = (id: string): IUserWithRoles | undefined => {
  return mockUsersManagement.find(user => user.id === id);
};

/**
 * Kiểm tra username đã tồn tại
 */
export const isUsernameExist = (username: string, excludeId?: string): boolean => {
  return mockUsersManagement.some(user => 
    user.username === username && user.id !== excludeId
  );
};

/**
 * Kiểm tra email đã tồn tại  
 */
export const isEmailExist = (email: string, excludeId?: string): boolean => {
  return mockUsersManagement.some(user => 
    user.email === email && user.id !== excludeId
  );
};

/**
 * Tạo người dùng mới (mock)
 */
export const createUser = (userData: ICreateUserRequest): IUserWithRoles => {
  // Validate duplicate username/email
  if (isUsernameExist(userData.username)) {
    throw new Error("Tên đăng nhập đã tồn tại");
  }
  if (isEmailExist(userData.email)) {
    throw new Error("Email đã tồn tại");
  }

  const newUser: IUserWithRoles = {
    id: `user-${Date.now()}`,
    username: userData.username,
    fullName: userData.fullName,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    birthDate: userData.birthDate ? new Date(userData.birthDate) : undefined,
    unitId: userData.unitId,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    unit: userData.unitId ? mockUnits.find(u => u.id === userData.unitId) : undefined,
    roles: mockRoles.filter(role => userData.roleIds.includes(role.id)),
    permissions: [], // Sẽ được tính dựa trên roles
  };

  // Add to mock data
  mockUsersManagement.push(newUser);
  
  return newUser;
};

/**
 * Cập nhật thông tin người dùng (mock)
 */
export const updateUser = (userId: string, updateData: IUpdateUserRequest): IUserWithRoles | null => {
  const userIndex = mockUsersManagement.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;

  const user = mockUsersManagement[userIndex];
  
  // Validate duplicate email if changed
  if (updateData.email && updateData.email !== user.email && isEmailExist(updateData.email, userId)) {
    throw new Error("Email đã tồn tại");
  }

  // Update user data
  const updatedUser: IUserWithRoles = {
    ...user,
    ...updateData,
    birthDate: updateData.birthDate ? new Date(updateData.birthDate) : user.birthDate,
    updatedAt: new Date(),
    unit: updateData.unitId ? mockUnits.find(u => u.id === updateData.unitId) : user.unit,
    roles: updateData.roleIds ? mockRoles.filter(role => updateData.roleIds!.includes(role.id)) : user.roles,
  };

  mockUsersManagement[userIndex] = updatedUser;
  
  return updatedUser;
};

/**
 * Thay đổi trạng thái người dùng (khóa/mở khóa)
 */
export const toggleUserStatus = (userId: string): IUserWithRoles | null => {
  const user = getUserById(userId);
  if (!user) return null;

  const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
  
  return updateUser(userId, { status: newStatus });
};

/**
 * Xóa người dùng (soft delete)
 */
export const deleteUser = (userId: string): boolean => {
  const userIndex = mockUsersManagement.findIndex(user => user.id === userId);
  if (userIndex === -1) return false;

  mockUsersManagement[userIndex].deletedAt = new Date();
  
  return true;
};

// Statistics helpers
export const getUsersStats = () => {
  const total = mockUsersManagement.length;
  const active = mockUsersManagement.filter(user => user.status === UserStatus.ACTIVE).length;
  const inactive = mockUsersManagement.filter(user => user.status === UserStatus.INACTIVE).length;
  const byUnit = mockUnits.map(unit => ({
    unitName: unit.name,
    count: getUsersByUnit(unit.id).length
  }));

  return {
    total,
    active, 
    inactive,
    byUnit
  };
};