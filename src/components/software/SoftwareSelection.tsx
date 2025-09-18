"use client";

interface Software {
  id: string;
  name: string;
  category: string;
  version?: string;
  description?: string;
  license?: string;
}

interface SoftwareSelectionProps {
  softwareCategory: string;
  softwareId: string;
  softwareName: string;
  isCustomSoftware: boolean;
  softwareVersion: string;
  assetId: string;
  availableSoftware: Software[];
  installedSoftware: Software[];
  onSoftwareChange: (softwareId: string) => void;
  onSoftwareNameChange: (name: string) => void;
  onSoftwareVersionChange: (version: string) => void;
}

export default function SoftwareSelection({
  softwareCategory,
  softwareId,
  softwareName,
  isCustomSoftware,
  softwareVersion,
  assetId,
  availableSoftware,
  installedSoftware,
  onSoftwareChange,
  onSoftwareNameChange,
  onSoftwareVersionChange,
}: SoftwareSelectionProps) {
  return (
    <div>
      <label
        htmlFor="softwareSelection"
        className="block text-sm font-medium text-gray-700">
        Bước 4: Chọn phần mềm <span className="text-red-500">*</span>
      </label>
      {softwareCategory ? (
        <div className="space-y-3">
          {/* Software dropdown */}
          <select
            id="softwareSelection"
            value={isCustomSoftware ? "custom" : softwareId}
            onChange={(e) => onSoftwareChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="">Chọn phần mềm</option>

            {/* Show installed software first if asset is selected */}
            {assetId && installedSoftware.length > 0 && (
              <optgroup label="Phần mềm đã cài đặt trên thiết bị">
                {installedSoftware.map((software) => (
                  <option key={software.id} value={software.id}>
                    {software.name}{" "}
                    {software.version && `(${software.version})`}
                  </option>
                ))}
              </optgroup>
            )}

            {/* Show all available software in category */}
            {availableSoftware.length > 0 && (
              <optgroup
                label={
                  assetId ? "Phần mềm khác trong danh mục" : "Phần mềm có sẵn"
                }>
                {availableSoftware
                  .filter(
                    (software) =>
                      !assetId ||
                      !installedSoftware.some(
                        (installed) => installed.id === software.id
                      )
                  )
                  .map((software) => (
                    <option key={software.id} value={software.id}>
                      {software.name}{" "}
                      {software.version && `(${software.version})`}
                    </option>
                  ))}
              </optgroup>
            )}

            <option value="custom">+ Thêm phần mềm khác...</option>
          </select>

          {/* Custom software name input */}
          {isCustomSoftware && (
            <div>
              <input
                type="text"
                placeholder="Nhập tên phần mềm..."
                value={softwareName}
                onChange={(e) => onSoftwareNameChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Software version input */}
          <div>
            <input
              type="text"
              placeholder="Phiên bản phần mềm (tùy chọn)"
              value={softwareVersion}
              onChange={(e) => onSoftwareVersionChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600">
            Vui lòng chọn loại phần mềm trước để hiển thị danh sách phần mềm có
            sẵn
          </p>
        </div>
      )}
      <p className="mt-1 text-sm text-gray-500">
        Chọn phần mềm từ danh sách hoặc thêm phần mềm mới nếu không tìm thấy
      </p>
    </div>
  );
}
