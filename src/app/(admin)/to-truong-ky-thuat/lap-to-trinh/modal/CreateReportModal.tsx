"use client";
import { useState, useRef } from "react";
import { XCircle, FileText, Printer, Save } from "lucide-react";
import { ReplacementList } from "@/lib/mockData/replacementLists";

interface CreateReportModalProps {
  show: boolean;
  onClose: () => void;
  selectedList: ReplacementList | null;
}

export default function CreateReportModal({
  show,
  onClose,
  selectedList,
}: CreateReportModalProps) {
  const [reportData, setReportData] = useState({
    submittedBy: "Giảng Thanh Trọn",
    position: "Tổ trưởng kỹ thuật",
    department: "Khoa Công Nghệ Thông Tin",
    recipientDepartment: "Phòng Quản trị",
    subject: "Khoa Công nghệ Thông tin",
    attachments: "()",
    content: "",
    director: "TS. Lê Nhất Duy",
    rector: "TS. Phan Hồng Hải",
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setReportData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateContent = () => {
    if (!selectedList) return "";

    const totalCost = selectedList.totalCost.toLocaleString("vi-VN");
    const equipmentList = selectedList.requests
      .map(
        (req) =>
          `- ${req.assetCode}: ${
            req.assetName
          } (${req.estimatedCost.toLocaleString("vi-VN")} VNĐ) - Lý do: ${
            req.reason
          }`
      )
      .join("\n");

    return `Phòng Lab H8.1, H8.2, H8.3 của Khoa CNTT đang cháy. Hệ điều hành Windows 10 và một số phần mềm chuyên ngành Khoa học máy tính. Xu lý án, Học cứu liệu nghệ. Thế đã gần một trăm máy tính đặp nhất các phiên bản mới nhất của phần mềm chuyên ngành phụ hợp với giáo trình và học Hệ điều hành mới. CPU đã gần với phiên bản mới nhất. Nâng cao phần mềm mới Intel H310, không thể sử dụng được nâng cấp để hữu. O đĩa cũng SSD vả Hổ nhỏ RAM máy tính vẫn là hệ thống còn. Hỗng chỗ SSD cũ 500GB M2, và thông số Ram: DDR4 3200 16G.

Khoa CNTT kinh tình Ban Giám hiệu phé duyệt chi trương cho Phòng Quan trị kiến trù nâng cấp 3 đĩa cũng để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.

Danh sách thiết bị cần thay thế:
${equipmentList}

Tổng chi phí ước tính: ${totalCost} VNĐ

Khoa rất mong Ban Giám hiệu xem xét và đồng ý cho thực hiện.

Trân trọng kính trình.`;
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Tờ trình ${selectedList?.id}</title>
              <style>
                body { font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.5; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .title { font-weight: bold; margin: 10px 0; }
                .content { text-align: justify; margin: 20px 0; }
                .signature { margin-top: 50px; }
                .signature-section { float: right; text-align: center; width: 200px; margin-left: 20px; }
                .signature-left { float: left; text-align: center; width: 200px; margin-right: 20px; }
                .clearfix { clear: both; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSave = () => {
    console.log("Saving report:", {
      listId: selectedList?.id,
      reportData,
      createdAt: new Date().toISOString(),
    });
    alert("Đã lưu tờ trình thành công!");
  };

  const handleSubmit = () => {
    console.log("Submitting report:", {
      listId: selectedList?.id,
      reportData,
      submittedAt: new Date().toISOString(),
    });
    alert("Đã nộp tờ trình thành công!");
    onClose();
  };

  if (!show || !selectedList) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-4 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 no-print">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">
                Lập tờ trình - {selectedList.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Printer className="h-4 w-4 mr-2" />
                In
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form and Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4 no-print">
              <h4 className="font-semibold text-gray-900 mb-4">
                Thông tin tờ trình
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người đề nghị
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={reportData.submittedBy}
                    onChange={(e) =>
                      handleInputChange("submittedBy", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={reportData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị đề nghị
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={reportData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị tiếp nhận
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={reportData.recipientDepartment}
                    onChange={(e) =>
                      handleInputChange("recipientDepartment", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị đề nghị (vấn đề)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung tờ trình
                </label>
                <textarea
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={reportData.content || generateContent()}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Nội dung tờ trình sẽ được tự động tạo dựa trên danh sách thiết bị"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giám đốc
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={reportData.director}
                    onChange={(e) =>
                      handleInputChange("director", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hiệu trương
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={reportData.rector}
                    onChange={(e) =>
                      handleInputChange("rector", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <div ref={printRef} className="font-serif">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mb-2">
                    <div className="text-sm">
                      <div>BỘ CÔNG THƯƠNG</div>
                      <div>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP</div>
                      <div>THÀNH PHỐ HỒ CHÍ MINH</div>
                    </div>
                  </div>
                  <div className="text-right text-sm mb-4">
                    <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div>Độc lập – Tự do – Hạnh phúc</div>
                    <div className="mt-2">
                      <em>
                        Tp. Hồ Chí Minh, ngày {new Date().getDate()} tháng{" "}
                        {new Date().getMonth() + 1} năm{" "}
                        {new Date().getFullYear()}
                      </em>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                  <div className="font-bold text-lg mb-2">
                    PHIẾU ĐỀ NGHỊ GIẢI QUYẾT CÔNG VIỆC
                  </div>
                  <div className="text-sm">
                    <div>Kính gửi: Ban Giám hiệu</div>
                    <div>{reportData.recipientDepartment}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-8">
                  <div className="mb-4">
                    <strong>• Đơn vị đề nghị:</strong> {reportData.subject}
                  </div>
                  <div className="mb-4">
                    <strong>• Các văn bản kèm theo:</strong>{" "}
                    {reportData.attachments}
                  </div>

                  <div className="mb-4">
                    <strong>1. Tóm tắt nội dung và đề nghị:</strong>
                  </div>

                  <div className="mb-6 text-justify leading-relaxed">
                    {reportData.content || generateContent()}
                  </div>

                  <div className="mb-6">
                    <div className="bg-gray-50 p-4 rounded border">
                      <h5 className="font-semibold mb-2">Chi tiết thiết bị:</h5>
                      <div className="space-y-2 text-sm">
                        {selectedList.requests.map((req) => (
                          <div key={req.id} className="flex justify-between">
                            <span>
                              {req.assetCode}: {req.assetName}
                            </span>
                            <span className="font-medium">
                              {req.estimatedCost.toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-2 font-semibold flex justify-between">
                          <span>Tổng chi phí:</span>
                          <span className="text-green-600">
                            {selectedList.totalCost.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-12">
                    <div className="text-center">
                      <div className="font-semibold">2. Họ tên và chữ ký:</div>
                      <div className="mt-2">Người đề nghị</div>
                      <div className="mt-16 font-semibold">
                        {reportData.submittedBy}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Trưởng đơn vị</div>
                      <div className="mt-16 font-semibold">
                        {reportData.director}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-12">
                    <div className="text-center">
                      <div className="font-semibold">
                        3. Ý kiến của Phó Hiệu trưởng:
                      </div>
                      <div className="mt-16"></div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        4. Phê duyệt của Hiệu trưởng
                      </div>
                      <div className="mt-16 font-semibold">
                        {reportData.rector}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-12">
                    <div>
                      <em>Ghi chú:</em>
                    </div>
                    <div>
                      -{" "}
                      <em>
                        Văn bản gửi trực tiếp đến ......................ngày
                        .....tháng.....năm 2025
                      </em>
                    </div>
                    <div>
                      -{" "}
                      <em>
                        Văn bản gửi qua văn thư .......................ngày
                        .....tháng.....năm 2025
                      </em>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t no-print">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100">
              <Save className="h-4 w-4 mr-2" />
              Lưu nháp
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Nộp tờ trình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
