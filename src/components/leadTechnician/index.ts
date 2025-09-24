// Export all lead technician components
export * from "./assignment";
export * from "./createList";
export * from "./dashboard";
export * from "./inspection";
export * from "./inspectionDetail";
export * from "./reportList";
export * from "./proposalApproval";

// Export report detail components with prefixed names to avoid conflicts
export {
  DetailHeader as ReportDetailHeader,
  AssetInfo as ReportAssetInfo,
  ErrorDescription as ReportErrorDescription,
  ResolutionNotes as ReportResolutionNotes,
  ReporterInfo as ReportReporterInfo,
  TechnicianInfo as ReportTechnicianInfo,
  LoadingState as ReportLoadingState,
  NotFoundState as ReportNotFoundState,
} from "./reportDetail";
