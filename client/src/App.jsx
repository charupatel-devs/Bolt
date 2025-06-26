import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminRoutes from "./routes/AdminRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";

import "./App.css";
import Home from "./pages/customer/Home";

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#4aed88",
                color: "#000",
              },
            },
            error: {
              style: {
                background: "#f87171",
                color: "#fff",
              },
            },
          }}
        />

        <Routes>

           <Route path="/" element={<Home/>} />
          <Route path="/customer/*" element={<CustomerRoutes />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
