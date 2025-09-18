import React from "react";
import { Component } from "@/types";

interface ComponentSelectorProps {
  showComponentSelection: boolean;
  setShowComponentSelection: (show: boolean) => void;
  assetId: string;
  filteredComponents: Component[];
  selectedComponentIds: string[];
  setSelectedComponentIds: (ids: string[]) => void;
  onComponentChange: (componentId: string) => void;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  showComponentSelection,
  setShowComponentSelection,
  assetId,
  filteredComponents,
  selectedComponentIds,
  setSelectedComponentIds,
  onComponentChange,
}) => {
  const handleToggleComponentSelection = (checked: boolean) => {
    setShowComponentSelection(checked);
    if (!checked) {
      setSelectedComponentIds([]);
      onComponentChange("");
    }
  };

  const handleClearSelection = () => {
    setSelectedComponentIds([]);
    onComponentChange("");
  };

  const handleComponentClick = (component: Component) => {
    const isSelected = selectedComponentIds.includes(component.id);
    const canSelect = component.status === "INSTALLED";

    if (!canSelect) return;

    let newSelectedIds: string[];
    if (isSelected) {
      newSelectedIds = selectedComponentIds.filter((id) => id !== component.id);
    } else {
      newSelectedIds = [...selectedComponentIds, component.id];
    }

    setSelectedComponentIds(newSelectedIds);
    onComponentChange(newSelectedIds.length > 0 ? newSelectedIds[0] : "");
  };

  const handleRemoveComponent = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedIds = selectedComponentIds.filter(
      (id) => id !== componentId
    );
    setSelectedComponentIds(newSelectedIds);
    onComponentChange(newSelectedIds.length > 0 ? newSelectedIds[0] : "");
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <input
          id="showComponents"
          type="checkbox"
          checked={showComponentSelection}
          disabled={!assetId}
          onChange={(e) => handleToggleComponentSelection(e.target.checked)}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
            !assetId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <label
          htmlFor="showComponents"
          className={`ml-3 block text-sm font-medium ${
            !assetId ? "text-gray-400" : "text-gray-700"
          }`}>
          Bước 5: Chọn linh kiện cụ thể (tùy chọn)
        </label>
      </div>

      <p
        className={`mb-3 text-sm ${
          !assetId ? "text-gray-400" : "text-gray-500"
        }`}>
        {!assetId
          ? "Vui lòng chọn thiết bị ở Bước 2 để có thể chọn linh kiện cụ thể"
          : "Tích vào đây nếu cần chọn linh kiện cụ thể bị lỗi. Bỏ chọn nếu lỗi ảnh hưởng toàn bộ thiết bị."}
      </p>

      {showComponentSelection && (
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Chọn linh kiện gặp lỗi (có thể chọn nhiều)
          </label>

          {!assetId ? (
            <p className="mt-1 text-sm text-gray-500 italic">
              Vui lòng chọn thiết bị để xem danh sách linh kiện
            </p>
          ) : filteredComponents.length === 0 ? (
            <p className="mt-1 text-sm text-gray-500 italic">
              Không có linh kiện nào được tìm thấy cho thiết bị này
            </p>
          ) : (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                  Click vào linh kiện gặp lỗi:
                </p>
                {selectedComponentIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-xs text-red-600 hover:text-red-800 underline">
                    Bỏ chọn tất cả ({selectedComponentIds.length})
                  </button>
                )}
              </div>

              {/* Hiển thị linh kiện đã chọn */}
              {selectedComponentIds.length > 0 && (
                <div className="mb-3 p-2 bg-blue-100 border border-blue-300 rounded">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    ✓ Đã chọn {selectedComponentIds.length} linh kiện:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedComponentIds.map((componentId) => {
                      const component = filteredComponents.find(
                        (c) => c.id === componentId
                      );
                      return (
                        <span
                          key={componentId}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-900">
                          {component?.componentType}
                          <button
                            type="button"
                            onClick={(e) =>
                              handleRemoveComponent(componentId, e)
                            }
                            className="ml-1 text-blue-700 hover:text-blue-900">
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {filteredComponents.map((component) => {
                  const isSelected = selectedComponentIds.includes(
                    component.id
                  );
                  const canSelect = component.status === "INSTALLED";

                  return (
                    <div
                      key={component.id}
                      onClick={() => handleComponentClick(component)}
                      className={`p-2 rounded transition-all duration-200 ${
                        !canSelect
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:shadow-md"
                      } ${
                        isSelected
                          ? "bg-blue-200 text-blue-900 border-2 border-blue-400 transform scale-105"
                          : component.status === "FAULTY"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : component.status === "REMOVED"
                          ? "bg-gray-100 text-gray-800 border border-gray-200"
                          : "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                      }`}>
                      <div className="font-medium truncate flex items-center justify-between">
                        <span>{component.componentType}</span>
                        <div className="flex items-center space-x-1">
                          {!canSelect && (
                            <span className="text-gray-500 text-xs">🚫</span>
                          )}
                          {isSelected && (
                            <span className="text-blue-600 font-bold">✓</span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-600 truncate">
                        {component.name}
                      </div>
                      {component.componentSpecs && (
                        <div className="text-gray-500 truncate text-xs">
                          {component.componentSpecs}
                        </div>
                      )}
                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className={`px-1 py-0.5 rounded text-xs ${
                            isSelected
                              ? "bg-blue-300"
                              : component.status === "INSTALLED"
                              ? "bg-green-200"
                              : component.status === "FAULTY"
                              ? "bg-red-200"
                              : component.status === "REMOVED"
                              ? "bg-gray-200"
                              : "bg-gray-200"
                          }`}>
                          {component.status === "INSTALLED"
                            ? "Hoạt động"
                            : component.status === "FAULTY"
                            ? "Có lỗi"
                            : component.status === "REMOVED"
                            ? "Đã gỡ"
                            : component.status}
                        </span>
                        {!canSelect && (
                          <span className="text-xs text-gray-500">
                            Không thể chọn
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-2 italic">
                💡 Tip: Chỉ có thể chọn các linh kiện đang hoạt động để báo lỗi.
                Các linh kiện đã có lỗi hoặc đang bảo trì sẽ không thể chọn.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentSelector;
