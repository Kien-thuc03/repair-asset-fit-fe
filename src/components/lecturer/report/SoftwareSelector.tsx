import React from "react";
import { Software } from "@/types";

interface SoftwareSelectorProps {
  showSoftwareSelection: boolean;
  setShowSoftwareSelection: (show: boolean) => void;
  assetId: string;
  filteredSoftware: Software[];
  selectedSoftwareIds: string[];
  setSelectedSoftwareIds: (ids: string[]) => void;
  onSoftwareChange: (softwareId: string) => void;
}

const SoftwareSelector: React.FC<SoftwareSelectorProps> = ({
  showSoftwareSelection,
  setShowSoftwareSelection,
  assetId,
  filteredSoftware,
  selectedSoftwareIds,
  setSelectedSoftwareIds,
  onSoftwareChange,
}) => {
  const handleToggleSoftwareSelection = (checked: boolean) => {
    setShowSoftwareSelection(checked);
    if (!checked) {
      setSelectedSoftwareIds([]);
      onSoftwareChange("");
    }
  };

  const handleClearSelection = () => {
    setSelectedSoftwareIds([]);
    onSoftwareChange("");
  };

  const handleSoftwareClick = (software: Software) => {
    const isSelected = selectedSoftwareIds.includes(software.id);

    let newSelectedIds: string[];
    if (isSelected) {
      newSelectedIds = selectedSoftwareIds.filter((id) => id !== software.id);
    } else {
      newSelectedIds = [...selectedSoftwareIds, software.id];
    }

    setSelectedSoftwareIds(newSelectedIds);
    onSoftwareChange(newSelectedIds.length > 0 ? newSelectedIds[0] : "");
  };

  const getSelectedSoftware = () => {
    return selectedSoftwareIds
      .map((id) => filteredSoftware.find((software) => software.id === id))
      .filter(Boolean)
      .map((software) => software!.name)
      .join(", ");
  };

  if (!assetId) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="block text-sm font-medium text-gray-700">
              Bước 5: Chọn phần mềm gặp sự cố (tùy chọn)
            </h3>
            <p className="text-sm text-gray-500">
              Chọn các phần mềm cụ thể đang gặp sự cố trên thiết bị này
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="software-selection"
              checked={showSoftwareSelection}
              onChange={(e) => handleToggleSoftwareSelection(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="software-selection"
              className="text-sm text-gray-700">
              Chọn phần mềm cụ thể
            </label>
          </div>
        </div>

        {showSoftwareSelection && (
          <div className="space-y-4">
            {filteredSoftware.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg font-medium">
                  Không có phần mềm nào được cài đặt
                </div>
                <div className="text-sm">
                  Thiết bị này chưa có phần mềm nào được ghi nhận trong hệ thống
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Tìm thấy {filteredSoftware.length} phần mềm đã cài đặt
                  </span>
                  {selectedSoftwareIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-sm text-red-600 hover:text-red-800">
                      Bỏ chọn tất cả
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSoftware.map((software) => {
                    const isSelected = selectedSoftwareIds.includes(
                      software.id
                    );

                    return (
                      <div
                        key={software.id}
                        onClick={() => handleSoftwareClick(software)}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }
                        `}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {software.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Version: {software.version}
                            </p>
                            <p className="text-sm text-gray-500">
                              {software.publisher}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="ml-2">
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedSoftwareIds.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-1">
                      Phần mềm đã chọn:
                    </h4>
                    <p className="text-sm text-green-700">
                      {getSelectedSoftware()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Thông tin này sẽ giúp kỹ thuật viên xử lý sự cố hiệu quả
                      hơn
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareSelector;
