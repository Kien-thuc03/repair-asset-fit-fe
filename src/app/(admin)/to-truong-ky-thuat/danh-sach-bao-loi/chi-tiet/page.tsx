"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RepairRequest } from "@/types";
import { mockRepairRequests } from "@/lib/mockData";
import {
  DetailHeader,
  AssetInfo,
  ErrorDescription,
  ResolutionNotes,
  ReporterInfo,
  TechnicianInfo,
  LoadingState,
  NotFoundState,
} from "@/components/leadTechnician/reportDetail";

export default function ChiTietBaoLoiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get("id");

  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      // Tìm request từ mock data
      const foundRequest = mockRepairRequests.find(
        (req) => req.id === requestId
      );
      setRequest(foundRequest || null);
    }
    setLoading(false);
  }, [requestId]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!request) {
    return <NotFoundState onGoBack={handleGoBack} />;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <DetailHeader request={request} onGoBack={handleGoBack} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Information */}
          <AssetInfo request={request} />

          {/* Error Description */}
          <ErrorDescription request={request} />

          {/* Resolution Notes */}
          <ResolutionNotes request={request} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Information */}
          <ReporterInfo request={request} />

          {/* Technician Information */}
          <TechnicianInfo request={request} />
        </div>
      </div>
    </div>
  );
}