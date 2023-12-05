// src/pages/common/Register.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import "./Register.css";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Default user type
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace URL with your Flask backend endpoint for registration
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, user_type: userType }),
      });

      if (response.ok) {
        // Handle successful registration
        console.log("User registered successfully");
        navigate("/login"); // Redirect to login page or home page after successful registration
      } else {
        // Handle errors
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  const handleBackClick = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="register-form">
          <IconButton onClick={handleBackClick} className="back-button">
            <ArrowBackIcon />
          </IconButton>
          <h1>Register</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
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
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="realtor">Realtor</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}


export default Register;