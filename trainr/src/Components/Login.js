import React from 'react';
import { Container, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function Login() {
  return (
    <div sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',  minHeight: '100%'}}>
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Paper elevation={5} sx={{ padding: 3, width: '100%', maxWidth: 500, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '1em' }}>
                <Typography variant="h4" align="center" gutterBottom>
                Connexion
                </Typography>
                <form>
                <TextField
                    fullWidth
                    label="Adresse e-mail"
                    margin="normal"
                    variant="outlined"
                    InputProps={{ startAdornment: <AccountCircle /> }}
                />
                <TextField
                    fullWidth
                    label="Mot de passe"
                    margin="normal"
                    type="password"
                    variant="outlined"
                    InputProps={{ startAdornment: <Lock /> }}
                />
                <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                    Se connecter
                </Button>
                </form>
                <Typography variant="body2" sx={{ mt: 2 }}>
                Pas encore de compte ? <Link component={RouterLink} to="/register">Je n'ai pas de compte</Link>
                </Typography>
            </Paper>
        </Container>
    </div>
  );
}

export default Login;
