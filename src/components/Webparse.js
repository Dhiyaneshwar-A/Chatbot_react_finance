import React, { useState } from 'react';
import axios from 'axios';

const WebScraper = () => {
  const [url, setUrl] = useState(''); // To hold the URL entered by the user
  const [content, setContent] = useState(''); // To hold the scraped content
  const [error, setError] = useState(''); // To handle errors
  const [loading, setLoading] = useState(false); // To manage the loading state

  // Function to fetch the content from the given URL when the button is clicked
  const handleScrapeWebsite = async () => {
    if (!url) {
      setError('Please provide a valid URL');
      return;
    }

    setLoading(true); // Start the loading state
    setError(''); // Clear any previous errors

    try {
      const { data } = await axios.get(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`);
      setContent(data.content || 'No content available');
    } catch (err) {
      setError('Error fetching content from the website');
      console.error(err);
    } finally {
      setLoading(false); // End the loading state
    }
  };

  return (
    <div>
      <h2>Web Scraper</h2>
      
      {/* Input for URL */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
        className="url-input"
      />
      
      {/* Button to trigger the scrape website */}
      <br />
      <button onClick={handleScrapeWebsite} className="scrape-button" disabled={loading}>
        {loading ? 'Scraping...' : 'Scrape Website'}
      </button>
      
      {/* Error message display */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Display the scraped content */}
      {content && (
        <div className="scraped-content">
          <h3>Scraped Content:</h3>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default WebScraper;
