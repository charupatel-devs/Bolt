import { Routes, Route } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Routes>
        {/* Add nested admin routes here */}
        <Route index element={<div>Dashboard Overview</div>} />
        <Route path="products" element={<div>Products Management</div>} />
        <Route path="orders" element={<div>Orders Management</div>} />
        <Route path="users" element={<div>Users Management</div>} />
      </Routes>
    </div>
  );
};

export default Dashboard;