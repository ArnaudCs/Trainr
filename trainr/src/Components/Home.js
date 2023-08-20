import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import LoadingScreen from './LoadingScreen';
import Grid from '@mui/material/Grid';
import './CSS/Home.css';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Home() {
  // Vérifiez si l'utilisateur est authentifié avant d'afficher le bouton

  const [userInfos, setUserInfos] = useState([]);
  const [noProg, setNoProg] = useState(false);
  const [programs, setProgramInfos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Ajoutez l'état isLoading
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openValidation, setOpenValidation] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [snackData, setSnackData] = useState({
      message: '',
      color: '',
  });

  const [sessionData, setSessionData] = useState({
      idUser: '',
      idItem: '',
      idPrice: '',
      date: '',
      newSoldes: '',
  });

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
        setNoProg(true);
        setIsLoading(false);
        console.error('Erreur lors de la récupération des programmes :', error);
      });
    }
  }, []);

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setSessionData({
      idUser: userInfos.userId,
      idProg: item.idProg,
      progName: item.Name,
      price: item.Price,
      date: new Date(),
      newSoldes: userInfos.points + item.Price,
    });
    setOpenValidation(true);
  };

  const handleCloseSession = () => {
    setOpenValidation(false);
  };

  const handleClose = () => {
    setOpenSnack(false);
  };

  const handleAddSession = async () => {
    const token = Cookies.get('token');

    if(userInfos.points >= selectedItem.Price) {
      console.log(sessionData);
      try {
        const response = await axios.post('http://localhost:3000/add-session', sessionData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);
        if (response.data.message === 'Session ajoutée avec succès') {
          setOpenSnack(true);
          setSnackData({
            message: 'Session ajoutée avec succès, ajout des points et rechargement ...',
            color: 'success',
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      } 
    }
  };

  return (
    <div className='MainHome'>
      <div>
        {isLoading ? (
          <LoadingScreen /> // Affichez le composant de chargement lorsque isLoading est true
        ) : null}
      </div>
      <h1>Bonjour {userInfos.firstName} {userInfos.name}, prêt(e) pour votre séance ? </h1>
      <h2>Vos programmes : </h2>

      {noProg ? (
      <h3>Aucun programme pour le moment ..</h3>) :
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
                          <p className='priceDisplayElement'>+{item.Price}</p>
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
                          {item.exercises.map(exercise => (
                            <div className='exeContainer'>
                              <p key={exercise.idExercise}>{exercise.Name} - Series : {exercise.Series} - Reps : {exercise.Reps}</p>
                            </div>
                          ))}
                      </Typography>
                    </CardContent>
                    <CardActions className='cardActions'>
                      {!userInfos.isAdmin ? (
                        <Button className='buyButton' startIcon={<DoneAllIcon />} variant='contained' size='large' onClick={() => handleClickOpen(item)}>Fait !</Button>
                      ) : null}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </div>}

      <Dialog
        open={openValidation}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseSession}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{fontWeight: 700}}>{"Valider la session ?"}</DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-slide-description" className='dialogText'>
            Voulez-vous vraiment valider "{selectedItem ? selectedItem.Name : null}" pour gagner {selectedItem ? selectedItem.Price : null} Piggies ? Cette action est irréversible, vous êtes responsable et comprenez qu'une fause déclaration donnera droit à un retrait de points supplémentaires.
          </DialogContentText>  
          <DialogContentText id="alert-dialog-slide-description" className='dialogText'>
            Après validation, votre solde sera de {selectedItem ? userInfos.points + selectedItem.Price : null} Piggies.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSession} variant='contained' color="error">Annuler</Button>
          <Button onClick={handleAddSession} variant='contained' color="success">Valider</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnack} autoHideDuration={1000} onClose={handleClose} position="bottom-right" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity={snackData.color} sx={{ width: '100%' }}>
              {snackData.message}
          </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;
