import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/common/Home";
import Home_Info from "./components/Listings/Home-Info";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import RealtorDashboard from "./pages/realtor/RealtorDashboard";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home/:id" element={<Home_Info />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />} />
          <Route path="/user" element={<ProtectedRoute component={UserDashboard} allowedRoles={["user"]} />} />
          <Route path="/realtor" element={<ProtectedRoute component={RealtorDashboard} allowedRoles={["realtor"]} />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
