import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./components/AuthContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* Wrap App in AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
