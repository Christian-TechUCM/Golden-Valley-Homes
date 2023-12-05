import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext"; // Correct import
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import logo from "../../assets/images/logo.png";
import "../../App.css";

function Header() {
  const { currentUser, logout, currentUserRole } = useAuth(); // Assuming currentUserRole is available
  const navigate = useNavigate();

  const handleLoginLogoutClick = () => {
    if (currentUser) {
      logout();
      navigate("/login"); // Redirect to login page after logout
    } else {
      navigate("/login");
    }
  };

  const handleDashboardRedirect = () => {
    switch (currentUserRole) {
      case "admin":
        navigate("/admin");
        break;
      case "realtor":
        navigate("/realtor");
        break;
      case "user":
        navigate("/user");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "white" }}>
      <Toolbar style={{ justifyContent: 'space-between' }}>
  
        {/* Left spacer */}
        <div style={{ flex: 1 }}></div>
  
        {/* Centered content with logo and company name */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Company Logo" style={{ height: 30, marginRight: 8 }} />
          <Typography variant="h6" component="div" style={{ color: "black", fontFamily: "Montserrat-Regular" }}>
            Golden Valley Homes
          </Typography>
        </div>
  
        {/* Right content with welcome message and buttons */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {currentUser && (
            <Typography variant="subtitle1" style={{ color: 'black', marginRight: 10 }}>
              Welcome, {currentUser.name}
            </Typography>
          )}
  
          {currentUser && (
            <Button
              onClick={handleDashboardRedirect}
              style={{ background: 'none', color: 'black', marginRight: 10 }}
            >
              Dashboard
            </Button>
          )}
  
          <Button
            color="inherit"
            onClick={handleLoginLogoutClick}
            style={{ background: 'none', color: 'black' }}
          >
            {currentUser ? "Logout" : "Login"}
          </Button>
        </div>
  
      </Toolbar>
    </AppBar>
  );
  
}

export default Header;
