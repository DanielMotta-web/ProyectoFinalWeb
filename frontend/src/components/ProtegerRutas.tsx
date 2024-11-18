import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Navbar from './navbar/navbar';

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  interface DecodedToken {
    _id: string;
    rol: string;
    // add other properties if needed
  }

  const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
  if (roles && !roles.includes(decodedToken.rol)) {
    return <Navigate to="/inicio" />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default ProtectedRoute;