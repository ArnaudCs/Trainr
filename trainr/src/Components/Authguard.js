import React from 'react';
import { Navigate } from 'react-router-dom';

function AuthGuard({ element }) {
  const isAuthenticated = false; // Remplacez par votre logique d'authentification

  if (isAuthenticated) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
}

export default AuthGuard;
