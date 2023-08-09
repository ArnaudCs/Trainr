import React from 'react';
import './CSS/Loading.css'; // Importez le fichier CSS
import Lottie from 'react-lottie';
import * as animationData from '../Data/loading.json'

function Home() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default, // Assurez-vous de prendre la propriété 'default' de l'objet importé
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className='MainLoading'>
      {/* Utilisez le composant Lottie avec les options par défaut */}
      <div className='panda'>
        <Lottie options={defaultOptions}/>
      </div>
    </div>
  );
}

export default Home;
