import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    name: "Electronic Components",
    subcategories: ["Resistors", "Capacitors", "ICs", "Transistors"],
  },
  {
    name: "Sensors & Detectors",
    subcategories: ["Temperature Sensors", "Proximity Sensors", "Pressure Sensors"],
  },
  {
    name: "Power Management",
    subcategories: ["Voltage Regulators", "Power Supplies", "Battery Management"],
  },
  {
    name: "Connectors & Cables",
    subcategories: ["USB", "Audio", "Power", "Ribbon"],
  },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSubmenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Products</h2>

      <ul className="space-y-2">
        {categories.map((cat, index) => {
          const isActive = activeIndex === index;

          return (
            <li key={index} className="border-b pb-2">
              <button
                onClick={() => toggleSubmenu(index)}
                className={`flex items-center w-full font-medium gap-2 transition-all group ${
                  isActive ? "text-red-600" : "text-gray-700 hover:text-red-500"
                }`}
              >
                {/* Red vertical line */}
                <span
                  className={`w-1 h-5 mr-2 rounded-full ${
                    isActive ? "bg-red-600" : "bg-transparent"
                  }`}
                ></span>

                <span className="flex-1 text-base text-left">{cat.name}</span>
                {isActive ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Subcategories */}
              {isActive && (
                <ul className="mt-2 ml-6 space-y-1 text-sm text-gray-600">
                  {cat.subcategories.map((sub, i) => (
                    <li
                      key={i}
                      className="hover:text-red-600 cursor-pointer transition-colors"
                    >
                      • {sub}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
