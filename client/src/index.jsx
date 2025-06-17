import { QueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Import Bootstrap CSS (must be imported before custom CSS)
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
// Import custom global styles
import "./App.css";
import "./styles/global.css";

// Import main App component
import App from "./App";
// import { store } from "./store";

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* <Provider store={store}>
      <QueryClientProvider client={queryClient}> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </QueryClientProvider>
    </Provider> */}
  </React.StrictMode>
);
