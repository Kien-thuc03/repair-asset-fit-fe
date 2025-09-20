import React from "react";
import { Card, Tag, Steps } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, ToolOutlined } from "@ant-design/icons";

const { Step } = Steps;

interface TechnicianReportStepsProps {
  currentStep: number;
}

export const TechnicianReportSteps: React.FC<TechnicianReportStepsProps> = ({ currentStep }) => {
  const steps = [
    {
      title: "Chọn vị trí",
      description: "Tòa - Tầng - Phòng",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Chọn thiết bị",
      description: "Thiết bị cần xử lý",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Phân loại lỗi",
      description: "Hardware/Software",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Phần bị lỗi",
      description: "linh kiện/ứng dụng",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Xử lý",
      description: "Phương pháp & kết quả",
      icon: <ToolOutlined />,
    },
    {
      title: "Hoàn tất",
      description: "Xác nhận & ghi nhận",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <Card className="mb-6">
      <Steps current={currentStep} size="small" responsive={false}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            description={step.description}
            status={
              index < currentStep 
                ? "finish" 
                : index === currentStep 
                  ? "process" 
                  : "wait"
            }
          />
        ))}
      </Steps>
    </Card>
  );
};

interface RepairMethodInfoProps {
  method: string;
}

export const RepairMethodInfo: React.FC<RepairMethodInfoProps> = ({ method }) => {
  const methodInfo = {
    on_site_repair: {
      label: "Sửa chữa tại chỗ",
      color: "green",
      description: "Khắc phục lỗi trực tiếp tại vị trí thiết bị",
    },
    component_replacement: {
      label: "Thay thế linh kiện",
      color: "orange",
      description: "Thay thế linh kiện hỏng bằng linh kiện mới",
    },
    software_reinstall: {
      label: "Cài đặt lại phần mềm",
      color: "blue",
      description: "Cài đặt lại hoặc cập nhật phần mềm",
    },
    system_restore: {
      label: "Khôi phục hệ thống",
      color: "purple",
      description: "Khôi phục hệ thống về trạng thái trước đó",
    },
    need_replacement: {
      label: "Cần thay thế thiết bị",
      color: "red",
      description: "Thiết bị cần được thay thế hoàn toàn",
    },
    other: {
      label: "Khác",
      color: "default",
      description: "Phương pháp khác (chi tiết trong ghi chú)",
    },
  };

  const info = methodInfo[method as keyof typeof methodInfo];
  
  if (!info) return null;

  return (
    <div className="mt-2">
      <Tag color={info.color}>{info.label}</Tag>
      <p className="text-sm text-gray-600 mt-1">{info.description}</p>
    </div>
  );
};