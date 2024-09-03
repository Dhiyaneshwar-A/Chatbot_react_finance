// src/App.js
import React from 'react';
import Chatbot from './components/Chatbot';
import './styles.css'; // Import your styles

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="legaldad.png" alt="LegalAppa Log" className="logo" />
      </header>
      <Chatbot />
    </div>
  );
}

export default App;
