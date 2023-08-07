import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white' }}>
          Mon Site
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Button color="inherit" component={Link} to="/market">Market</Button>
        <Button color="inherit" component={Link} to="/login">Se connecter</Button>
        <Button color="inherit" startIcon={<AccountCircle />} component={Link} to="/profile">Mon profil</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
