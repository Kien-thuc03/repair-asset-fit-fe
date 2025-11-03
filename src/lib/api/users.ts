import { apiClient } from '../api';
import {
  GetUsersQueryParams,
  GetUsersResponse,
  IUserWithRoles,
  ICreateUserRequest,
  IUpdateUserRequest,
} from '@/types/user';

/**
 * API: Lấy danh sách người dùng
 * 
 * @param params - Query parameters để lọc, phân trang và sắp xếp
 * @returns Promise<GetUsersResponse> - Danh sách người dùng với thông tin phân trang
 * 
 * @example
 * ```typescript
 * // Lấy trang đầu tiên với 10 người dùng đang hoạt động
 * const result = await getUsers({
 *   status: 'ACTIVE',
 *   page: 1,
 *   limit: 10,
 *   sortBy: 'createdAt',
 *   sortOrder: 'DESC'
 * });
 * 
 * // Tìm kiếm người dùng theo tên
 * const searchResult = await getUsers({
 *   search: 'John Doe',
 *   page: 1,
 *   limit: 20
 * });
 * 
 * // Lọc theo đơn vị và vai trò
 * const filteredResult = await getUsers({
 *   unitId: 'uuid-of-unit',
 *   roleId: 'uuid-of-role',
 *   status: 'ACTIVE'
 * });
 * ```
 */
export const getUsers = async (
  params: GetUsersQueryParams = {}
): Promise<GetUsersResponse> => {
  // Loại bỏ các tham số undefined hoặc null
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string | number | boolean>);

  return apiClient.get<GetUsersResponse>('/users', cleanParams);
};

/**
 * API: Lấy thông tin người dùng theo ID
 * 
 * @param id - ID của người dùng (UUID)
 * @returns Promise<IUserWithRoles> - Thông tin chi tiết người dùng
 * 
 * @example
 * ```typescript
 * const user = await getUserById('uuid-of-user');
 * console.log(user.fullName);
 * ```
 */
export const getUserById = async (id: string): Promise<IUserWithRoles> => {
  return apiClient.get<IUserWithRoles>(`/users/${id}`);
};

/**
 * API: Tạo người dùng mới
 * 
 * @param userData - Thông tin người dùng cần tạo
 * @returns Promise<IUserWithRoles> - Người dùng vừa được tạo
 * 
 * @example
 * ```typescript
 * const newUser = await createUser({
 *   username: 'john_doe',
 *   password: 'SecurePassword123',
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   roleIds: ['uuid-of-role']
 * });
 * ```
 */
export const createUser = async (
  userData: ICreateUserRequest
): Promise<IUserWithRoles> => {
  return apiClient.post<IUserWithRoles>('/users', userData);
};

/**
 * API: Cập nhật thông tin người dùng
 * 
 * @param id - ID của người dùng cần cập nhật
 * @param updateData - Thông tin cần cập nhật
 * @returns Promise<IUserWithRoles> - Người dùng sau khi cập nhật
 * 
 * @example
 * ```typescript
 * const updatedUser = await updateUser('uuid-of-user', {
 *   fullName: 'John Smith',
 *   email: 'john.smith@example.com',
 *   status: 'ACTIVE'
 * });
 * ```
 */
export const updateUser = async (
  id: string,
  updateData: IUpdateUserRequest
): Promise<IUserWithRoles> => {
  return apiClient.put<IUserWithRoles>(`/users/${id}`, updateData);
};

/**
 * API: Xóa người dùng
 * 
 * @param id - ID của người dùng cần xóa
 * @param hard - Xóa vĩnh viễn (true) hoặc xóa mềm (false, mặc định)
 * @returns Promise<{ message: string }> - Thông báo kết quả
 * 
 * @example
 * ```typescript
 * // Xóa mềm (soft delete)
 * await deleteUser('uuid-of-user');
 * 
 * // Xóa vĩnh viễn (hard delete)
 * await deleteUser('uuid-of-user', true);
 * ```
 */
export const deleteUser = async (
  id: string,
  hard = false
): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(`/users/${id}?hard=${hard}`);
};

/**
 * Hook example để sử dụng trong React component
 * 
 * @example
 * ```typescript
 * const UsersListComponent = () => {
 *   const [users, setUsers] = useState<IUserWithRoles[]>([]);
 *   const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
 *   const [loading, setLoading] = useState(false);
 * 
 *   const fetchUsers = async (queryParams: GetUsersQueryParams) => {
 *     try {
 *       setLoading(true);
 *       const response = await getUsers(queryParams);
 *       setUsers(response.data);
 *       setPagination({
 *         page: response.page,
 *         limit: response.limit,
 *         total: response.total
 *       });
 *     } catch (error) {
 *       console.error('Error fetching users:', error);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 * 
 *   useEffect(() => {
 *     fetchUsers({ status: 'ACTIVE', page: 1, limit: 10 });
 *   }, []);
 * 
 *   return (
 *     <div>
 *       {loading ? <Spinner /> : (
 *         <UsersList users={users} pagination={pagination} />
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
