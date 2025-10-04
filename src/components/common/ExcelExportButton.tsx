"use client";

import { Download } from "lucide-react";

interface ExcelExportButtonProps {
  /** Total number of items available for export */
  totalCount: number;
  /** Number of selected items (0 if none selected) */
  selectedCount?: number;
  /** Function to call when export button is clicked */
  onExport: () => void;
  /** Custom label for the button (optional) */
  label?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button size variant */
  size?: "sm" | "md" | "lg";
  /** Button style variant */
  variant?: "default" | "primary" | "outline";
}

export default function ExcelExportButton({
  totalCount,
  selectedCount = 0,
  onExport,
  disabled = false,
  className = "",
  size = "md",
  variant = "default",
}: ExcelExportButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant classes - Dynamic styling based on selection state
  const variantClasses = {
    default:
      selectedCount > 0
        ? "bg-green-600 text-white hover:bg-green-700"
        : "bg-gray-300 text-gray-500 cursor-not-allowed",
    primary:
      "border border-blue-600 text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:ring-blue-500",
  };

  // Icon size based on button size
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      onClick={onExport}
      disabled={disabled || selectedCount === 0}
      className={`
        flex items-center rounded-md font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        disabled:opacity-75 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `.trim()}>
      <Download className={`${iconSizes[size]} mr-2`} />
      <span>
        Xuất Excel
        {selectedCount > 0
          ? ` (${selectedCount})`
          : totalCount > 0
          ? ` (${totalCount})`
          : ""}
      </span>
    </button>
  );
}
