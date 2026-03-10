import { useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import { ArrowLeft, FileText } from "lucide-react";

interface CreateListHeaderProps {
  isSubmitting: boolean;
}

export default function CreateListHeader({
  isSubmitting,
}: CreateListHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        className="mt-0 mb-6"
        items={[
          {
            title: (
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => router.push("/to-truong-ky-thuat")}>
                Tổ trưởng kỹ thuật
              </span>
            ),
          },
          {
            title: (
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() =>
                  router.push("/to-truong-ky-thuat/duyet-de-xuat")
                }>
                Duyệt đề xuất
              </span>
            ),
          },
          {
            title: "Tạo danh sách đề xuất",
          },
        ]}
      />

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Tạo danh sách đề xuất thay thế
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Tạo danh sách tổng hợp các đề xuất thay thế đã được phê duyệt
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
