import {
  SubmissionForm,
  SubmissionFormData,
  ReplacementStatus,
} from "@/types/repair";

/**
 * API helper functions cho việc quản lý tờ trình (Submission Forms)
 * TODO: Thay thế bằng actual API calls khi có backend
 */

// Mô phỏng API call để lưu thông tin tờ trình
export const saveSubmissionForm = async (data: {
  proposalId: string;
  proposalCode: string;
  submissionFormUrl: string;
  formData: SubmissionFormData;
  submittedBy: string;
}): Promise<SubmissionForm> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const submissionForm: SubmissionForm = {
    id: `SF-${Date.now()}`, // Generate unique ID
    proposalId: data.proposalId,
    proposalCode: data.proposalCode,
    submissionFormUrl: data.submissionFormUrl,
    submittedBy: data.submittedBy,
    submittedAt: new Date().toISOString(),
    formData: data.formData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("💾 Saving submission form to database:", submissionForm);

  // TODO: Replace with actual API call
  // const response = await fetch('/api/submission-forms', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(submissionForm)
  // });
  // return response.json();

  return submissionForm;
};

// Mô phỏng API call để cập nhật trạng thái đề xuất
export const updateReplacementRequestStatus = async (
  proposalId: string,
  updates: {
    status: ReplacementStatus;
    submissionFormUrl?: string;
    updatedAt: string;
  }
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("🔄 Updating replacement request status:", {
    proposalId,
    updates,
  });

  // TODO: Replace with actual API call
  // const response = await fetch(`/api/replacement-requests/${proposalId}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updates)
  // });
  // return response.ok;

  return true;
};

// Helper function để generate đường dẫn tờ trình
export const generateSubmissionFormUrl = (proposalCode: string): string => {
  const timestamp = Date.now();
  return `/documents/submissions/${proposalCode}-${timestamp}.pdf`;
};

// Helper function để validate form data
export const validateSubmissionFormData = (
  data: SubmissionFormData
): string[] => {
  const errors: string[] = [];

  if (!data.submittedBy.trim()) {
    errors.push("Tên người đề nghị không được để trống");
  }

  if (!data.position.trim()) {
    errors.push("Chức vụ không được để trống");
  }

  if (!data.department.trim()) {
    errors.push("Đơn vị đề nghị không được để trống");
  }

  if (!data.recipientDepartment.trim()) {
    errors.push("Đơn vị tiếp nhận không được để trống");
  }

  if (!data.subject.trim()) {
    errors.push("Đề nghị (vấn đề) không được để trống");
  }

  if (!data.content.trim()) {
    errors.push("Nội dung tờ trình không được để trống");
  }

  if (!data.director.trim()) {
    errors.push("Tên giám đốc không được để trống");
  }

  if (!data.rector.trim()) {
    errors.push("Tên hiệu trưởng không được để trống");
  }

  return errors;
};
