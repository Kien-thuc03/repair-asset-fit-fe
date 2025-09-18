"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { RepairRequest } from "@/types";

interface SortableHeaderProps {
  field: keyof RepairRequest;
  children: React.ReactNode;
  sortField: keyof RepairRequest | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (field: keyof RepairRequest) => void;
  className?: string;
}

export default function SortableHeader({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
  className = "",
}: SortableHeaderProps) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        onSort(field);
      }}>
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUp
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "asc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "desc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </th>
  );
}
