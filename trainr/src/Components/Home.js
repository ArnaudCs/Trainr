import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';

function Home() {

  const handleLogout = () => {
    // Supprimez le token des cookies et redirigez vers la page de connexion
    Cookies.remove('token');
    window.location.href = '/login';
  };

  // Vérifiez si l'utilisateur est authentifié avant d'afficher le bouton
  const isAuthenticated = Cookies.get('token') !== undefined;

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the content of the home page.</p>

      {isAuthenticated && (
        <Button color="secondary" variant="contained" onClick={handleLogout}>
          Se déconnecter
        </Button>
      )}
    </div>
  );
}

export default Home;
