export interface InspectionReportItem {
  id: string;
  assetCode: string;
  assetName: string;
  location: string;
  quantity: number;
  unit: string;
  condition: string;
  proposedSolution: string;
  estimatedCost: number;
}

export interface InspectionReport {
  id: string;
  reportNumber: string;
  title: string;
  relatedReportId: string; // ID của tờ trình liên quan
  relatedReportTitle: string;
  inspectionDate: string;
  createdBy: string;
  createdAt: string;
  department: string;
  status: "pending" | "signed" | "sent_back";
  items: InspectionReportItem[];
  inspectorSignature?: string;
  inspectorName?: string;
  leaderSignature?: string;
  leaderSignedAt?: string;
  notes?: string;
}

export const mockInspectionReports: InspectionReport[] = [
  {
    id: "BB001",
    reportNumber: "BB/CNTT-2025/001",
    title:
      "Biên bản kiểm tra tình trạng kỹ thuật cơ sở vật chất bị hư hỏng hoặc cần cải tạo và đề nghị giải pháp khắc phục",
    relatedReportId: "TT001",
    relatedReportTitle: "Tờ trình đề xuất thay thế thiết bị máy tính phòng lab",
    inspectionDate: "2025-09-05",
    createdBy: "Nguyễn Văn Quản",
    createdAt: "2025-09-05T14:30:00Z",
    department: "Phòng Quản trị",
    status: "pending",
    inspectorSignature: "Nguyễn Văn Quản",
    inspectorName: "Nguyễn Văn Quản",
    items: [
      {
        id: "1",
        assetCode: "H8.01",
        assetName:
          "Máy tính Dell Vostro 3681 (Intel core i5 10400, DDR4 8G 3200, HDD 1TB)",
        location: "Phòng H8.01",
        quantity: 30,
        unit: "Chiếc",
        condition: "Chậm",
        proposedSolution:
          "Đề nghị nâng cấp: 1. 30 DDR4 8G 3200, 2. 30 SSD Sata 240GB",
        estimatedCost: 15000000,
      },
    ],
    notes:
      "Đại diện các đơn vị tham gia công tác kiểm tra tình trạng kỹ thuật của cơ sở vật chất bị hư hỏng cùng đọc, đồng ý và ký tên.",
  },
  {
    id: "BB002",
    reportNumber: "BB/CNTT-2025/002",
    title: "Biên bản kiểm tra tình trạng kỹ thuật thiết bị mạng",
    relatedReportId: "TT002",
    relatedReportTitle: "Tờ trình đề xuất thay thế switch mạng",
    inspectionDate: "2025-09-03",
    createdBy: "Trần Văn Minh",
    createdAt: "2025-09-03T10:15:00Z",
    department: "Phòng Quản trị",
    status: "signed",
    inspectorSignature: "Trần Văn Minh",
    inspectorName: "Trần Văn Minh",
    leaderSignature: "Nguyễn Thanh Tú",
    leaderSignedAt: "2025-09-04T08:30:00Z",
    items: [
      {
        id: "1",
        assetCode: "SW001",
        assetName: "Switch Cisco 24 port",
        location: "Phòng server A1.01",
        quantity: 2,
        unit: "Chiếc",
        condition: "Hỏng một số port, hoạt động không ổn định",
        proposedSolution: "Thay thế hoàn toàn bằng switch mới cùng loại",
        estimatedCost: 8000000,
      },
      {
        id: "2",
        assetCode: "SW002",
        assetName: "Switch D-Link 16 port",
        location: "Phòng A1.02",
        quantity: 1,
        unit: "Chiếc",
        condition: "LED báo lỗi liên tục, kết nối không ổn định",
        proposedSolution: "Thay thế bằng switch mới",
        estimatedCost: 2500000,
      },
    ],
    notes:
      "Thiết bị đã được kiểm tra kỹ lưỡng, cần thay thế khẩn cấp để đảm bảo hoạt động mạng.",
  },
];

export default mockInspectionReports;
