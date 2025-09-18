// Software categories for classification
export const softwareCategories = [
  {
    id: "office",
    name: "Phần mềm văn phòng",
    description: "Office, PDF, Text Editor",
  },
  {
    id: "programming",
    name: "Phần mềm lập trình",
    description: "IDE, Compiler, Development Tools",
  },
  {
    id: "design",
    name: "Phần mềm thiết kế",
    description: "CAD, Graphics, Design Tools",
  },
  { id: "browser", name: "Trình duyệt web", description: "Web Browsers" },
  {
    id: "security",
    name: "Phần mềm bảo mật",
    description: "Antivirus, Firewall, Security Tools",
  },
  {
    id: "system",
    name: "Phần mềm hệ thống",
    description: "Drivers, Utilities, System Tools",
  },
  {
    id: "media",
    name: "Phần mềm đa phương tiện",
    description: "Video, Audio, Image Processing",
  },
  {
    id: "database",
    name: "Phần mềm cơ sở dữ liệu",
    description: "Database Management Systems",
  },
  { id: "other", name: "Phần mềm khác", description: "Other Software" },
];

// Software data - Danh mục các phần mềm có sẵn
export const mockSoftware = [
  // Office Software
  {
    id: "sw-office-001",
    name: "Microsoft Office 2021",
    version: "16.0.14931.20648",
    publisher: "Microsoft Corporation",
    category: "office",
    description: "Bộ phần mềm văn phòng gồm Word, Excel, PowerPoint, Outlook",
    licenseType: "Commercial",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "sw-office-002",
    name: "Microsoft Office 2019",
    version: "16.0.10386.20017",
    publisher: "Microsoft Corporation",
    category: "office",
    description: "Bộ phần mềm văn phòng phiên bản 2019",
    licenseType: "Commercial",
    createdAt: "2023-09-10T08:00:00Z",
  },
  {
    id: "sw-office-003",
    name: "WPS Office",
    version: "12.1.0.15120",
    publisher: "Kingsoft Office Software",
    category: "office",
    description: "Bộ phần mềm văn phòng miễn phí",
    licenseType: "Free",
    createdAt: "2024-02-01T08:00:00Z",
  },
  {
    id: "sw-office-004",
    name: "Adobe Acrobat Reader DC",
    version: "2023.008.20470",
    publisher: "Adobe Inc.",
    category: "office",
    description: "Phần mềm đọc và chỉnh sửa file PDF",
    licenseType: "Free",
    createdAt: "2024-01-20T08:00:00Z",
  },

  // Programming Software
  {
    id: "sw-prog-001",
    name: "Visual Studio Code",
    version: "1.85.2",
    publisher: "Microsoft Corporation",
    category: "programming",
    description: "IDE miễn phí cho lập trình",
    licenseType: "Free",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "sw-prog-002",
    name: "Visual Studio 2022",
    version: "17.8.3",
    publisher: "Microsoft Corporation",
    category: "programming",
    description: "IDE chuyên nghiệp cho .NET và C++",
    licenseType: "Commercial",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "sw-prog-003",
    name: "IntelliJ IDEA",
    version: "2023.3.2",
    publisher: "JetBrains",
    category: "programming",
    description: "IDE cho Java và các ngôn ngữ JVM",
    licenseType: "Commercial",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "sw-prog-004",
    name: "Eclipse IDE",
    version: "2023-12",
    publisher: "Eclipse Foundation",
    category: "programming",
    description: "IDE mã nguồn mở cho Java",
    licenseType: "Free",
    createdAt: "2024-01-05T08:00:00Z",
  },
  {
    id: "sw-prog-005",
    name: "Dev-C++",
    version: "6.3",
    publisher: "Bloodshed Software",
    category: "programming",
    description: "IDE miễn phí cho C/C++",
    licenseType: "Free",
    createdAt: "2023-12-01T08:00:00Z",
  },

  // Design Software
  {
    id: "sw-design-001",
    name: "AutoCAD 2024",
    version: "24.1.51.0",
    publisher: "Autodesk Inc.",
    category: "design",
    description: "Phần mềm thiết kế CAD chuyên nghiệp",
    licenseType: "Commercial",
    createdAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "sw-design-002",
    name: "Adobe Photoshop 2024",
    version: "25.3.1",
    publisher: "Adobe Inc.",
    category: "design",
    description: "Phần mềm chỉnh sửa ảnh chuyên nghiệp",
    licenseType: "Commercial",
    createdAt: "2024-01-25T08:00:00Z",
  },
  {
    id: "sw-design-003",
    name: "SketchUp Pro 2023",
    version: "23.1.340",
    publisher: "Trimble Inc.",
    category: "design",
    description: "Phần mềm thiết kế 3D",
    licenseType: "Commercial",
    createdAt: "2024-01-18T08:00:00Z",
  },
  {
    id: "sw-design-004",
    name: "GIMP",
    version: "2.10.36",
    publisher: "GIMP Team",
    category: "design",
    description: "Phần mềm chỉnh sửa ảnh mã nguồn mở",
    licenseType: "Free",
    createdAt: "2023-11-15T08:00:00Z",
  },

  // Browsers
  {
    id: "sw-browser-001",
    name: "Google Chrome",
    version: "120.0.6099.217",
    publisher: "Google LLC",
    category: "browser",
    description: "Trình duyệt web phổ biến",
    licenseType: "Free",
    createdAt: "2024-01-08T08:00:00Z",
  },
  {
    id: "sw-browser-002",
    name: "Mozilla Firefox",
    version: "121.0.1",
    publisher: "Mozilla Foundation",
    category: "browser",
    description: "Trình duyệt web mã nguồn mở",
    licenseType: "Free",
    createdAt: "2024-01-12T08:00:00Z",
  },
  {
    id: "sw-browser-003",
    name: "Microsoft Edge",
    version: "120.0.2210.121",
    publisher: "Microsoft Corporation",
    category: "browser",
    description: "Trình duyệt web mặc định của Windows",
    licenseType: "Free",
    createdAt: "2024-01-10T08:00:00Z",
  },

  // Security Software
  {
    id: "sw-security-001",
    name: "Windows Defender",
    version: "1.381.2164.0",
    publisher: "Microsoft Corporation",
    category: "security",
    description: "Phần mềm diệt virus tích hợp Windows",
    licenseType: "Free",
    createdAt: "2023-10-01T08:00:00Z",
  },
  {
    id: "sw-security-002",
    name: "Kaspersky Internet Security",
    version: "21.3.10.391",
    publisher: "Kaspersky Lab",
    category: "security",
    description: "Bộ phần mềm bảo mật toàn diện",
    licenseType: "Commercial",
    createdAt: "2024-01-05T08:00:00Z",
  },
  {
    id: "sw-security-003",
    name: "Malwarebytes",
    version: "4.6.7.284",
    publisher: "Malwarebytes Corporation",
    category: "security",
    description: "Phần mềm diệt malware",
    licenseType: "Commercial",
    createdAt: "2024-01-08T08:00:00Z",
  },

  // System Software
  {
    id: "sw-system-001",
    name: "CCleaner",
    version: "6.19.10858",
    publisher: "Piriform Ltd",
    category: "system",
    description: "Công cụ dọn dẹp và tối ưu hệ thống",
    licenseType: "Free",
    createdAt: "2024-01-03T08:00:00Z",
  },
  {
    id: "sw-system-002",
    name: "WinRAR",
    version: "6.24",
    publisher: "win.rar GmbH",
    category: "system",
    description: "Phần mềm nén và giải nén file",
    licenseType: "Commercial",
    createdAt: "2023-12-15T08:00:00Z",
  },
  {
    id: "sw-system-003",
    name: "7-Zip",
    version: "23.01",
    publisher: "Igor Pavlov",
    category: "system",
    description: "Phần mềm nén file mã nguồn mở",
    licenseType: "Free",
    createdAt: "2023-11-20T08:00:00Z",
  },

  // Media Software
  {
    id: "sw-media-001",
    name: "VLC Media Player",
    version: "3.0.20",
    publisher: "VideoLAN Organization",
    category: "media",
    description: "Trình phát đa phương tiện đa năng",
    licenseType: "Free",
    createdAt: "2024-01-02T08:00:00Z",
  },
  {
    id: "sw-media-002",
    name: "Adobe Premiere Pro 2024",
    version: "24.1.0",
    publisher: "Adobe Inc.",
    category: "media",
    description: "Phần mềm chỉnh sửa video chuyên nghiệp",
    licenseType: "Commercial",
    createdAt: "2024-01-25T08:00:00Z",
  },

  // Database Software
  {
    id: "sw-db-001",
    name: "MySQL Workbench",
    version: "8.0.35",
    publisher: "Oracle Corporation",
    category: "database",
    description: "Công cụ quản lý cơ sở dữ liệu MySQL",
    licenseType: "Free",
    createdAt: "2024-01-12T08:00:00Z",
  },
  {
    id: "sw-db-002",
    name: "SQL Server Management Studio",
    version: "19.3",
    publisher: "Microsoft Corporation",
    category: "database",
    description: "Công cụ quản lý SQL Server",
    licenseType: "Free",
    createdAt: "2024-01-15T08:00:00Z",
  },
];

// AssetSoftware - Phần mềm đã cài trên từng máy tính
export const mockAssetSoftware = [
  // PC Lab A101 - Máy 01 (asset-comp-001)
  {
    assetId: "asset-comp-001",
    softwareId: "sw-office-001", // Microsoft Office 2021
    installationDate: "2024-01-20",
    licenseKey: "NKJGF-KLHSD-MNBVC-QWERT-YUIOP",
    notes: "Cài đặt đầy đủ các ứng dụng Office",
    status: "active",
  },
  {
    assetId: "asset-comp-001",
    softwareId: "sw-browser-001", // Google Chrome
    installationDate: "2024-01-21",
    notes: "Trình duyệt chính",
    status: "active",
  },
  {
    assetId: "asset-comp-001",
    softwareId: "sw-security-001", // Windows Defender
    installationDate: "2024-01-20",
    notes: "Bảo mật mặc định",
    status: "active",
  },
  {
    assetId: "asset-comp-001",
    softwareId: "sw-prog-001", // Visual Studio Code
    installationDate: "2024-01-22",
    notes: "Cho lập trình web",
    status: "active",
  },
  {
    assetId: "asset-comp-001",
    softwareId: "sw-system-003", // 7-Zip
    installationDate: "2024-01-20",
    notes: "Công cụ nén file",
    status: "active",
  },

  // PC Lab A101 - Máy 02 (asset-comp-002)
  {
    assetId: "asset-comp-002",
    softwareId: "sw-office-002", // Microsoft Office 2019
    installationDate: "2023-12-15",
    licenseKey: "ABCDE-FGHIJ-KLMNO-PQRST-UVWXY",
    notes: "Phiên bản cũ hơn",
    status: "active",
  },
  {
    assetId: "asset-comp-002",
    softwareId: "sw-browser-002", // Mozilla Firefox
    installationDate: "2024-01-10",
    notes: "Trình duyệt phụ",
    status: "active",
  },
  {
    assetId: "asset-comp-002",
    softwareId: "sw-prog-002", // Visual Studio 2022
    installationDate: "2024-01-25",
    licenseKey: "VS2022-PROF-12345-ABCDE",
    notes: "Cho phát triển .NET",
    status: "active",
  },
  {
    assetId: "asset-comp-002",
    softwareId: "sw-design-001", // AutoCAD 2024
    installationDate: "2024-02-01",
    licenseKey: "ACAD2024-12345-67890",
    notes: "Cho môn thiết kế kỹ thuật",
    status: "active",
  },

  // PC Lab A102 - Máy 01 (asset-comp-003)
  {
    assetId: "asset-comp-003",
    softwareId: "sw-office-001", // Microsoft Office 2021
    installationDate: "2024-01-18",
    licenseKey: "OFFICE-2021-XYZ-789",
    notes: "Cài đặt chuẩn",
    status: "active",
  },
  {
    assetId: "asset-comp-003",
    softwareId: "sw-prog-003", // IntelliJ IDEA
    installationDate: "2024-01-30",
    licenseKey: "IDEA-EDU-54321",
    notes: "Bản giáo dục cho Java",
    status: "active",
  },
  {
    assetId: "asset-comp-003",
    softwareId: "sw-db-001", // MySQL Workbench
    installationDate: "2024-02-05",
    notes: "Cho môn cơ sở dữ liệu",
    status: "active",
  },
  {
    assetId: "asset-comp-003",
    softwareId: "sw-media-001", // VLC Media Player
    installationDate: "2024-01-20",
    notes: "Phát media",
    status: "active",
  },

  // PC Lab B201 - Máy 01 (asset-comp-004)
  {
    assetId: "asset-comp-004",
    softwareId: "sw-design-002", // Adobe Photoshop 2024
    installationDate: "2024-02-10",
    licenseKey: "PS2024-CREATIVE-SUITE",
    notes: "Cho ngành thiết kế đồ họa",
    status: "active",
  },
  {
    assetId: "asset-comp-004",
    softwareId: "sw-design-003", // SketchUp Pro 2023
    installationDate: "2024-02-12",
    licenseKey: "SKUP-PRO-2023-ARCH",
    notes: "Thiết kế kiến trúc 3D",
    status: "active",
  },
  {
    assetId: "asset-comp-004",
    softwareId: "sw-office-001", // Microsoft Office 2021
    installationDate: "2024-01-15",
    licenseKey: "OFFICE-B201-001",
    notes: "Bộ office chuẩn",
    status: "active",
  },
  {
    assetId: "asset-comp-004",
    softwareId: "sw-browser-001", // Google Chrome
    installationDate: "2024-01-16",
    notes: "Trình duyệt chính",
    status: "active",
  },

  // Thêm một số máy khác với phần mềm bị lỗi hoặc cần cập nhật
  {
    assetId: "asset-comp-005",
    softwareId: "sw-office-002", // Microsoft Office 2019
    installationDate: "2023-09-01",
    licenseKey: "OLD-OFFICE-LICENSE",
    notes: "Cần cập nhật lên phiên bản mới",
    status: "outdated",
  },
  {
    assetId: "asset-comp-005",
    softwareId: "sw-security-002", // Kaspersky
    installationDate: "2024-01-01",
    licenseKey: "KASPER-EXPIRED-2024",
    notes: "License đã hết hạn",
    status: "expired",
  },
  {
    assetId: "asset-comp-006",
    softwareId: "sw-prog-005", // Dev-C++
    installationDate: "2023-11-15",
    notes: "Có lỗi compile",
    status: "faulty",
  },
];

// Software error types - specific for software issues
export const softwareErrorTypes = [
  {
    id: "sw-err-001",
    name: "Phần mềm không khởi động được",
    category: "startup",
    severity: "high",
  },
  {
    id: "sw-err-002",
    name: "Phần mềm bị crash/đóng đột ngột",
    category: "runtime",
    severity: "high",
  },
  {
    id: "sw-err-003",
    name: "Lỗi bản quyền phần mềm",
    category: "license",
    severity: "medium",
  },
  {
    id: "sw-err-004",
    name: "Phần mềm chạy chậm/lag",
    category: "performance",
    severity: "medium",
  },
  {
    id: "sw-err-005",
    name: "Không thể cài đặt phần mềm",
    category: "installation",
    severity: "high",
  },
  {
    id: "sw-err-006",
    name: "Lỗi cập nhật phần mềm",
    category: "update",
    severity: "medium",
  },
  {
    id: "sw-err-007",
    name: "Xung đột giữa các phần mềm",
    category: "conflict",
    severity: "medium",
  },
  {
    id: "sw-err-008",
    name: "Lỗi driver thiết bị",
    category: "driver",
    severity: "high",
  },
  {
    id: "sw-err-009",
    name: "Lỗi hệ điều hành Windows",
    category: "system",
    severity: "high",
  },
  {
    id: "sw-err-010",
    name: "Virus/Malware",
    category: "security",
    severity: "critical",
  },
  {
    id: "sw-err-011",
    name: "Lỗi mạng/kết nối internet",
    category: "network",
    severity: "medium",
  },
  {
    id: "sw-err-012",
    name: "Lỗi tương thích với hệ điều hành",
    category: "compatibility",
    severity: "medium",
  },
  {
    id: "sw-err-013",
    name: "Lỗi file hệ thống bị thiếu/hỏng",
    category: "system",
    severity: "high",
  },
  {
    id: "sw-err-014",
    name: "Lỗi khác (mô tả chi tiết)",
    category: "other",
    severity: "unknown",
  },
];
