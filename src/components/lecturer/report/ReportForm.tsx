import React from "react";
import {
  ReportForm as ReportFormType,
  SimpleAsset as Asset,
  Component,
  Software,
} from "@/types";
import RoomAssetSelector from "./RoomAssetSelector";
import ErrorTypeSelector from "./ErrorTypeSelector";
import DescriptionInput from "./DescriptionInput";
import ComponentSelector from "./ComponentSelector";
import SoftwareSelector from "./SoftwareSelector";
import MediaUploader from "./MediaUploader";
import ReportFormActions from "./ReportFormActions";

interface Room {
  id: string;
  name: string;
}

interface Computer {
  assetId: string;
  machineLabel: string;
}

interface ErrorType {
  id: string;
  name: string;
}

interface ReportFormProps {
  formData: ReportFormType;
  isSubmitting: boolean;
  isEditMode: boolean;
  filteredAssets: Asset[];
  filteredComponents: Component[];
  filteredSoftware: Software[];
  selectedComponentIds: string[];
  selectedSoftwareIds: string[];
  showComponentSelection: boolean;
  showSoftwareSelection: boolean;
  rooms: Room[];
  errorTypes: ErrorType[];
  computers: Computer[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onRoomChange: (roomId: string) => void;
  onAssetChange: (assetId: string) => void;
  onErrorTypeChange: (errorTypeId: string) => void;
  onDescriptionChange: (description: string) => void;
  onComponentChange: (componentId: string) => void;
  onSoftwareChange: (softwareId: string) => void;
  onMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  setShowComponentSelection: (show: boolean) => void;
  setShowSoftwareSelection: (show: boolean) => void;
  setSelectedComponentIds: (ids: string[]) => void;
  setSelectedSoftwareIds: (ids: string[]) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  formData,
  isSubmitting,
  isEditMode,
  filteredAssets,
  filteredComponents,
  filteredSoftware,
  selectedComponentIds,
  selectedSoftwareIds,
  showComponentSelection,
  showSoftwareSelection,
  rooms,
  errorTypes,
  computers,
  onSubmit,
  onCancel,
  onRoomChange,
  onAssetChange,
  onErrorTypeChange,
  onDescriptionChange,
  onComponentChange,
  onSoftwareChange,
  onMediaChange,
  onRemoveFile,
  setShowComponentSelection,
  setShowSoftwareSelection,
  setSelectedComponentIds,
  setSelectedSoftwareIds,
}) => {
  // Check if selected error type is "Máy hư phần mềm" (ET002)
  const isSoftwareError = formData.errorTypeId === "ET002";

  return (
    <div className="bg-white shadow rounded-lg">
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <RoomAssetSelector
          roomId={formData.roomId}
          assetId={formData.assetId}
          rooms={rooms}
          filteredAssets={filteredAssets}
          computers={computers}
          onRoomChange={onRoomChange}
          onAssetChange={onAssetChange}
        />

        <ErrorTypeSelector
          errorTypeId={formData.errorTypeId}
          errorTypes={errorTypes}
          onChange={onErrorTypeChange}
        />

        <DescriptionInput
          description={formData.description}
          onChange={onDescriptionChange}
        />

        {/* Conditional rendering based on error type */}
        {isSoftwareError ? (
          <SoftwareSelector
            showSoftwareSelection={showSoftwareSelection}
            setShowSoftwareSelection={setShowSoftwareSelection}
            assetId={formData.assetId}
            filteredSoftware={filteredSoftware}
            selectedSoftwareIds={selectedSoftwareIds}
            setSelectedSoftwareIds={setSelectedSoftwareIds}
            onSoftwareChange={onSoftwareChange}
          />
        ) : (
          <ComponentSelector
            showComponentSelection={showComponentSelection}
            setShowComponentSelection={setShowComponentSelection}
            assetId={formData.assetId}
            filteredComponents={filteredComponents}
            selectedComponentIds={selectedComponentIds}
            setSelectedComponentIds={setSelectedComponentIds}
            onComponentChange={onComponentChange}
          />
        )}

        <MediaUploader
          mediaFiles={formData.mediaFiles}
          onMediaChange={onMediaChange}
          onRemoveFile={onRemoveFile}
        />

        <ReportFormActions
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};

export default ReportForm;
