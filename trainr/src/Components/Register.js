import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Link, IconButton, InputAdornment } from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle registration logic here
    console.log(formData);
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
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Âge"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Taille (en cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Poids (en kg)"
            name="weight"
            type="number"
            value={formData.weight}
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
              startAdornment: <Lock />,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={formData.password && formData.password.length < 8}
            helperText={
              formData.password && formData.password.length < 8
                ? 'Le mot de passe doit contenir au moins 8 caractères'
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
              startAdornment: <Lock />,
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
    </Container>
  );
}

export default Register;
