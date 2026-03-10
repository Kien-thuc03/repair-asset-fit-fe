export function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  );
}

export function NotFoundState({ onGoBack }: { onGoBack: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="h-16 w-16 text-red-500 mx-auto mb-4">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Không tìm thấy báo lỗi
        </h2>
        <p className="text-gray-600 mb-4">
          Báo lỗi bạn tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={onGoBack}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          Quay lại
        </button>
      </div>
    </div>
  );
}
