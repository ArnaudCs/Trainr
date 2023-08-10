import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './CSS/Casino.css'; // Importez le fichier CSS
import { TextField } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Button from '@mui/material/Button';

function Casino() {
  // Vérifiez si l'utilisateur est authentifié avant d'afficher le bouton

  const [userInfos, setUserInfos] = useState([]);

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
        console.error('Erreur lors de la récupération du market :', error);
      });
    }
  }, [userInfos]);
  
  return (
    <div className='MainCasino'>
        <h1>Bonjour {userInfos.firstName} {userInfos.name}, vous voulez gagner plus ? </h1>
        <h3>Jouez à vos risques et périls !</h3>
        <div className='WheelContainer'>
            <h1 style={{textAlign: 'center'}}>Devine le nombre !</h1>
            <h3 style={{textAlign: 'center', maxWidth: '80%'}}>Les règles sont simples : Entre un nombre et clique sur "Tourner", une roulette magique va tourner, si le nombre que tu as entré sort, tu gagnes 2X ta mise. Il faut choisir un nombre entre 1 et 10 (0 non inclu)</h3>
            <TextField
                fullWidth
                label="Mise en Piggies"
                margin="normal"
                name="number"
                variant="outlined"
                required
                InputProps={{
                    startAdornment: <CasinoIcon style={{ marginRight: '5px', color: 'white' }}/>,
                    endAdornment: <SavingsTwoToneIcon style={{ color: 'white' }}/>,
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
                label="Chiffre sortant selon toi"
                margin="normal"
                name="number"
                variant="outlined"
                required
                InputProps={{
                    startAdornment: <EmojiEventsIcon style={{ marginRight: '5px', color: 'white' }}/>,
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
            {userInfos.points > 0 ? (
                <Button startIcon={<CasinoIcon />} variant='contained' size='large' style={{marginTop: '2vh'}}>Jouer</Button>
            ) : null}
        </div>
    </div>
  );
}

export default Casino;
