import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function AuthGuard({ element }) {
  const token = Cookies.get('token'); // Obtenez le token depuis les cookies

  if (token) {
    // L'utilisateur est connecté, empêchez l'accès à /register et /login
    if (window.location.pathname === '/register' || window.location.pathname === '/login') {
      return <Navigate to="/" />;
    }
    
    // L'utilisateur est connecté, redirigez vers la page de market ou autorisez l'accès à la route protégée
    return element;
  } else {
    // L'utilisateur n'est pas connecté, redirigez vers la page de connexion
    if (window.location.pathname === '/register' || window.location.pathname === '/login') {
      return element;
    }
    return <Navigate to="/login" />;
  }
}

export default AuthGuard;