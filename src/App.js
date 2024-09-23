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
        <h1>Welcome to LegalAppa</h1>
      </header>

      <main>
        <section>
          <h2>Website Content</h2>
          <Webparse onContentFetch={handleContentFetch} />
          {scrapedContent && (
            <div>
              <h3>Scraped Content:</h3>
              <pre>{scrapedContent}</pre>
            </div>
          )}
        </section>

        <section>
          <h2>Chatbot</h2>
          <Chatbot />
        </section>
      </main>

      <footer>
        <p>&copy; 2024 LegalAppa. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
