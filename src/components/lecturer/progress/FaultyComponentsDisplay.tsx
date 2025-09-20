"use client";

import { Card, Tag, Badge, Descriptions } from "antd";
import { RepairRequestWithDetails } from "@/types";
import { Cpu, HardDrive, Monitor, Keyboard, Mouse } from "lucide-react";

interface FaultyComponentsDisplayProps {
  request: RepairRequestWithDetails;
}

const componentIcons = {
  CPU: Cpu,
  RAM: HardDrive,
  STORAGE: HardDrive,
  MONITOR: Monitor,
  KEYBOARD: Keyboard,
  MOUSE: Mouse,
  PSU: HardDrive,
  MOTHERBOARD: HardDrive,
  GPU: Monitor,
  OTHER: HardDrive,
};

const componentTypeColors = {
  CPU: "red",
  RAM: "blue",
  STORAGE: "green",
  MONITOR: "purple",
  KEYBOARD: "orange",
  MOUSE: "cyan",
  PSU: "magenta",
  MOTHERBOARD: "gold",
  GPU: "lime",
  OTHER: "default",
} as const;

export default function FaultyComponentsDisplay({
  request,
}: FaultyComponentsDisplayProps) {
  if (!request.faultyComponents || request.faultyComponents.length === 0) {
    return (
      <Card title="Linh kiện bị lỗi" className="mt-4">
        <p className="text-gray-500">
          Chưa có thông tin chi tiết về linh kiện bị lỗi.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Chi tiết linh kiện bị lỗi" className="mt-4">
      <div className="space-y-4">
        {request.faultyComponents.map((component, index) => {
          const IconComponent =
            componentIcons[
              component.componentType as keyof typeof componentIcons
            ] || HardDrive;
          const color =
            componentTypeColors[
              component.componentType as keyof typeof componentTypeColors
            ] || "default";

          return (
            <div
              key={component.componentId}
              className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium text-lg">
                    {component.componentName}
                  </h4>
                  <Tag color={color}>{component.componentType}</Tag>
                </div>
                <Badge
                  count={index + 1}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </div>

              <Descriptions column={1} size="small" className="mb-3">
                <Descriptions.Item label="Thông số kỹ thuật">
                  {component.componentSpecs || "Không có thông tin"}
                </Descriptions.Item>
                {component.serialNumber && (
                  <Descriptions.Item label="Số serial">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {component.serialNumber}
                    </code>
                  </Descriptions.Item>
                )}
                {component.note && (
                  <Descriptions.Item label="Mô tả lỗi cụ thể">
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-red-800">
                      {component.note}
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Tổng số linh kiện bị lỗi:</strong>{" "}
          {request.faultyComponents.length} linh kiện
        </p>
      </div>
    </Card>
  );
}
