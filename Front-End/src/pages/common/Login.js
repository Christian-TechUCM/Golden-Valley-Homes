import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../components/AuthContext"; // Correct import
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton'; // Add this line

function Login() {
  const { setCurrentUser, setUserRole } = useAuth(); // Use the useAuth hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const navigateBasedOnRole = (role) => {
    switch (role) {
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
        navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log(data); 
      if (response.ok) {
        setCurrentUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data)); // For persistent login
      
        const userType = data.user_type;
        localStorage.setItem("userRole", userType); // Save role to localStorage
        setUserRole(userType); // Update role in auth context
      
        navigateBasedOnRole(userType); // Use this function for role-based redirection
      } else {
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  
  const handleBackClick = () => {
    navigate("/"); // Navigate to the main page
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
    <div className="login-form">
    <IconButton onClick={handleBackClick} className="back-button">
  <ArrowBackIcon />
</IconButton>

      <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
          <button
            type="button"
            className="register-btn"
            onClick={handleGoToRegister}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
