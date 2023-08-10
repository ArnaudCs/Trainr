import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Typography, Button } from '@mui/material';
import LoadingScreen from './LoadingScreen';
import Grid from '@mui/material/Grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './CSS/Home.css'; // Importez le fichier CSS

function Home() {
  // Vérifiez si l'utilisateur est authentifié avant d'afficher le bouton

  const [userInfos, setUserInfos] = useState([]);
  const [programs, setProgramInfos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Ajoutez l'état isLoading

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      axios.get('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUserInfos(response.data.user);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      });
    }
  }, []);
  
  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      axios.get('http://localhost:3000/get-programs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setProgramInfos(response.data.programs);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des programmes :', error);
      });
    }
  }, []);

  return (
    <div className='MainHome'>
      <div>
        {isLoading ? (
          <LoadingScreen /> // Affichez le composant de chargement lorsque isLoading est true
        ) : null}
      </div>
      <h1>Bonjour {userInfos.firstName} {userInfos.name}, prêt pour votre séance ? </h1>
      <h3>Vos programmes : </h3>

      <div className='ItemContainer'>
        <Grid container rowSpacing={1} columnSpacing={{ sm: 2, md: 3 }}>
              {programs.map(item => (
                <Grid item md={4} xs={12} sm={6} key={item.id}>
                  <Card className='ItemCard'>
                    <CardMedia
                      sx={{ height: '30vh' }}
                      image={item.Photo}
                      title="green iguana"
                    >
                      <div className='priceImage'>
                        <div className='priceDisplay'>
                          <p className='priceDisplayElement'>{item.Price}</p>
                        </div>
                      </div>
                    </CardMedia>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.Name}
                      </Typography>
                      <Typography variant="body2">
                        {item.Description}
                      </Typography>
                      <Typography variant="body2">
                        <ul>
                          {item.exercises.map(exercise => (
                            <li key={exercise.idExercise}>{exercise.Name}</li>
                          ))}
                        </ul>
                      </Typography>
                    </CardContent>
                    <CardActions className='cardActions'>
                      {!userInfos.isAdmin ? (
                        <Button className='buyButton' disabled={userInfos.points < item.Price && userInfos.isAdmin === 0} startIcon={<ShoppingCartIcon />} variant='contained' size='large'>Acheter</Button>
                      ) : null}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </div>
      
    </div>
  );
}

export default Home;
