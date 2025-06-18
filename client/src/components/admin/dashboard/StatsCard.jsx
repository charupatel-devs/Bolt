import { TrendingDown, TrendingUp } from "lucide-react";

const StatsCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "blue",
  description,
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      accent: "bg-blue-600",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      accent: "bg-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      accent: "bg-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      accent: "bg-orange-600",
    },
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      accent: "bg-indigo-600",
    },
    pink: {
      bg: "bg-pink-50",
      icon: "text-pink-600",
      accent: "bg-pink-600",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${currentColor.bg}`}>
              <Icon className={`w-6 h-6 ${currentColor.icon}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>

          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>

        {/* Trend Indicator */}
        {change !== undefined && (
          <div className="text-right">
            <div
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend === "up"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}

              <span>{Math.abs(change)}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
