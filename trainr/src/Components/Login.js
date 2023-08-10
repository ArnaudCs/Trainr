import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Link, Snackbar, Alert  } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import Cookies from 'js-cookie';
import './CSS/Login.css'; // Importez le fichier CSS
import LoadingScreen from './LoadingScreen';

function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [snackData, setSnackData] = useState({
        message: '',
        color: '',
    });

    const [open, setOpen] = React.useState(false);
    const [validEmail, setValidEmail] = useState(true); // New state for email validation
    const [isLoading, setIsLoading] = useState(false); // Ajoutez l'état isLoading


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setSnackData((prevData) => ({ ...prevData, [name]: value }));
    
        if (name === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          setValidEmail(emailRegex.test(value));
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.email || !formData.password) {
          snackData.message = 'Veuillez remplir tous les champs';
          snackData.color = 'error';
          setOpen(true);
          return;
        }
      
        try {
          const response = await axios.post('http://localhost:3000/login', formData);
          console.log(response);
          if (response.data.message === 'Connexion réussie') {
            const token = response.data.token;
            Cookies.set('token', token, { expires: 1 });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoading(true);
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else if (response.data.message === 'Identifiants incorrects') {
            snackData.message = 'Mot de passe ou mail invalide';
            snackData.color = 'error';
            setOpen(true);
            return;
          }
        } catch (error) {
          console.error(error);
        }
    };
      


    return (
        <div sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',  minHeight: '100%'}}>
          <div>
            {isLoading ? (
              <LoadingScreen /> // Affichez le composant de chargement lorsque isLoading est true
            ) : null}
          </div>
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Paper elevation={5} sx={{ padding: 3, width: '100%', maxWidth: 500, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '1em' }}>
                    <Typography variant="h4" align="center" gutterBottom className='loginElement'>
                    Connexion
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            className='loginElement'
                            label="Adresse e-mail"
                            margin="normal"
                            value={formData.email}
                            name="email"
                            onChange={handleChange}
                            variant="outlined"
                            required
                            InputProps={{
                              startAdornment: <AccountCircle style={{ marginRight: '5px', color: 'white' }}/>,
                              style: {
                                color: 'white',
                                borderColor: 'white'  
                              },
                              inputMode: 'numeric'  
                            }}
                            labelProps={{
                              style: {
                                color: 'white'  // Couleur de l'étiquette
                              }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            margin="normal"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            variant="outlined"
                            error={!validEmail} // Set error state based on email validity
                            helperText={!validEmail ? 'Veuillez entrer une adresse e-mail valide' : ''}
                            InputProps={{
                              startAdornment: <Lock style={{ marginRight: '5px', color: 'white' }}/>,
                              style: {
                                color: 'white',
                                borderColor: 'white'  
                              },
                              inputMode: 'numeric'  
                            }}
                            labelProps={{
                              style: {
                                color: 'white'  // Couleur de l'étiquette
                              }
                            }}
                        />
                        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" className='connectBtn'>
                            Se connecter
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 2 }} className='loginElement'>
                    Pas encore de compte ? <Link component={RouterLink} to="/register">Je n'ai pas de compte</Link>
                    </Typography>
                </Paper>

                <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} position="bottom-right" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={snackData.color} sx={{ width: '100%' }}>
                        {snackData.message}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
}

export default Login;
