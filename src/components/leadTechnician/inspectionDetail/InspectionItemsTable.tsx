import { Settings } from "lucide-react";

interface InspectionItem {
  id: string;
  ktCode: string;
  assetName: string;
  location: string;
  condition: string;
  proposedSolution: string;
}

interface InspectionItemsTableProps {
  items: InspectionItem[];
  notes?: string;
}

export default function InspectionItemsTable({
  items,
  notes,
}: InspectionItemsTableProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Danh sách thiết bị kiểm tra
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã tài sản
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên thiết bị
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tình trạng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giải pháp đề xuất
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {item.ktCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.assetName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.location}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="">
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.proposedSolution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {notes && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <div className="mt-1 bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
