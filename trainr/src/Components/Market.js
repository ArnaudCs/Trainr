import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importez Axios
import Cookies from 'js-cookie';
import './CSS/Market.css'; // Importez le fichier CSS
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingScreen from './LoadingScreen';
import Grid from '@mui/material/Grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SavingsIcon from '@mui/icons-material/Savings';

function Market() {
  const [marketItems, setMarketItems] = useState([]);
  const [userInfos, setUserInfos] = useState([]);
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
            axios.get('http://localhost:3000/get-market', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
                  .then(response => {
                    const sortedMarketItems = response.data.Leaders.slice(); // Créez une copie du tableau
                    sortedMarketItems.sort((a, b) => a.Price - b.Price); // Triez les éléments en fonction du prix
                    setMarketItems(sortedMarketItems); // Mettez à jour l'état avec le tableau trié
                    setIsLoading(false);
                  })
                  .catch(error => {
                    console.error('Erreur lors de la récupération du market :', error);
                  });
          })
          .catch(error => {
            console.error('Erreur lors de la récupération du market :', error);
          });
    }
  }, []);

  return (
    <div className='Main'>
      <div>
        {isLoading ? (
          <LoadingScreen /> // Affichez le composant de chargement lorsque isLoading est true
        ) : null}
      </div>

      <div className='TitleDiv'>
        <h1>Bienvenu dans la boutique </h1>
        <Card className='pointDisplay'>
          <p className='pointSold'>{userInfos.points}<SavingsIcon style={{ marginLeft: '5px' }}></SavingsIcon></p>
        </Card>
      </div>
      <h2>Faites vous plaisir ... </h2>
      <div className='ItemContainer'>
        <Grid container rowSpacing={1} columnSpacing={{ sm: 2, md: 3 }}>
              {marketItems.map(item => (
                <Grid item md={4} xs={12} sm={6} key={item.id}>
                  <Card className='ItemCard'>
                    <CardMedia
                      sx={{ height: '30vh' }}
                      image={item.Photo}
                      title="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.Name}
                      </Typography>
                      <Typography variant="body2">
                        {item.Description}
                      </Typography>
                      <Typography variant="body2">
                        {item.Price}
                      </Typography>
                    </CardContent>
                    <CardActions className='cardActions'>
                      <Button className='buyButton' startIcon={<ShoppingCartIcon />} variant='contained' size='large' >Acheter</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </div>
    </div>
  );
}


export default Market;

