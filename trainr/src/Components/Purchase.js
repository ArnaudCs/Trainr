import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importez Axios
import Cookies from 'js-cookie';
import './CSS/Purchase.css'; // Importez le fichier CSS
import Card from '@mui/material/Card';
import LoadingScreen from './LoadingScreen';
import { Paper, TableRow, TableBody, TableHead, TableCell, TableContainer, Table } from '@mui/material';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import moment from 'moment';

function Purchase() {
  const [purchasedItems, setPurchasedItems] = useState([]);
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
            axios.get('http://localhost:3000/get-recipes', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
                  .then(response => {
                    setPurchasedItems(response.data.recipes);
                    setIsLoading(false);
                  })
                  .catch(error => {
                    console.error('Erreur lors de la récupération du market :', error);
                    setIsLoading(false);
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
        <h1>Historique de vos achats</h1>
        <Card className='pointPurchaseDisplay'>
          <p className='pointPurchaseSold'>{userInfos.points}<SavingsTwoToneIcon style={{ marginLeft: '5px' }}></SavingsTwoToneIcon></p>
        </Card>
      </div>
      <h2>Vos achats récents : </h2>
      <div className='ItemContainer'>
            <TableContainer component={Paper} className='TablePurchase'>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                        <TableCell className='tableHead'>Nom</TableCell>
                        <TableCell className='tableHead'>Date d'achat</TableCell>
                        <TableCell className='tableHead'>Prix</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                        {purchasedItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className='tableContent'>{item.Name}</TableCell>
                            <TableCell className='tableContent'>{moment(item.Date).utcOffset(120).format('YYYY-MM-DD HH:mm')}</TableCell>
                            <TableCell className='tableContent'>{item.Price} <SavingsTwoToneIcon></SavingsTwoToneIcon></TableCell>
                        </TableRow>
                        ))}
                  </TableBody>
                </Table>
            </TableContainer>
      </div>
    </div>
  );
}


export default Purchase;

