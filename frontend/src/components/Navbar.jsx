import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (!token) {
    return null; // Don't display the navbar if the user is not logged in
  }

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#f8f9fa" }}>
      <div>Welcome, {localStorage.getItem("username") || "User"}!</div>
      <button onClick={handleLogout} style={{ cursor: "pointer" }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;