// // src/pages/admin/Suppliers.jsx
// import React, { useState } from 'react';
// import {
//   Building,
//   Search,
//   Plus,
//   Phone,
//   Mail,
//   MapPin,
//   Edit,
//   Trash2
// } from 'lucide-react';
// import AdminLayout from '../../components/admin/layout/AdminLayout';

// const Suppliers = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);

//   const suppliers = [
//     {
//       id: 1,
//       name: 'Arduino LLC',
//       contact: 'John Smith',
//       email: 'orders@arduino.cc',
//       phone: '+1 (555) 123-4567',
//       address: '1234 Tech Street, San Francisco, CA',
//       status: 'active',
//       products: 15,
//       lastOrder: '2024-06-15'
//     },
//     {
//       id: 2,
//       name: 'Raspberry Pi Trading',
//       contact: 'Sarah Johnson',
//       email: 'trade@raspberrypi.org',
//       phone: '+44 1223 322633',
//       address: 'Station Road, Cambridge, UK',
//       status: 'active',
//       products: 8,
//       lastOrder: '2024-06-12'
//     },
//     {
//       id: 3,
//       name: 'Espressif Systems',
//       contact: 'Mike Chen',
//       email: 'sales@espressif.com',
//       phone: '+86 21 5079 3001',
//       address: 'Shanghai, China',
//       status: 'inactive',
//       products: 12,
//       lastOrder: '2024-05-20'
//     }
//   ];

//   const [newSupplier, setNewSupplier] = useState({
//     name: '',
//     contact: '',
//     email: '',
//     phone: '',
//     address: ''
//   });

//   const filteredSuppliers = suppliers.filter(supplier =>
//     supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//               <Building className="w-8 h-8 mr-3 text-blue-600" />
//               Suppliers
//             </h1>
//             <p className="text-gray-600 mt-1">Manage supplier relationships</p>
//           </div>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Supplier
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{suppliers.length}</p>
//               </div>
//               <Building className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
//                 <p className="text-2xl font-bold text-green-600 mt-1">
//                   {suppliers.filter(s => s.status === 'active').length}
//                 </p>
//               </div>
//               <Building className="w-8 h-8 text-green-600" />
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-2xl font-bold text-purple-600 mt-1">
//                   {suppliers.reduce((sum, s) => sum + s.products, 0)}
//                 </p>
//               </div>
//               <Building className="w-8 h-8 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search suppliers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
//             />
//           </div>
//         </div>

//         {/* Suppliers Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredSuppliers.map((supplier) => (
//             <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   supplier.status === 'active'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {supplier.status}
//                 </span>
//               </div>

//               <div className="space-y-3 mb-4">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Phone className="w-4 h-4 mr-2" />
//                   {supplier.phone}
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Mail className="w-4 h-4 mr-2" />
//                   {supplier.email}
//                 </div>
//                 <div className="flex items-start text-sm text-gray-600">
//                   <MapPin className="w-4 h-4 mr-2 mt-0.5" />
//                   {supplier.address}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Products:</span>
//                   <span className="font-medium text-gray-900 ml-1">{supplier.products}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Last Order:</span>
//                   <span className="font-medium text-gray-900 ml-1">{supplier.lastOrder}</span>
//                 </div>
//               </div>

//               <div className="flex space-x-2">
//                 <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
//                   <Edit className="w-4 h-4 mr-1 inline" />
//                   Edit
//                 </button>
//                 <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Add Supplier Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Supplier</h2>

//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Supplier Name"
//                   value={newSupplier.name}
//                   onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Contact Person

const Suppliers = () => {
  return <div></div>;
};

export default Suppliers;
