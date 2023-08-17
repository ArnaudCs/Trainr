import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Purchase from './Components/Purchase';
import Market from './Components/Market';
import Casino from './Components/Casino';
import Sessions from './Components/Sessions';
import AuthGuard from './Components/Authguard'; // Importez le composant de garde de route
import Navbar from './Components/Navbar'; // Importez le composant Navbar
import './Components/CSS/App.css'; // Importez le fichier CSS

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<AuthGuard element={<Home />} />}
          />          
          <Route
            path="/login"
            element={<AuthGuard element={<Login />} />}
          />
          <Route
            path="/register"
            element={<AuthGuard element={<Register />} />}
          />
          <Route
            path="/market"
            element={<AuthGuard element={<Market />} />}
          />
          <Route
            path="/purchase"
            element={<AuthGuard element={<Purchase />} />}
          />
          <Route
            path="/casino"
            element={<AuthGuard element={<Casino />} />}
          />
          <Route
            path="/sessions"
            element={<AuthGuard element={<Sessions />} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
