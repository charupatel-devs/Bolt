// src/pages/admin/GeneralSettings.jsx
import {
  Clock,
  Database,
  Globe,
  Mail,
  Palette,
  Save,
  Settings,
  Shield,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Site Information
    siteName: "TechStore Admin",
    siteDescription: "Premium Electronics & Components Store",
    siteUrl: "https://techstore.com",
    adminEmail: "admin@techstore.com",

    // General Settings
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    currencySymbol: "$",

    // Email Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerRegistration: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    loginAttempts: 5,

    // System Settings
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: "daily",

    // Display Settings
    itemsPerPage: 20,
    dashboardRefresh: 30,
    theme: "light",
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", settings);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-blue-600" />
              General Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Configure system-wide settings and preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Site Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleInputChange("siteDescription", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    handleInputChange("adminEmail", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              General Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    handleInputChange("timezone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    handleInputChange("dateFormat", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Email Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive general email notifications
                  </p>
                </div>
                <button onClick={() => handleToggle("emailNotifications")}>
                  {settings.emailNotifications ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Get notified about new orders
                  </p>
                </div>
                <button onClick={() => handleToggle("orderNotifications")}>
                  {settings.orderNotifications ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Low Stock Alerts
                  </p>
                  <p className="text-sm text-gray-600">
                    Alert when inventory is low
                  </p>
                </div>
                <button onClick={() => handleToggle("lowStockAlerts")}>
                  {settings.lowStockAlerts ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Customer Registration
                  </p>
                  <p className="text-sm text-gray-600">
                    Notify about new registrations
                  </p>
                </div>
                <button onClick={() => handleToggle("customerRegistration")}>
                  {settings.customerRegistration ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-600">
                    Add extra security to your account
                  </p>
                </div>
                <button onClick={() => handleToggle("twoFactorAuth")}>
                  {settings.twoFactorAuth ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleInputChange(
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) =>
                    handleInputChange(
                      "passwordExpiry",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.loginAttempts}
                  onChange={(e) =>
                    handleInputChange("loginAttempts", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              System Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Maintenance Mode
                  </p>
                  <p className="text-sm text-gray-600">
                    Put site in maintenance mode
                  </p>
                </div>
                <button onClick={() => handleToggle("maintenanceMode")}>
                  {settings.maintenanceMode ? (
                    <ToggleRight className="w-6 h-6 text-red-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Debug Mode
                  </p>
                  <p className="text-sm text-gray-600">
                    Enable debug information
                  </p>
                </div>
                <button onClick={() => handleToggle("debugMode")}>
                  {settings.debugMode ? (
                    <ToggleRight className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Auto Backup
                  </p>
                  <p className="text-sm text-gray-600">
                    Automatically backup data
                  </p>
                </div>
                <button onClick={() => handleToggle("autoBackup")}>
                  {settings.autoBackup ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) =>
                    handleInputChange("backupFrequency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-blue-600" />
              Display Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Items Per Page
                </label>
                <select
                  value={settings.itemsPerPage}
                  onChange={(e) =>
                    handleInputChange("itemsPerPage", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dashboard Refresh (seconds)
                </label>
                <input
                  type="number"
                  value={settings.dashboardRefresh}
                  onChange={(e) =>
                    handleInputChange(
                      "dashboardRefresh",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save All Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
