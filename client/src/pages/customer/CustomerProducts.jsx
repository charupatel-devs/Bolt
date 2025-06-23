// src/pages/customer/CustomerProducts.jsx
import { useState } from "react";
import "../../assets/css/customer/CustomerProducts.css";

import {
  Grid3X3,
  List,
  Search,
  ShoppingCart,
  Eye,
} from "lucide-react";

const CustomerProducts = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      id: 1,
      name: "Electronics Components",
      
      subcategories: [
        { id: 11, name: "Resistors" },
        { id: 12, name: "Capacitors" },
        { id: 13, name: "Integrated Circuits" },
      ],
    },
    {
      id: 2,
      name: "Sensors & Detectors",
      icon: "🔍",
      subcategories: [
        { id: 21, name: "Temperature Sensors" },
        { id: 22, name: "Proximity Sensors" },
      ],
    },
  ];

  const products = [
    {
      id: 1,
      name: "Arduino Uno R3",
      price: 25.99,
      image: "/images/products/arduino.jpg",
      stock: 45,
    },
    {
      id: 2,
      name: "Raspberry Pi 4",
      price: 89.99,
      image: "/images/products/rpi.jpg",
      stock: 0,
    },
    {
      id: 3,
      name: "ESP32 Dev Board",
      price: 15.99,
      image: "/images/products/esp32.jpg",
      stock: 18,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shop Products</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 border rounded-lg bg-white hover:shadow-md cursor-pointer transition"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{cat.icon}</span>
                <h3 className="font-medium">{cat.name}</h3>
              </div>
              <ul className="text-sm text-gray-500 space-y-1">
                {cat.subcategories.map((sub) => (
                  <li key={sub.id}>• {sub.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid/List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Products</h2>
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""
          }`}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 bg-white hover:shadow-md transition ${
                viewMode === "list" ? "flex items-center space-x-6" : ""
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className={`${
                  viewMode === "grid"
                    ? "w-full h-48 object-cover mb-4"
                    : "w-32 h-32 object-cover"
                } rounded`}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1">${product.price}</p>
                {product.stock === 0 ? (
                  <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                ) : (
                  <p className="text-sm text-green-600 mt-1">In Stock</p>
                )}
                <div className="flex items-center gap-3 mt-4">
                  <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;
