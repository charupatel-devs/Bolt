import {
  Banknote,
  BarChart,
  Building2,
  ChevronDown,
  ChevronRight,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/admin/dashboard",
      badge: null,
    },
    {
      key: "products",
      label: "Products",
      icon: Package,
      submenu: [
        { label: "Products Management", path: "/admin/products" },
        { label: "All Products", path: "/admin/products/list" },
        { label: "Add Product", path: "/admin/products/add" },
        { label: "Categories", path: "/admin/products/categories" },
        {
          label: "Low Stock Alert",
          path: "/admin/products/low-stock",
          badge: "12",
        },
      ],
    },
    {
      key: "orders",
      label: "Orders",
      icon: ShoppingCart,
      submenu: [
        { label: "All Orders", path: "/admin/orders" },
        { label: "Pending Orders", path: "/admin/orders/pending", badge: "8" },
        { label: "Processing", path: "/admin/orders/processing", badge: "5" },
        { label: "Shipped", path: "/admin/orders/shipped" },
        { label: "Delivered", path: "/admin/orders/delivered" },
        { label: "Returns", path: "/admin/orders/returns", badge: "3" },
      ],
    },
    {
      key: "customers",
      label: "Customers",
      icon: Users,
      submenu: [
        { label: "All Customers", path: "/admin/customers" },
        { label: "Customer Groups", path: "/admin/customers/groups" },
        { label: "Customer Reviews", path: "/admin/customers/reviews" },
      ],
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: Building2,
      submenu: [
        { label: "Stock Management", path: "/admin/inventory" },
        { label: "Stock Adjustments", path: "/admin/inventory/adjustments" },
        { label: "Suppliers", path: "/admin/inventory/suppliers" },
        { label: "Purchase Orders", path: "/admin/inventory/purchase-orders" },
      ],
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: BarChart,
      submenu: [
        { label: "Sales Reports", path: "/admin/analytics/sales" },
        { label: "Product Performance", path: "/admin/analytics/products" },
        { label: "Customer Analytics", path: "/admin/analytics/customers" },
        // { label: "Traffic Reports", path: "/admin/analytics/traffic" },
      ],
    },
    // {
    //   key: "marketing",
    //   label: "Marketing",
    //   icon: Tag,
    //   submenu: [
    //     { label: "Promotions", path: "/admin/marketing/promotions" },
    //     { label: "Coupons", path: "/admin/marketing/coupons" },
    //     { label: "Email Campaigns", path: "/admin/marketing/emails" },
    //     { label: "Banner Management", path: "/admin/marketing/banners" },
    //   ],
    // },
    {
      key: "shipping",
      label: "Shipping",
      icon: Truck,
      submenu: [
        { label: "Shipping Methods", path: "/admin/shipping/methods" },
        { label: "Shipping Zones", path: "/admin/shipping/zones" },
        { label: "Track Shipments", path: "/admin/shipping/tracking" },
      ],
    },
    {
      key: "finance",
      label: "Finance",
      icon: Banknote,
      submenu: [
        // { label: "Revenue Reports", path: "/admin/finance/revenue" },
        // { label: "Tax Management", path: "/admin/finance/tax" },
        { label: "Payment Methods", path: "/admin/finance/payments" },
        { label: "Refunds", path: "/admin/finance/refunds" },
      ],
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      submenu: [
        { label: "General Settings", path: "/admin/settings" },
        // { label: "Store Configuration", path: "/admin/settings/store" },
        // { label: "Payment Settings", path: "/admin/settings/payments" },
        // { label: "Email Settings", path: "/admin/settings/email" },
        // { label: "SEO Settings", path: "/admin/settings/seo" },
      ],
    },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  const isActiveParent = (submenu) =>
    submenu?.some((item) => location.pathname === item.path);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-blue-600">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Package size={20} className="text-blue-600" />
            </div>
            <span className="text-white font-bold text-lg">ElectroAdmin</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Package size={20} className="text-blue-600" />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 pb-4 overflow-y-auto h-full">
        <div className="px-2">
          {menuItems.map((item) => (
            <div key={item.key} className="mb-1">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActiveParent(item.submenu)
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className="mr-3 text-gray-600" />
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen &&
                      (expandedMenus[item.key] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      ))}
                  </button>

                  {isOpen && expandedMenus[item.key] && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.submenu.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.path}
                          className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            isActiveRoute(subItem.path)
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span>{subItem.label}</span>
                          {subItem.badge && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon size={20} className="mr-3 text-gray-600" />
                    {isOpen && <span>{item.label}</span>}
                  </div>
                  {isOpen && item.badge && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
