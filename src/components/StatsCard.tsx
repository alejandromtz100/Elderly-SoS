import React from "react";

interface StatsCardProps {
  icon: string;
  title: string;
  value: number | string;
  description: string;
  color: "blue" | "green" | "purple" | "orange" | "red";
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon, 
  title, 
  value, 
  description, 
  color 
}) => {
  const colorClasses = {
    blue: {
      bgFrom: "from-blue-50",
      bgTo: "to-blue-100",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600"
    },
    green: {
      bgFrom: "from-green-50",
      bgTo: "to-green-100",
      border: "border-green-100",
      iconBg: "bg-green-100",
      iconText: "text-green-600"
    },
    purple: {
      bgFrom: "from-purple-50",
      bgTo: "to-purple-100",
      border: "border-purple-100",
      iconBg: "bg-purple-100",
      iconText: "text-purple-600"
    },
    orange: {
      bgFrom: "from-orange-50",
      bgTo: "to-orange-100",
      border: "border-orange-100",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600"
    },
    red: {
      bgFrom: "from-red-50",
      bgTo: "to-red-100",
      border: "border-red-100",
      iconBg: "bg-red-100",
      iconText: "text-red-600"
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className={`bg-gradient-to-r ${currentColor.bgFrom} ${currentColor.bgTo} p-6 rounded-xl border ${currentColor.border} shadow-sm`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${currentColor.iconBg} ${currentColor.iconText} mr-4`}>
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;