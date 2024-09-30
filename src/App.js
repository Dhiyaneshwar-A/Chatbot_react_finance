import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Added Link here
import Home from './components/Home';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import './styles.css';
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;
