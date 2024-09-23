// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS for client-side requests

app.get('/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Please provide a URL to scrape');
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });  // Wait until the page is fully loaded

    // Extract text content from the website (modify as needed)
    const content = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();
    res.send({ content });
  } catch (error) {
    console.error('Error scraping the website:', error);
    res.status(500).send('Error scraping the website');
  }
});

const port = 3001;  // You can change this port number if needed
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
