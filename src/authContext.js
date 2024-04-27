/* eslint-disable prettier/prettier */
import React, { createContext, useState } from "react";
import Cookies from "js-cookie";
import PropTypes from 'prop-types';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(
    !!Cookies.get("authorizationAdmin")
  );

  // console.log("tokennn:", Cookies.get("authorizationAdmin"));

  const login = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("authorizationAdmin");
    setAuthenticated(false);
  };
  console.log("authenticated...authenticated",authenticated)

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default AuthContext;