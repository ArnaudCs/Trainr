import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './CSS/Home.css'; // Importez le fichier CSS

function Home() {
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
    <div className='MainHome'>
      <h1>Bonjour {userInfos.firstName} {userInfos.name}, prêt pour votre séance ? </h1>
      <p>This is the content of the home page.</p>
      <p>{userInfos.name}</p>
    </div>
  );
}

export default Home;
