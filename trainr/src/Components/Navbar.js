import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';  
import IconButton from '@mui/material/IconButton';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import './CSS/AppBar.css'; // Importez le fichier CSS

function Navbar() {

  const handleLogout = () => {
    // Supprimez le token des cookies et redirigez vers la page de connexion
    Cookies.remove('token');
    window.location.href = '/login';
  };

  // Vérifiez si l'utilisateur est authentifié avant d'afficher le bouton
  const isAuthenticated = Cookies.get('token') !== undefined;

  return (
    <AppBar position="static" className='navBar'>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white' }}>
          TrainR
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        {isAuthenticated && (
          <IconButton aria-label="delete" size="large" component={Link} to="/market">
            <LocalGroceryStoreIcon></LocalGroceryStoreIcon>
          </IconButton>
        )}
        {!isAuthenticated && ( <Button color="inherit" component={Link} to="/login">Se connecter</Button>)}
        {isAuthenticated && (
          <IconButton aria-label="delete" size="large" component={Link} to="/profile">
            <AccountBoxIcon></AccountBoxIcon>
          </IconButton>
        )}
        {isAuthenticated && (
          <IconButton aria-label="delete" size="large" onClick={handleLogout}>
            <MeetingRoomIcon></MeetingRoomIcon>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
