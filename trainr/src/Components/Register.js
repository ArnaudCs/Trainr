import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Link, IconButton, InputAdornment, Snackbar, Alert  } from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios'; // Import Axios

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [snackData, setSnackData] = useState({
    message: '',
    color: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(true); // New state for email validation
  const [validPassword, setValidPassword] = useState(true); // New state for password validation
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setSnackData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidEmail(emailRegex.test(value));
    }

    if (name === 'password') {
      // Password should contain at least 8 characters, one uppercase letter, and one special character
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setValidPassword(passwordRegex.test(value));
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.password || !formData.confirmPassword || !formData.email || !formData.name || !formData.firstname) {
      snackData.message = 'Veuillez remplir tous les champs';
      snackData.color = 'error';
      setOpen(true);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/register', formData);
      console.log(response);
      if(response.data.message === 'Utilisateur ajouté avec succès') {
        snackData.message = 'Utilisateur ajouté avec succès';
        snackData.color = 'success';
        setOpen(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else if (response.data.message === 'Cet e-mail est déjà utilisé') {
        snackData.message = 'Cet email est déjà utilisé';
        snackData.color = 'error';
        setOpen(true);
        return;
      }
    } catch (error) {
      console.error(error);
    } 
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Prénom"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Adresse e-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!validEmail} // Set error state based on email validity
            helperText={!validEmail ? 'Veuillez entrer une adresse e-mail valide' : ''}
          />
          <TextField
            fullWidth
            label="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            InputProps={{
              startAdornment: <Lock style={{ marginRight: '5px' }}/>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={formData.password && !validPassword}
            helperText={
              formData.password && !validPassword
                ? 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial'
                : ''
            }
          />
          <TextField
            fullWidth
            label="Confirmation du mot de passe"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            InputProps={{
              startAdornment: <Lock style={{ marginRight: '5px' }}/>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={formData.confirmPassword !== formData.password}
            helperText={
              formData.confirmPassword !== formData.password ? 'Les mots de passe ne correspondent pas' : ''
            }
          />
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
            S'inscrire
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Déjà un compte ? <Link href="/login">Se connecter</Link>
        </Typography>
      </Paper>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} position="bottom-right" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={snackData.color} sx={{ width: '100%' }}>
          {snackData.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
