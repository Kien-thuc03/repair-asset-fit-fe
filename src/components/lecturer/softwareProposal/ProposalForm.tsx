import React from "react";
import {
  SoftwareProposalForm as ProposalFormType,
  SimpleAsset as Asset,
} from "@/types";
import RoomAssetSelector from "./RoomAssetSelector";
import SoftwareInfoSelector from "./SoftwareInfoSelector";
import ProposalJustification from "./ProposalJustification";
import ProposalFormActions from "./ProposalFormActions";

interface Room {
  id: string;
  name: string;
}

interface Computer {
  assetId: string;
  machineLabel: string;
}

interface ProposalFormProps {
  formData: ProposalFormType;
  isSubmitting: boolean;
  isEditMode: boolean;
  filteredAssets: Asset[];
  rooms: Room[];
  computers: Computer[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onRoomChange: (roomId: string) => void;
  onAssetChange: (assetId: string) => void;
  onFormDataChange: (field: keyof ProposalFormType, value: string) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  formData,
  isSubmitting,
  isEditMode,
  filteredAssets,
  rooms,
  computers,
  onSubmit,
  onCancel,
  onRoomChange,
  onAssetChange,
  onFormDataChange,
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

        <SoftwareInfoSelector
          softwareName={formData.softwareName}
          softwareVersion={formData.softwareVersion}
          publisher={formData.publisher}
          description={formData.description}
          onFormDataChange={onFormDataChange}
        />

        <ProposalJustification
          justification={formData.justification}
          targetUsers={formData.targetUsers}
          educationalPurpose={formData.educationalPurpose}
          onFormDataChange={onFormDataChange}
        />

        <ProposalFormActions
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};

export default ProposalForm;
