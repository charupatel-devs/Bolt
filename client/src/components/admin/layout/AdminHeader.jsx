// src/components/admin/layout/AdminHeader.jsx
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  UserCircle,
} from "lucide-react";

import { useState } from "react";

const AdminHeader = ({ onMenuClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New order received",
      message: "Order #12345 from John Doe",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Low stock alert",
      message: "iPhone 15 Pro - Only 5 left",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "Customer review",
      message: "New 5-star review on Samsung Galaxy",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: 4,
      title: "Payment received",
      message: "Payment of $1,299 received",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$24.8K</div>
              <div className="text-gray-500">Today's Sales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-gray-500">New Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.4K</div>
              <div className="text-gray-500">Visitors</div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      Mark all read
                    </span>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=ffffff"
                alt="Admin"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <div className="text-sm font-medium">Admin User</div>
                  <div className="text-xs text-gray-500">
                    admin@electronics.com
                  </div>
                </div>
                <div className="py-1">
                  <a
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircle className="w-4 h-4 mr-3" />
                    General Settings
                  </a>

                  <hr className="my-1" />
                  <a
                    href=""
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showProfileDropdown || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileDropdown(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default AdminHeader;
