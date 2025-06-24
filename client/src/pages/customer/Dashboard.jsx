import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../../services_hooks/customer/userAuthApi"; 
import "../../assets/css/customer/Dashboard.css"; 
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userAuth);

  // Redirect to login if not logged in
  if (!user) {
    navigate("/customer/login");
    return null;
  }

  const handleLogout = () => {
    userLogout(dispatch);
    navigate("/customer/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>BollentElectric Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <h2>Welcome, {user.name || "Customer"} 👋</h2>
        <p>This is your personalized dashboard.</p>

        <section className="dashboard-section">
          <h3>⚙️ Account Information</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member Since:</strong> {user.createdAt?.substring(0, 10) || "N/A"}</p>
        </section>

        <section className="dashboard-section">
          <h3>🔌 Your Services</h3>
          <p>You haven’t booked any services yet.</p>
        </section>
      </main>

      <footer className="dashboard-footer">
        © 2025 BollentElectric | <a href="#">Privacy</a> | <a href="#">Terms</a>
      </footer>
    </div>
  );
};

export default Dashboard;
