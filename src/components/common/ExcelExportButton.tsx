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
  label,
  disabled = false,
  className = "",
  size = "md",
  variant = "default",
}: ExcelExportButtonProps) {
  // Determine the text to display
  const getButtonText = () => {
    if (label) return label;

    if (selectedCount > 0) {
      return `Xuất Excel (${selectedCount} mục)`;
    }
    return `Xuất Excel (${totalCount} mục)`;
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant classes
  const variantClasses = {
    default:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
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
      disabled={disabled}
      className={`
        inline-flex items-center rounded-md shadow-sm font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `.trim()}>
      <Download className={`${iconSizes[size]} mr-2`} />
      <span>{getButtonText()}</span>
    </button>
  );
}
