import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import Webparse from './components/Webparse';
import './styles.css';

function App() {
  const [scrapedContent, setScrapedContent] = useState('');

  const handleContentFetch = (content) => {
    setScrapedContent(content);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="legaldad.png" alt="LegalAppa Logo" className="logo" />
        <h1 className="main-heading">Welcome to LegalAppa</h1>
        <p className="sub-heading">Your one-stop solution for legal assistance and web scraping.</p>
      </header>

      <main className="App-main">
        <div className="content-container">
          <div className="left-section">
            <h2 className="section-heading">Chatbot Features</h2>
            <p className="description">
              Our intelligent chatbot is designed to assist you with:
            </p>
            <ul className="feature-list">
              <li><strong>24/7 Support:</strong> Get instant responses to your queries anytime.</li>
              <li><strong>Legal Information:</strong> Access a wealth of legal knowledge at your fingertips.</li>
              <li><strong>Personalized Assistance:</strong> Receive tailored advice based on your needs.</li>
              <li><strong>Document Review:</strong> Upload and get feedback on legal documents.</li>
            </ul>
          </div>

          <div className="center-section">
            <h2 className="section-heading">Web Scraping</h2>
            <Webparse onContentFetch={handleContentFetch} />
            
            {scrapedContent && (
              <div className="scraped-content">
                <h3>Scraped Content:</h3>
                <pre>{scrapedContent}</pre>
              </div>
            )}
            <Chatbot/>
          </div>

          <div className="right-section">
            <h2 className="section-heading">Unique Features</h2>
            <p className="description">
              LegalAppa offers unique features to streamline your legal needs:
            </p>
            <ul className="feature-list">
              <li><strong>Document Automation:</strong> Create templates for common legal documents.</li>
              <li><strong>Legal Analytics:</strong> Analyze trends and patterns in legal data.</li>
              <li><strong>Resource Hub:</strong> Access articles, blogs, and resources curated by legal experts.</li>
              <li><strong>Community Forum:</strong> Join discussions and share experiences with others.</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 LegalAppa. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
