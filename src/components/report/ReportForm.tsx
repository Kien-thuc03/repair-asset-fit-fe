import React from "react";
import {
  ReportForm as ReportFormType,
  SimpleAsset as Asset,
  Component,
} from "@/types";
import RoomAssetSelector from "./RoomAssetSelector";
import ErrorTypeSelector from "./ErrorTypeSelector";
import DescriptionInput from "./DescriptionInput";
import ComponentSelector from "./ComponentSelector";
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
  selectedComponentIds: string[];
  showComponentSelection: boolean;
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
  onMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  setShowComponentSelection: (show: boolean) => void;
  setSelectedComponentIds: (ids: string[]) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  formData,
  isSubmitting,
  isEditMode,
  filteredAssets,
  filteredComponents,
  selectedComponentIds,
  showComponentSelection,
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
  onMediaChange,
  onRemoveFile,
  setShowComponentSelection,
  setSelectedComponentIds,
}) => {
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

        <ComponentSelector
          showComponentSelection={showComponentSelection}
          setShowComponentSelection={setShowComponentSelection}
          assetId={formData.assetId}
          filteredComponents={filteredComponents}
          selectedComponentIds={selectedComponentIds}
          setSelectedComponentIds={setSelectedComponentIds}
          onComponentChange={onComponentChange}
        />

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
