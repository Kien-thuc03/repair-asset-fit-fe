import { SubmissionFormData } from "@/types";
import {
  AlignmentType,
  BorderStyle,
  Document,
  PageOrientation,
  Paragraph,
  Packer,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

// Helper: inch to twip
const inchToTwip = (inches: number): number => Math.round(inches * 1440);

export const generateSubmissionDocx = async (
  formData: SubmissionFormData
): Promise<Document> => {
  const now = new Date();
  const dateStr = `Tp. Hồ Chí Minh, ngày ${now.getDate()} tháng ${
    now.getMonth() + 1
  } năm ${now.getFullYear()}`;

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "BỘ CÔNG THƯƠNG",
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP",
                    bold: true,
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "THÀNH PHỐ HỒ CHÍ MINH",
                    bold: true,
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
              }),
            ],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                    bold: true,
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Độc lập – Tự do – Hạnh phúc",
                    bold: true,
                    underline: {},
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
              }),
            ],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formData.department.toUpperCase(),
                    bold: true,
                    underline: {},
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
              }),
            ],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: dateStr,
                    italics: true,
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 80 },
              }),
            ],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: inchToTwip(0.59),
              bottom: inchToTwip(0.2),
              left: inchToTwip(0.79),
              right: inchToTwip(0.79),
            },
            size: { orientation: PageOrientation.PORTRAIT },
          },
        },
        children: [
          headerTable,
          new Paragraph({
            children: [new TextRun({ text: "", size: 1 })],
            spacing: { after: 40, before: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PHIẾU ĐỀ NGHỊ GIẢI QUYẾT CÔNG VIỆC",
                bold: true,
                font: "Times New Roman",
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120, before: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Kính gửi: Ban Giám hiệu",
                font: "Times New Roman",
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60, before: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Phòng Quản trị",
                font: "Times New Roman",
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 180, before: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Đơn vị đề nghị: ",
                font: "Times New Roman",
                size: 24,
              }),
              new TextRun({
                text: formData.department,
                font: "Times New Roman",
                size: 24,
              }),
            ],
            spacing: { after: 120, before: 0 },
            indent: { left: 720, firstLine: 720 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Các văn bản kèm theo: (",
                font: "Times New Roman",
                size: 24,
              }),
              new TextRun({
                text: formData.attachments || "",
                font: "Times New Roman",
                size: 24,
              }),
              new TextRun({
                text: ")",
                font: "Times New Roman",
                size: 24,
              }),
            ],
            spacing: { after: 180, before: 0 },
            indent: { left: 720, firstLine: 720 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 2,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "1. Tóm tắt nội dung và đề nghị",
                            bold: true,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        spacing: { after: 60, before: 0 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "    Khoa CNTT đang cần thay thế thiết bị. Một số linh kiện máy tính đã hư hỏng và cần được thay thế để đảm bảo hoạt động ổn định của hệ thống.",
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 10, before: 0, line: 240 },
                        indent: { left: 120, firstLine: 120, right: 120 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "    Thông tin chi tiết về đề xuất thay thế:",
                            font: "Times New Roman",
                            size: 26,
                          }),
                          new TextRun({
                            text: "  - Kingston Fury Beast DDR4 (8GB 3200MHz): Máy khởi động không lên (Số lượng: 1)  - Samsung 980 NVMe SSD (256GB, M.2 PCIe 3.0): Máy khởi động không lên (Số lượng: 1)  - Cooler Master MWE 450W (450W, 80+ Bronze): Không dùng được thiết bị (Số lượng: 1)  - Cooler Master MasterBox Q300L (Micro-ATX): Không dùng được thiết bị (Số lượng: 1)  - Intel UHD Graphics 730 (Integrated Graphics): Không dùng được thiết bị (Số lượng: 1)",
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 10, before: 0, line: 240 },
                        indent: { left: 120, firstLine: 120, right: 120 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "    Khoa CNTT kính trình Ban Giám hiệu phê duyệt chi ngân sách cho Phòng Quản trị tiến hành thay thế các linh kiện để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.",
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 10, before: 0, line: 240 },
                        indent: { left: 120, firstLine: 120, right: 120 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "    Thông tin tổng hợp:",
                            font: "Times New Roman",
                            size: 26,
                          }),
                          new TextRun({
                            text: " - Mã đề xuất: DXTT-2025-0001 - Tiêu đề: Đề xuất thay thế 5 linh kiện - Người đề xuất: Nguyễn Văn Đạt - Tổng số linh kiện cần thay: 5 - Mô tả: cần được mua mới các linh kiện như trong danh sách",
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 10, before: 0, line: 240 },
                        indent: { left: 120, firstLine: 120, right: 120 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "    Khoa rất mong Ban Giám hiệu xem xét và đồng ý cho thực hiện.",
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 10, before: 0, line: 240 },
                        indent: { left: 120, firstLine: 120, right: 120 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "    Trân trọng kính trình.",
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 10, before: 0, line: 240 },
                        indent: { left: 120, firstLine: 120, right: 120 },
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 2,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "2. Họ tên và chữ ký",
                            bold: true,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        spacing: { after: 40, before: 0 },
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Người đề nghị",
                            bold: true,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 10, before: 0 },
                      }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: formData.submittedBy,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 40, before: 0 },
                      }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Trưởng đơn vị",
                            bold: true,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 10, before: 0 },
                      }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({ children: [new TextRun({ text: "" })] }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: formData.director,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 40, before: 0 },
                      }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "3. Ý kiến của Phó Hiệu trưởng:",
                            bold: true,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 20, before: 0 },
                      }),
                      new Paragraph({
                        children: [],
                        spacing: { after: 180, before: 80 },
                      }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "4. Phê duyệt của Hiệu trưởng",
                            bold: true,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 20, before: 0 },
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: "" })],
                        spacing: { after: 20, before: 0 },
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: "" })],
                        spacing: { after: 20, before: 0 },
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: "" })],
                        spacing: { after: 20, before: 0 },
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: "" })],
                        spacing: { after: 20, before: 0 },
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: formData.rector,
                            font: "Times New Roman",
                            size: 26,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120, before: 0 },
                      }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Ghi chú:",
                bold: true,
                font: "Times New Roman",
                size: 24,
              }),
            ],
            spacing: { after: 120, before: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "- Văn bản gửi trực tiếp đến: ................................. ngày ...... tháng ...... năm 2025",
                font: "Times New Roman",
                size: 24,
              }),
            ],
            spacing: { after: 60, before: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "- Văn bản gửi qua văn thư: ................................. ngày ...... tháng ...... năm 2025",
                font: "Times New Roman",
                size: 24,
              }),
            ],
            spacing: { after: 0, before: 0 },
          }),
        ],
      },
    ],
  });

  return doc;
};

export const exportSubmissionDocx = async (
  formData: SubmissionFormData,
  proposalCode: string
): Promise<void> => {
  const doc = await generateSubmissionDocx(formData);
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `To_trinh_${proposalCode}_${new Date()
    .toISOString()
    .split("T")[0]}.docx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const generateSubmissionDocBlob = async (
  formData: SubmissionFormData
): Promise<Blob> => {
  const doc = await generateSubmissionDocx(formData);
  return Packer.toBlob(doc);
};

