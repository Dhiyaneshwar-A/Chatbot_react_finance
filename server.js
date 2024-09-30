const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Please provide a URL to scrape');
  }

  try {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true, // Ensure headless mode is enabled
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-infobars',
        '--hide-scrollbars',
        '--disable-extensions',
      ],
    });

    const page = await browser.newPage();
    console.log('Navigating to:', url);

    // Increase the timeout and wait for more network activity to finish
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });

    // Wait for the body element to ensure content is loaded
    await page.waitForSelector('body');

    // Option 1: Scrape the inner text (original approach)
    // const content = await page.evaluate(() => document.body.innerText);

    // Option 2: Scrape the entire HTML content
    const content = await page.content();  // This fetches the full HTML content of the page

    await browser.close();
    
    // Send back the scraped HTML content
    res.send({ content });
  } catch (error) {
    console.error('Error scraping the website:', error);
    res.status(500).send('Error scraping the website');
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
