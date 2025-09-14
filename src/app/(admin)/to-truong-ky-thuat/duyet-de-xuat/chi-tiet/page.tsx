"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChiTietRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the proper detail page structure
    router.replace("/to-truong-ky-thuat/duyet-de-xuat");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
