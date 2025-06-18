import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

// Import route components
import AdminRoutes from "./routes/AdminRoutes";

// Import global components
import ErrorBoundary from "./components/common/ErrorBoundary";

// Import styles
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        {/* Global Toast Notifications */}
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

        {/* Main Application Routes */}
        <Routes>
          {/* Customer Routes - Main e-commerce site */}
          {/* <Route path="/*" element={<CustomerRoutes />} /> */}

          {/* Admin Routes - Admin panel */}

          {/* Redirect root admin to dashboard */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/*" element={<AdminRoutes />} />
          {/* 404 - Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
