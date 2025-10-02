"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

interface SortableHeaderProps<T = Record<string, unknown>> {
  field: keyof T;
  children: React.ReactNode;
  sortField: keyof T | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (field: keyof T) => void;
  className?: string;
}

export default function SortableHeader<T = Record<string, unknown>>({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
  className = "",
}: SortableHeaderProps<T>) {
  return (
    <th
      className={`px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        onSort(field);
      }}>
      <div className="flex items-center space-x-1">
        <span className="whitespace-nowrap">{children}</span>
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
