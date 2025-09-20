import React from "react";
import { LucideIcon } from "lucide-react";

interface StatItem {
  name: string;
  value: string;
  changeType: "positive" | "negative" | "warning" | "neutral";
  icon: LucideIcon;
  color: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
          <div>
            <div className={`absolute rounded-md ${item.color} p-3`}>
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {item.name}
            </p>
          </div>
          <div className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
