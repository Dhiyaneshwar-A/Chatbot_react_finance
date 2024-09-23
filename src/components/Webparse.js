import React, { useState } from 'react';
import axios from 'axios';

const WebScraper = () => {
  const [url, setUrl] = useState(''); // To hold the URL entered by the user
  const [content, setContent] = useState(''); // To hold the scraped content
  const [error, setError] = useState(''); // To handle errors

  // Function to fetch the content from the given URL when button is clicked
  const handleFetchContent = async () => {
    if (!url) {
      setError('Please provide a valid URL');
      return;
    }

    try {
      const { data } = await axios.get(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`);
      setContent(data.content || 'No content available');
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Error fetching content from the website');
      console.error(err);
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
      
      {/* Button to trigger the fetch content */}
      <button onClick={handleFetchContent} className="fetch-button">
        Fetch Content
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
