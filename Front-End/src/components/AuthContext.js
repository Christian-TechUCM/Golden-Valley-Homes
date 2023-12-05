import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Parsing error in AuthProvider: ", error);
        return null;
      }
    }
    return null;
  });
  const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem("userRole") || "guest");

  const logout = () => {
    setCurrentUser(null);
    setCurrentUserRole("guest");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    // Add any other cleanup you need
  };

  const setUserRole = (role) => {
    setCurrentUserRole(role);
    localStorage.setItem("userRole", role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, currentUserRole, setCurrentUserRole, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


