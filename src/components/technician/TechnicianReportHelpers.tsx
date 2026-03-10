import React, { useState, useEffect } from "react";
import { Card, Tag, Steps } from "antd";

const { Step } = Steps;

interface TechnicianReportStepsProps {
  currentStep: number;
}

export const TechnicianReportSteps: React.FC<TechnicianReportStepsProps> = ({ currentStep }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const steps = [
    {
      title: "Chọn vị trí",
      description: isMobile ? undefined : "Tòa nhà - Tầng - Phòng máy",
    },
    {
      title: "Chọn thiết bị",
      description: isMobile ? undefined : "Thiết bị cần xử lý",
    },
    {
      title: "Phân loại lỗi",
      description: isMobile ? undefined : "Phần mềm/Phần cứng & loại lỗi",
    },
    {
      title: "Chi tiết lỗi",
      description: isMobile ? undefined : "Linh kiện/Phần mềm cụ thể",
    },
    {
      title: "Mô tả vấn đề",
      description: isMobile ? undefined : "Chi tiết hiện tượng lỗi",
    },
    {
      title: "Xử lý & kết quả",
      description: isMobile ? undefined : "Phương pháp & ghi chú xử lý",
    },
    {
      title: "Hoàn tất",
      description: isMobile ? undefined : "Đính kèm ảnh & xác nhận",
    },
  ];

  return (
    <Card className="mb-4 sm:mb-5">
      <Steps 
        current={currentStep} 
        size="small" 
        direction={isMobile ? "vertical" : "horizontal"}
        responsive={true}
        className="w-full"
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            title={<span className="text-xs sm:text-sm">{step.title}</span>}
            description={step.description ? <span className="text-xs hidden sm:inline">{step.description}</span> : undefined}
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