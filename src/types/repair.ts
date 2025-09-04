export interface RepairRequest {
  id: string;
  assetId: string;
  assetName: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  requestedBy: string;
  requestedAt: string;
  assignedTo?: string;
  completedAt?: string;
  notes?: string;
}

export interface RepairInput {
  assetId: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface RepairFilter {
  search?: string;
  status?: "pending" | "in_progress" | "completed" | "rejected";
  startDate?: string;
  endDate?: string;
}
