import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      console.log("print local storage token in auth context: "+ localStorage.getItem("token"))
      console.log(decodedToken)
      console.log("expiry time " + decodedToken.exp)
      const currentTime = Date.now() / 1000; // Convert to seconds
      console.log("current time "+ currentTime)
      if (decodedToken.exp < currentTime) {
        // Token has expired
        localStorage.removeItem("token");
        setToken(null);
        console.log("printing after token set to null " +token)
      } else {
        setToken(storedToken);
      }
    }
    setLoading(false); 
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

//children = Router, Route, Routes, Login, Dashboard, Registration