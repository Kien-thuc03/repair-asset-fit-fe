import { useState, useCallback } from 'react';
import { RepairRequest, RepairStatus } from '@/types';

/**
 * Hook for handling repair processing functionality
 * Provides functions for creating, updating, and managing repair requests
 * Following database schema defined in project.prompt.md
 */
export interface RepairProcessingFormData {
  // Location selection
  building: string;
  floor: string;
  roomId: string;
  
  // Asset and error info
  computerAssetId: string; // FK to assets.id (matches database schema)
  errorTypeId?: string; // FK to ErrorTypes.id
  errorCategory: 'hardware' | 'software';
  
  // Problem description
  description: string; // Required field matching RepairRequests.description
  mediaFiles: File[]; // Will be converted to mediaUrls array
  
  // Processing results
  repairMethod: 'software_fixed' | 'hardware_fixed' | 'need_replacement' | '';
  repairNotes: string; // Technician's resolution notes
  status: RepairStatus;
  
  // Component selections for hardware issues
  selectedComponentIds: string[];
  selectedSoftwareIds: string[];
}

export interface RepairProcessingHookReturn {
  // Form state
  formData: RepairProcessingFormData;
  setFormData: React.Dispatch<React.SetStateAction<RepairProcessingFormData>>;
  
  // Loading states
  isSubmitting: boolean;
  isLoading: boolean;
  
  // Form handlers
  handleFormSubmit: (formData: RepairProcessingFormData) => Promise<RepairRequest | null>;
  handleStatusUpdate: (requestId: string, status: RepairStatus, notes?: string) => Promise<RepairRequest | null>;
  resetForm: () => void;
  
  // Validation
  validateForm: (formData: RepairProcessingFormData) => { isValid: boolean; errors: string[] };
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const initialFormData: RepairProcessingFormData = {
  building: '',
  floor: '',
  roomId: '',
  computerAssetId: '',
  errorTypeId: '',
  errorCategory: 'software',
  description: '',
  mediaFiles: [],
  repairMethod: '',
  repairNotes: '',
  status: RepairStatus.ĐANG_XỬ_LÝ,
  selectedComponentIds: [],
  selectedSoftwareIds: [],
};

export const useRepairProcessing = (): RepairProcessingHookReturn => {
  const [formData, setFormData] = useState<RepairProcessingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates the repair processing form data
   * Ensures all required fields are present and valid according to database schema
   */
  const validateForm = useCallback((data: RepairProcessingFormData) => {
    const errors: string[] = [];

    // Required fields validation
    if (!data.building) errors.push('Vui lòng chọn tòa nhà');
    if (!data.floor) errors.push('Vui lòng chọn tầng');
    if (!data.roomId) errors.push('Vui lòng chọn phòng');
    if (!data.computerAssetId) errors.push('Vui lòng chọn thiết bị');
    if (!data.description.trim()) errors.push('Vui lòng nhập mô tả chi tiết lỗi');
    if (!data.repairMethod) errors.push('Vui lòng chọn kết quả kiểm tra thực tế');
    if (!data.repairNotes.trim()) errors.push('Vui lòng nhập mô tả quá trình xử lý');

    // Hardware-specific validation
    if (data.errorCategory === 'hardware') {
      if (!data.errorTypeId) {
        errors.push('Vui lòng chọn loại lỗi cụ thể cho lỗi phần cứng');
      }
      
      // If need replacement is selected, must select components
      if (data.repairMethod === 'need_replacement' && data.selectedComponentIds.length === 0) {
        errors.push('Vui lòng chọn ít nhất một linh kiện cần thay thế');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  /**
   * Converts File objects to URLs (in real app, would upload to server)
   * Returns array of URL strings for database storage
   */
  const processMediaFiles = async (files: File[]): Promise<string[]> => {
    // In real implementation, upload files to server and return URLs
    // For now, return placeholder URLs
    return files.map((file, index) => `https://example.com/uploads/${Date.now()}_${index}_${file.name}`);
  };

  /**
   * Generates unique request code following pattern: YCSC-YYYY-NNNN
   */
  const generateRequestCode = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    return `YCSC-${year}-${randomNum.toString().padStart(4, '0')}`;
  };

  /**
   * Determines final status based on repair method
   */
  const getFinalStatus = (repairMethod: string): RepairStatus => {
    switch (repairMethod) {
      case 'software_fixed':
      case 'hardware_fixed':
        return RepairStatus.ĐÃ_HOÀN_THÀNH;
      case 'need_replacement':
        return RepairStatus.CHỜ_THAY_THẾ;
      default:
        return RepairStatus.ĐANG_XỬ_LÝ;
    }
  };

  /**
   * Handles form submission - creates new repair request
   * Follows database schema exactly as defined in project.prompt.md
   */
  const handleFormSubmit = useCallback(async (data: RepairProcessingFormData): Promise<RepairRequest | null> => {
    const validation = validateForm(data);
    if (!validation.isValid) {
      setError(`Dữ liệu không hợp lệ: ${validation.errors.join(', ')}`);
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Process media files
      const mediaUrls = await processMediaFiles(data.mediaFiles);
      
      // Determine final status
      const finalStatus = getFinalStatus(data.repairMethod);
      
      // Create repair request object matching database schema
      const newRepairRequest: Omit<RepairRequest, 'id'> = {
        requestCode: generateRequestCode(),
        computerAssetId: data.computerAssetId, // FK to assets.id
        reporterId: 'current-user-id', // Should come from auth context in real app
        assignedTechnicianId: 'current-technician-id', // Current technician ID
        errorTypeId: data.errorCategory === 'hardware' ? data.errorTypeId : undefined,
        description: data.description.trim(),
        mediaUrls: mediaUrls,
        status: finalStatus,
        resolutionNotes: data.repairNotes.trim(),
        createdAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(), // Auto-accepted since technician is creating
        completedAt: finalStatus === RepairStatus.ĐÃ_HOÀN_THÀNH ? new Date().toISOString() : undefined,
      };

      // In real app, make API call to create repair request
      // const response = await fetch('/api/repair-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newRepairRequest)
      // });
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const createdRequest: RepairRequest = {
        id: `req-${Date.now()}`,
        ...newRepairRequest,
      };

      console.log('Created repair request:', createdRequest);
      return createdRequest;
      
    } catch (err) {
      setError('Có lỗi xảy ra khi ghi nhận xử lý. Vui lòng thử lại.');
      console.error('Error creating repair request:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm]);

  /**
   * Updates status of existing repair request
   * Used for status transitions like accepting, completing, etc.
   */
  const handleStatusUpdate = useCallback(async (
    requestId: string, 
    status: RepairStatus, 
    notes?: string
  ): Promise<RepairRequest | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData = {
        status,
        resolutionNotes: notes,
        acceptedAt: status === RepairStatus.ĐÃ_TIẾP_NHẬN ? new Date().toISOString() : undefined,
        completedAt: status === RepairStatus.ĐÃ_HOÀN_THÀNH ? new Date().toISOString() : undefined,
      };

      // In real app, make API call
      // const response = await fetch(`/api/repair-requests/${requestId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updateData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated repair request status:', { requestId, ...updateData });
      
      // Return updated request (mock)
      return {
        id: requestId,
        requestCode: 'YCSC-2025-0000',
        computerAssetId: '',
        reporterId: '',
        description: '',
        status,
        resolutionNotes: notes,
        createdAt: new Date().toISOString(),
        acceptedAt: updateData.acceptedAt,
        completedAt: updateData.completedAt,
      } as RepairRequest;
      
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.');
      console.error('Error updating repair request status:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Resets form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setError(null);
  }, []);

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    formData,
    setFormData,
    isSubmitting,
    isLoading,
    handleFormSubmit,
    handleStatusUpdate,
    resetForm,
    validateForm,
    error,
    clearError,
  };
};