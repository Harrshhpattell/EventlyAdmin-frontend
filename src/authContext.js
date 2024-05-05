/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import PropTypes from 'prop-types';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(
    !!Cookies.get("authorizationAdmin")
  );
  const [isMasterAdmin, setIsMasterAdmin] = useState(
    Cookies.get("masterAdmin")
  );
  

  // console.log("tokennn:", Cookies.get("authorizationAdmin"));

  const login = () => {
    setAuthenticated(true);
    setIsMasterAdmin(true);
  };
  
  const logout = () => {
    Cookies.remove("authorizationAdmin");
    Cookies.remove("masterAdmin");
    setAuthenticated(false);
    setIsMasterAdmin(false);
  };
  // console.log("authenticated...authenticated",authenticated)
  console.log("masterAdmin...masterAdmin", Cookies.get("masterAdmin"))

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, isMasterAdmin  }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default AuthContext;