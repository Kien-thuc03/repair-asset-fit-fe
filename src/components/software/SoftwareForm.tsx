"use client";

import { Send } from "lucide-react";
import { SimpleAsset as Asset } from "@/types";
import RoomAssetSteps from "./RoomAssetSteps";
import SoftwareCategorySelection from "./SoftwareCategorySelection";
import SoftwareSelection from "./SoftwareSelection";
import SoftwareErrorTypeSelector from "./SoftwareErrorTypeSelector";
import { DescriptionInput, MediaUploader } from "@/components/report";

interface SoftwareReportForm {
  assetId: string;
  roomId: string;
  errorTypeId: string;
  softwareCategory: string;
  softwareId: string;
  softwareName: string;
  isCustomSoftware: boolean;
  softwareVersion: string;
  description: string;
  mediaFiles: File[];
}

interface Software {
  id: string;
  name: string;
  category: string;
  version?: string;
  description?: string;
  license?: string;
}

interface SoftwareFormProps {
  formData: SoftwareReportForm;
  setFormData: React.Dispatch<React.SetStateAction<SoftwareReportForm>>;
  filteredAssets: Asset[];
  availableSoftware: Software[];
  installedSoftware: Software[];
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onRoomChange: (roomId: string) => void;
  onAssetChange: (assetId: string) => void;
  onSoftwareCategoryChange: (category: string) => void;
  onSoftwareChange: (softwareId: string) => void;
  onMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SoftwareForm({
  formData,
  setFormData,
  filteredAssets,
  availableSoftware,
  installedSoftware,
  isSubmitting,
  onSubmit,
  onCancel,
  onRoomChange,
  onAssetChange,
  onSoftwareCategoryChange,
  onSoftwareChange,
  onMediaChange,
}: SoftwareFormProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <RoomAssetSteps
          roomId={formData.roomId}
          assetId={formData.assetId}
          filteredAssets={filteredAssets}
          onRoomChange={onRoomChange}
          onAssetChange={onAssetChange}
        />

        <SoftwareCategorySelection
          softwareCategory={formData.softwareCategory}
          onSoftwareCategoryChange={onSoftwareCategoryChange}
        />

        <SoftwareSelection
          softwareCategory={formData.softwareCategory}
          softwareId={formData.softwareId}
          softwareName={formData.softwareName}
          isCustomSoftware={formData.isCustomSoftware}
          softwareVersion={formData.softwareVersion}
          assetId={formData.assetId}
          availableSoftware={availableSoftware}
          installedSoftware={installedSoftware}
          onSoftwareChange={onSoftwareChange}
          onSoftwareNameChange={(name) =>
            setFormData((prev) => ({ ...prev, softwareName: name }))
          }
          onSoftwareVersionChange={(version) =>
            setFormData((prev) => ({ ...prev, softwareVersion: version }))
          }
        />

        <SoftwareErrorTypeSelector
          errorTypeId={formData.errorTypeId}
          onErrorTypeChange={(errorTypeId) =>
            setFormData((prev) => ({ ...prev, errorTypeId }))
          }
        />

        <DescriptionInput
          description={formData.description}
          onChange={(description: string) =>
            setFormData((prev) => ({ ...prev, description }))
          }
        />

        <MediaUploader
          mediaFiles={formData.mediaFiles}
          onMediaChange={onMediaChange}
          onRemoveFile={(index) =>
            setFormData((prev) => ({
              ...prev,
              mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
            }))
          }
        />

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Gửi báo cáo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
