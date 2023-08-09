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
import Box from '@mui/material/Box';

function Market() {
  const [marketItems, setMarketItems] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      axios.get('http://localhost:3000/get-market', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        const sortedMarketItems = response.data.Leaders.slice(); // Créez une copie du tableau
        sortedMarketItems.sort((a, b) => a.Price - b.Price); // Triez les éléments en fonction du prix
        setMarketItems(sortedMarketItems); // Mettez à jour l'état avec le tableau trié
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du market :', error);
      });
    }
  }, []);

  return (
    <div className='Main'>
      <h1>Welcome to the Market Page</h1>
      <p>This is the content of the market page.</p>

      <h2>Market Items</h2>
      <div className='ItemContainer'>
        {marketItems.map(item => (
          <Card className='ItemCard'>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography component="div" variant="h5">
                  {item.Name}
                </Typography>
                <Typography component="div">
                  <p>Description : {item.Description}</p>
                </Typography>
                <Typography component="div">
                  <p className='PriceTag'>Prix : {item.Price} Points</p>
                </Typography>
                <CardActions>
                  <Button variant='contained'>Buy</Button>
                </CardActions>
              </CardContent>
            </Box>
            <CardMedia
              component="img"
              sx={{ width: '20vw', height: '15vw', borderRadius: '1em'}}
              image={item.Photo}
              alt="Live from space album cover"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}


export default Market;

