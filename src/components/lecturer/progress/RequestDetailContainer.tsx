"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";
import { RepairRequest, RepairRequestWithDetails } from "@/types";
import DetailHeader from "./DetailHeader";
import RequestInfo from "./RequestInfo";
import ResolutionNotes from "./ResolutionNotes";
import ProgressTimeline from "./ProgressTimeline";
import AdditionalInfo from "./AdditionalInfo";
import CancelRequestModal from "./CancelRequestModal";
import FaultyComponentsDisplay from "./FaultyComponentsDisplay";

interface RequestDetailContainerProps {
  request: RepairRequest | RepairRequestWithDetails | undefined | null;
}

export default function RequestDetailContainer({
  request,
}: RequestDetailContainerProps) {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Handle edit request
  const handleEditRequest = () => {
    if (!request) return;

    // For backward compatibility with old RepairRequest structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legacyRequest = request as any;

    // Prepare data for editing
    const editData = {
      requestId: request.id,
      computerAssetId: request.computerAssetId || legacyRequest.assetId,
      assetName: request.assetName,
      roomName: request.roomName,
      componentName: request.componentName,
      errorTypeId: request.errorTypeId || "",
      errorTypeName: request.errorTypeName || "",
      description: request.description,
      // Add timestamp to ensure data freshness
      timestamp: Date.now(),
    };

    // Save to localStorage
    localStorage.setItem("editRequestData", JSON.stringify(editData));

    // Navigate to report page
    router.push("/giang-vien/bao-cao-loi?edit=true");
  };

  // Handle cancel request
  const handleCancelRequest = () => {
    setShowCancelModal(true);
  };

  // Confirm cancel request
  const confirmCancelRequest = () => {
    // TODO: Call API to cancel request
    console.log("Cancel request:", request?.id);
    setShowCancelModal(false);
    // After successful cancellation, redirect back
    router.push("/giang-vien/theo-doi-tien-do");
  };

  // If request not found, show error state
  if (!request) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Không tìm thấy yêu cầu
        </h1>
        <p className="mt-2 text-gray-600">
          Yêu cầu với ID này không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => router.push("/giang-vien/theo-doi-tien-do")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        request={request}
        onEditRequest={handleEditRequest}
        onCancelRequest={handleCancelRequest}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <RequestInfo request={request} formatDate={formatDate} />
          {/* Display faulty components details if available */}
          {"faultyComponents" in request && (
            <FaultyComponentsDisplay
              request={request as RepairRequestWithDetails}
            />
          )}
          <ResolutionNotes resolutionNotes={request.resolutionNotes} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProgressTimeline request={request} formatDate={formatDate} />
          <AdditionalInfo request={request} />
        </div>
      </div>

      {/* Cancel Request Confirmation Modal */}
      <CancelRequestModal
        isOpen={showCancelModal}
        requestCode={request.requestCode}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelRequest}
      />
    </div>
  );
}
