"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ReplacementStatus } from "@/types";
// import { mockReplacementRequests } from "@/lib/mockData/replacementRequests";
import {
  CreateListHeader,
  CreateListForm,
  EquipmentSelection,
  CreateListSidebar,
  SuccessModal,
} from "@/components/leadTechnician/createList";

// Type annotation for request data
interface RequestData {
  id: string;
  status: string;
  estimatedCost?: number;
  [key: string]: any;
}

export default function TaoDanhSachDePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Get approved requests
  const approvedRequests = useMemo(() => {
    return mockReplacementRequests.filter(
      (request) => request.status === ReplacementStatus.ĐÃ_DUYỆT
    );
  }, []);

  // Initialize with all approved requests selected
  const [selectedRequests, setSelectedRequests] = useState<string[]>(() =>
    approvedRequests.map((req) => req.id)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdListCount, setCreatedListCount] = useState(0);

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) => {
      if (prev.includes(requestId)) {
        return prev.filter((id) => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === approvedRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(approvedRequests.map((req) => req.id));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || selectedRequests.length === 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedItems = approvedRequests.filter((req) =>
      selectedRequests.includes(req.id)
    );

    console.log("Danh sách đề xuất được tạo:", {
      title,
      description,
      items: selectedItems,
      createdAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setCreatedListCount(selectedItems.length);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/to-truong-ky-thuat/duyet-de-xuat");
  };

  const getTotalEstimatedCost = () => {
    return selectedRequests
      .map((id) => approvedRequests.find((req) => req.id === id))
      .filter(Boolean)
      .reduce((total, req) => total + (req?.estimatedCost || 0), 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <CreateListHeader isSubmitting={isSubmitting} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form */}
          <CreateListForm
            title={title}
            description={description}
            isSubmitting={isSubmitting}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
          />

          {/* Equipment Selection */}
          <EquipmentSelection
            approvedRequests={approvedRequests}
            selectedRequests={selectedRequests}
            isSubmitting={isSubmitting}
            onSelectRequest={handleSelectRequest}
            onSelectAll={handleSelectAll}
          />
        </div>

        {/* Sidebar */}
        <CreateListSidebar
          selectedCount={selectedRequests.length}
          totalCount={approvedRequests.length}
          totalCost={getTotalEstimatedCost()}
          title={title}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        createdListCount={createdListCount}
        onClose={handleSuccessClose}
      />
    </div>
  );
}
