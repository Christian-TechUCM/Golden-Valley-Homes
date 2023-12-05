import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext"; // Adjust the path as per your directory structure
import AdminHeader from "./AdminHeader";
import "./AdminDashboard.css"

function Admin() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();

  const handleLogout = () => {
    // Clear user role from auth context and localStorage
    setUserRole("guest");
    localStorage.removeItem("userRole");
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <div>
       <AdminHeader /> {/* Include the AdminHeader component */}
      
       <iframe
  src="http://localhost:5000/admin"
  title="Admin Interface"
  class="full-height-iframe"
></iframe>

    </div>
  );
}

export default Admin;
