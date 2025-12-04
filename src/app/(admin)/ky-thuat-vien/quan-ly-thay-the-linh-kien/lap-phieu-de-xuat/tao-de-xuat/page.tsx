"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Form, message, Breadcrumb, Tag, Card } from "antd";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createReplacementProposal,
  ComponentFromRepair,
} from "@/lib/api/replacement-proposals";

export default function CreateProposalPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<ComponentFromRepair[]>([]);
  const [newItemInfo, setNewItemInfo] = useState<Record<string, { newItemName: string; newItemSpecs: string }>>({});

  // Load selected components from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("selectedComponentsForProposal");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setSelectedComponents(data);
        
        // Initialize newItemInfo with component names and specs
        const initialInfo: Record<string, { newItemName: string; newItemSpecs: string }> = {};
        data.forEach((component: ComponentFromRepair) => {
          initialInfo[component.componentId] = {
            newItemName: component.componentName || "",
            newItemSpecs: component.componentSpecs || "",
          };
        });
        setNewItemInfo(initialInfo);

        // Set default form values
        form.setFieldsValue({
          title: `Đề xuất thay thế ${data.length} linh kiện`,
          description: "",
        });
      } catch {
        message.error("Không thể tải dữ liệu linh kiện đã chọn");
        router.push("/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat");
      }
    } else {
      message.warning("Không có linh kiện nào được chọn");
      router.push("/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat");
    }
  }, [router, form]);

  // Handle new item info change
  const handleNewItemInfoChange = (
    componentId: string,
    field: "newItemName" | "newItemSpecs",
    value: string
  ) => {
    setNewItemInfo((prev) => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        [field]: value,
      },
    }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // Validate: Check all new items have names
      const missingItems: string[] = [];
      selectedComponents.forEach((component) => {
        const itemInfo = newItemInfo[component.componentId];
        if (!itemInfo || !itemInfo.newItemName || itemInfo.newItemName.trim() === "") {
          missingItems.push(component.componentName || component.componentId);
        }
      });

      if (missingItems.length > 0) {
        message.error(
          `Vui lòng nhập tên linh kiện mới cho: ${missingItems.slice(0, 3).join(", ")}${
            missingItems.length > 3 ? "..." : ""
          }`
        );
        setIsSubmitting(false);
        return;
      }

      // Collect repair request IDs
      const repairRequestIds = Array.from(
        new Set(
          selectedComponents
            .map((c) => c.repairRequestId)
            .filter((id): id is string => !!id)
        )
      );

      // Create proposal data
      const proposalData = {
        title: values.title,
        description: values.description,
        items: selectedComponents.map((component) => {
          const itemInfo = newItemInfo[component.componentId] || {
            newItemName: "",
            newItemSpecs: "",
          };
          return {
            oldComponentId: component.componentId,
            newItemName: itemInfo.newItemName.trim(),
            newItemSpecs: itemInfo.newItemSpecs?.trim() || undefined,
            quantity: component.quantity || 1,
            reason: component.reason || component.repairDescription || "",
          };
        }),
        ...(repairRequestIds.length > 0 && { repairRequestIds }),
      };

      console.log("📤 Sending proposal data:", proposalData);

      // Call API
      const result = await createReplacementProposal(proposalData);

      message.success({
        content: `Tạo đề xuất thay thế thành công! Mã: ${result.proposalCode}`,
        duration: 5,
      });

      // Clear localStorage
      localStorage.removeItem("selectedComponentsForProposal");

      // Navigate back
      router.push("/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Tạo đề xuất thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  // Calculate repair request info
  const repairRequestIds = Array.from(
    new Set(
      selectedComponents
        .map((c) => c.repairRequestId)
        .filter((id): id is string => !!id)
    )
  );
  const requestCodes = Array.from(
    new Set(selectedComponents.map((c) => c.requestCode).filter((code) => !!code))
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/ky-thuat-vien",
            title: <span>Trang chủ</span>,
          },
          {
            title: <span>Quản lý thay thế linh kiện</span>,
          },
          {
            href: "/ky-thuat-vien/quan-ly-thay-the-linh-kien/lap-phieu-de-xuat",
            title: <span>Lập phiếu đề xuất</span>,
          },
          {
            title: <span>Tạo đề xuất mới</span>,
          },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo đề xuất thay thế mới</h1>
          <p className="text-gray-600 mt-1">
            Điền thông tin đề xuất và linh kiện mới cần mua
          </p>
        </div>
        <Button icon={<ArrowLeft className="w-4 h-4" />} onClick={handleCancel}>
          Quay lại
        </Button>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Info Card */}
          <Card title="Thông tin đề xuất" className="shadow-sm">
            <Form form={form} layout="vertical">
              <Form.Item
                label={<span className="font-medium">Tiêu đề đề xuất</span>}
                name="title"
                rules={[
                  { required: true, message: "Vui lòng nhập tiêu đề!" },
                  { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự" },
                  { max: 200, message: "Tiêu đề không quá 200 ký tự" },
                ]}>
                <Input
                  placeholder="Ví dụ: Đề xuất thay thế RAM và SSD cho phòng H.03"
                  showCount
                  maxLength={200}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium">Mô tả chi tiết</span>}
                name="description"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả!" },
                  { min: 20, message: "Mô tả phải có ít nhất 20 ký tự" },
                ]}>
                <Input.TextArea
                  rows={6}
                  placeholder="Mô tả lý do cần thay thế, tình trạng hiện tại, yêu cầu cụ thể..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Form>
          </Card>

          {/* Components List Card */}
          <Card
            title={
              <div className="flex items-center justify-between">
                <span>Danh sách linh kiện</span>
                <Tag color="green" className="text-sm">
                  {selectedComponents.length} linh kiện
                </Tag>
              </div>
            }
            className="shadow-sm">
            <div className="space-y-4">
              {selectedComponents.map((component, index) => {
                const itemInfo = newItemInfo[component.componentId] || {
                  newItemName: "",
                  newItemSpecs: "",
                };
                return (
                  <div
                    key={component.componentId}
                    className="border-l-4 border-blue-400 bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors">
                    {/* Old Component Info */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-500">
                              #{index + 1}
                            </span>
                            <span className="font-semibold text-gray-900">
                              Linh kiện cũ: {component.componentName}
                            </span>
                            {component.componentType && (
                              <Tag color="red" className="text-xs m-0">
                                {component.componentType}
                              </Tag>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div>
                              💻 {component.assetName}
                              <span className="text-gray-500 ml-1">
                                ({component.ktCode})
                              </span>
                            </div>

                            {component.componentSpecs && (
                              <div>📋 Thông số: {component.componentSpecs}</div>
                            )}

                            <div className="font-mono text-blue-600">
                              🔖 {component.requestCode}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm">
                            x{component.quantity || 1}
                          </div>
                        </div>
                      </div>

                      {component.reason && (
                        <div className="text-xs text-gray-700 bg-yellow-50 p-2 rounded mt-2">
                          <span className="font-medium">Lý do thay thế:</span>{" "}
                          {component.reason}
                        </div>
                      )}
                    </div>

                    {/* New Component Info Form */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-green-700">
                          Linh kiện mới cần mua:
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tên linh kiện mới{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Ví dụ: Kingston Fury Beast DDR4 16GB (2x8GB) 3200MHz"
                          value={itemInfo.newItemName}
                          onChange={(e) =>
                            handleNewItemInfoChange(
                              component.componentId,
                              "newItemName",
                              e.target.value
                            )
                          }
                          status={
                            !itemInfo.newItemName ||
                            itemInfo.newItemName.trim() === ""
                              ? "error"
                              : ""
                          }
                        />
                        {(!itemInfo.newItemName ||
                          itemInfo.newItemName.trim() === "") && (
                          <div className="text-xs text-red-500 mt-1">
                            Vui lòng nhập tên linh kiện mới
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Thông số kỹ thuật (tùy chọn)
                        </label>
                        <Input.TextArea
                          rows={2}
                          placeholder="Ví dụ: DDR4, 16GB (2x8GB), 3200MHz, CL18, Non-ECC, DIMM"
                          value={itemInfo.newItemSpecs}
                          onChange={(e) =>
                            handleNewItemInfoChange(
                              component.componentId,
                              "newItemSpecs",
                              e.target.value
                            )
                          }
                          showCount
                          maxLength={500}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Repair Requests Info */}
          {repairRequestIds.length > 0 && (
            <Card className="shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="text-2xl">🔗</div>
                  <div className="font-semibold">Yêu cầu sửa chữa liên quan</div>
                </div>
                <div className="text-sm text-gray-700">
                  Đề xuất này sẽ được liên kết với {repairRequestIds.length} yêu cầu sửa chữa
                </div>
                <div className="flex flex-wrap gap-2">
                  {requestCodes.map((code, idx) => (
                    <Tag key={idx} color="blue">
                      {code}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Summary Card */}
          <Card title="Tóm tắt" className="shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Tổng số linh kiện:</span>
                <span className="font-semibold text-lg">
                  {selectedComponents.length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Tổng số lượng:</span>
                <span className="font-semibold text-lg">
                  {selectedComponents.reduce((sum, c) => sum + (c.quantity || 1), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">YCSC liên quan:</span>
                <span className="font-semibold text-lg">{repairRequestIds.length}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-sm">
            <div className="space-y-3">
              <Button
                type="primary"
                size="large"
                block
                icon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )
                }
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo đề xuất..." : "Tạo đề xuất"}
              </Button>
              <Button size="large" block onClick={handleCancel} disabled={isSubmitting}>
                Hủy bỏ
              </Button>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="shadow-sm bg-blue-50 border-blue-200">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="font-semibold text-blue-900">💡 Lưu ý:</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Tiêu đề phải có ít nhất 10 ký tự</li>
                <li>Mô tả phải có ít nhất 20 ký tự</li>
                <li>Tên linh kiện mới là bắt buộc</li>
                <li>Thông số kỹ thuật là tùy chọn nhưng nên điền đầy đủ</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
