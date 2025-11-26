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

  return apiClient.get<GetUsersResponse>('/api/v1/users', cleanParams);
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
  return apiClient.get<IUserWithRoles>(`/api/v1/users/${id}`);
};

/**
 * API: Tạo người dùng mới
 * 
 * @param userData - Thông tin người dùng cần tạo
 * @returns Promise<IUserWithRoles> - Người dùng vừa được tạo
 * @throws Error với statusCode và message từ backend
 *                         
 */
export const createUser = async (
  userData: ICreateUserRequest
): Promise<IUserWithRoles> => {
  try {
    return await apiClient.post<IUserWithRoles>('/api/v1/users', userData);
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          message?: string | string[];
        };
        status?: number;
      };
    };

    const errorStatus = err.response?.status;

    // Handle array of error messages (NestJS validation errors)
    const errorMessage = Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(", ")
      : err.response?.data?.message;

    // Create error with status code information
    const finalErrorMessage = errorMessage || "Tạo người dùng thất bại.";
    const errorWithStatus = new Error(finalErrorMessage) as Error & {
      statusCode?: number;
    };
    errorWithStatus.statusCode = errorStatus;

    // Log error based on status code
    // 409 Conflict is expected and handled by UI, so log as warning instead of error
    if (errorStatus === 409) {
      console.warn("⚠️ Conflict (409):", {
        status: errorStatus,
        message: errorMessage,
        note: "This error is handled by UI",
      });
    } else {
      // Log other errors as errors for debugging
      console.error("❌ Create user error:", error);
      console.error("❌ Error details:", {
        status: errorStatus,
        message: errorMessage,
      });
    }

    // Throw error with backend message and status code
    throw errorWithStatus;
  }
};

/**
 * API: Cập nhật thông tin người dùng
 * 
 * @param id - ID của người dùng cần cập nhật
 * @param updateData - Thông tin cần cập nhật
 * @returns Promise<IUserWithRoles> - Người dùng sau khi cập nhật
 * 
 */
export const updateUser = async (
  id: string,
  updateData: IUpdateUserRequest
): Promise<IUserWithRoles> => {
  return apiClient.put<IUserWithRoles>(`/api/v1/users/${id}`, updateData);
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
  return apiClient.delete<{ message: string }>(`/api/v1/users/${id}?hard=${hard}`);
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
