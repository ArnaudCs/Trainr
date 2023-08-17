import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importez Axios
import Cookies from 'js-cookie';
import './CSS/Sessions.css'; // Importez le fichier CSS
import Card from '@mui/material/Card';
import LoadingScreen from './LoadingScreen';
import { Paper, TableRow, TableBody, TableHead, TableCell, TableContainer, Table } from '@mui/material';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import moment from 'moment';

function Sessions() {
  const [userSessions, setUserSessions] = useState([]);
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
            axios.get('http://localhost:3000/get-sessions', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
                    .then(response => {
                        setUserSessions(response.data.sessions);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des sessions :', error);
                        setIsLoading(false);
                    });
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des sessions :', error);
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
        <h1>Historique de vos sessions</h1>
        <Card className='pointPurchaseDisplay'>
          <p className='pointPurchaseSold'>{userInfos.points}<SavingsTwoToneIcon style={{ marginLeft: '5px' }}></SavingsTwoToneIcon></p>
        </Card>
      </div>
      <h2>Vos sessions récentes : </h2>
      <div className='ItemContainer'>
            <TableContainer component={Paper} className='TablePurchase'>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                        <TableCell className='tableHead'>Nom</TableCell>
                        <TableCell className='tableHead'>Date session</TableCell>
                        <TableCell className='tableHead'>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                        {userSessions.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className='tableContent'>{item.Name}</TableCell>
                            <TableCell className='tableContent'>{moment(item.Date).add(2, 'hours').format('YYYY-MM-DD HH:mm')}</TableCell>
                            <TableCell className='tableContent'>{item.PointsEarned}<SavingsTwoToneIcon style={{marginLeft: '7px'}}></SavingsTwoToneIcon></TableCell>
                        </TableRow>
                        ))}
                  </TableBody>
                </Table>
            </TableContainer>
      </div>
    </div>
  );
}


export default Sessions;

