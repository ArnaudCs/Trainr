import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Market from './Components/Market';
import AuthGuard from './Components/Authguard'; // Importez le composant de garde de route
import Navbar from './Components/Navbar'; // Importez le composant Navbar

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
