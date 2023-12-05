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

function UserHeader() {
  const { currentUser, logout } = useAuth(); // Removed currentUserRole as it's no longer needed
  const navigate = useNavigate();

  const handleLoginLogoutClick = () => {
    if (currentUser) {
      logout();
      navigate("/"); // Redirect to the main page after logout
    } else {
      navigate("/login");
    }
  };


  const handleMainPageRedirect = () => {
    navigate("/"); // Always navigate to the main page
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "white" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Company Logo" style={{ height: 40, marginRight: 8 }} />
          <Typography variant="h6" component="div" style={{ color: "black", fontFamily: "Montserrat-Regular" }}>
            Golden Valley Homes
          </Typography>
          {currentUser && (
            <Typography variant="subtitle1" style={{ marginLeft: 10, color: 'black'}}>
              Welcome, {currentUser.name} {/* Adjust according to your user object */}
            </Typography>
          )}
        </Box>

        {currentUser && (
          <Button
            onClick={handleMainPageRedirect}
            style={{ marginRight: 10, background: 'linear-gradient(to bottom, #1adbfe, #4db3fe)', color: 'black' }}
          >
            Main Page
          </Button>
        )}

        <Button
          color="inherit"
          onClick={handleLoginLogoutClick}
          style={{ background: currentUser ? 'none' : 'linear-gradient(to bottom, #1adbfe, #4db3fe)', color: 'black' }}
        >
          {currentUser ? "Logout" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default UserHeader;
