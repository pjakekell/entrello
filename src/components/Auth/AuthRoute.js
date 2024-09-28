import React from "react";
import { Route, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import moment from "moment";
// import logger from '../../utils/logger'

export default function Route({ element: element, ...rest }) {
  const isAuthenticated = () => {
    const token = localStorage.getItem("t");
    if (!token) return false;

    var decoded = jwt_decode(token);
    var exp = isNaN(decoded.exp)
      ? moment(decoded.exp).toDate()
      : new Date(decoded.exp * 1000);
    if (exp > new Date()) return true;

    localStorage.removeItem("t");
    return false;
  };

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? <element {...props} /> : <Navigate to="/login" />
      }
    />
  );
}
