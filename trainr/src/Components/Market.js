import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importez Axios
import Cookies from 'js-cookie';
import './CSS/Market.css'; // Importez le fichier CSS
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import LoadingScreen from './LoadingScreen';
import Grid from '@mui/material/Grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, TextField, Button, Snackbar, Alert  } from '@mui/material';
import Slide from '@mui/material/Slide';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Market() {
  const [marketItems, setMarketItems] = useState([]);
  const [userInfos, setUserInfos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Ajoutez l'état isLoading
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openValidation, setOpenValidation] = React.useState(false);


  const [modifyData, setModifyData] = useState({
      idItem: '',
      modifyName: '',
      modifyDescription: '',
      modifyPrice: '',
  });

  const [snackData, setSnackData] = useState({
      message: '',
      color: '',
  });

  const [deleteData, setDeleteData] = useState({
      idItem: '',
      idUser: '',
  });

  const [buyData, setBuyData] = useState({
      idUser: '',
      idItem: '',
      idPrice: '',
      date: '',
  });

  const handleChange = (event) => {
      const { name, value } = event.target;
      setModifyData((prevData) => ({ ...prevData, [name]: value }));
      setSnackData((prevData) => ({ ...prevData, [name]: value }));
      setBuyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setModifyData({
      idItem: item.idItem,
      modifyName: item.Name,
      modifyDescription: item.Description,
      modifyPrice: item.Price,
    });
    setDeleteData({
      idItem: item.idItem,
      idUser: userInfos.userId,
    });
    setOpen(true);
  };
  
  const handleClickOpenBuy = (item) => {
    setSelectedItem(item);
    setBuyData({
      idUser: userInfos.userId,
      idItem: item.idItem,
      Price: item.Price,
      date: new Date(),
      itemName: item.Name,
      newSoldes: userInfos.points - item.Price,
    });
    setOpenValidation(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseBuy = () => {
    setOpenValidation(false);
  };

  const handleSubmit = async () => {
    const token = Cookies.get('token');

    if(modifyData.modifyName !== '' && modifyData.modifyDescription !== '' && modifyData.modifyPrice !== '') {
      try {
        const response = await axios.post('http://localhost:3000/modify-item', modifyData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);
        if (response.data.message === 'Item modifié avec succès') {
          setOpenSnack(true);
          setSnackData({
            message: 'Item modifié avec succès, rechargement',
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

  const handleBuy = async () => {
    const token = Cookies.get('token');

    if(userInfos.points >= selectedItem.Price) {
      try {
        const response = await axios.post('http://localhost:3000/buy-item', buyData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);
        if (response.data.message === 'Achat réalisé avec succès') {
          setOpenSnack(true);
          setSnackData({
            message: 'Achat réalisé avec succès, rechargement',
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

  const handleDelete = async () => {
    const token = Cookies.get('token');
    console.log(deleteData);
    try {
      const response = await axios.post('http://localhost:3000/delete-item', deleteData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      if (response.data.message === 'Item supprimé avec succès') {
        setOpenSnack(true);
        setSnackData({
          message: 'Item supprimé avec succès, rechargement',
          color: 'success',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          <p className='pointSold'>{userInfos.points}<SavingsTwoToneIcon style={{ marginLeft: '5px' }}></SavingsTwoToneIcon></p>
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
                    </CardContent>
                    <CardActions className='cardActions'>
                      {!userInfos.isAdmin ? (
                        <Button className='buyButton' disabled={userInfos.points < item.Price && userInfos.isAdmin === 0} startIcon={<ShoppingCartIcon />} variant='contained' size='large' onClick={() => handleClickOpenBuy(item)} >Acheter</Button>
                      ) : null}

                      {userInfos.isAdmin ? (
                        <Button className='buyButton' startIcon={<EditIcon />} variant='contained' size='large' onClick={() => handleClickOpen(item)}>Modifier</Button>
                      ) : null}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </div>

      {/* Buy dialog */}
      <Dialog
        open={openValidation}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseBuy}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{fontWeight: 700}}>{"Valider l'achat ?"}</DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-slide-description" className='dialogText'>
            Voulez-vous vraiment acheter "{selectedItem ? selectedItem.Name : null}" pour {selectedItem ? selectedItem.Price : null} Piggies ? Cette action est irréversible, aucun remboursement n'est possible.
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description" className='dialogText'>
            Après achat, votre solde sera de {selectedItem ? userInfos.points - selectedItem.Price : null} Piggies.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBuy} variant='contained' color="error">Annuler</Button>
          <Button onClick={handleBuy} variant='contained' color="success">Valider</Button>
        </DialogActions>
      </Dialog>

      {/* modification dialog */}
      <Dialog open={open} onClose={handleClose} className='Dialog'>
        <DialogTitle>Modification de l'item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedItem ? selectedItem.Name : null}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="modifyName"
            onChange={handleChange}
            value={modifyData.modifyName}
            label="Nom de l'item"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            name="modifyDescription"
            onChange={handleChange}
            value={modifyData.modifyDescription}
            label="Description de l'item"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            name="modifyPrice"
            value={modifyData.modifyPrice}
            label="Prix de l'item"
            onChange={handleChange}
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} variant='contained' color="warning">Supprimer</Button>
          <Button onClick={handleClose} variant='contained' color="error">Annuler</Button>
          <Button onClick={handleSubmit} variant='contained' color="success">Modifier</Button>
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


export default Market;

