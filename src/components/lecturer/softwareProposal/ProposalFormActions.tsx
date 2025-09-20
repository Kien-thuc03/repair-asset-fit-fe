import React from "react";
import { Button } from "antd";
import { Send, X } from "lucide-react";

interface ProposalFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}
const ProposalFormActions: React.FC<ProposalFormActionsProps> = ({
  isSubmitting,
  isEditMode,
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <Button
        type="primary"
        size="large"
        htmlType="submit"
        loading={isSubmitting}
        icon={<Send className="w-4 h-4" />}>
        {isSubmitting
          ? isEditMode
            ? "Đang cập nhật..."
            : "Đang gửi..."
          : isEditMode
          ? "Cập nhật đề xuất"
          : "Gửi đề xuất"}
      </Button>
    </div>
  );
};

export default ProposalFormActions;
