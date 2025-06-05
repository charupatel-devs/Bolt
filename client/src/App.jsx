import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromToken } from "./store/slices/authSlice";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/user/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
