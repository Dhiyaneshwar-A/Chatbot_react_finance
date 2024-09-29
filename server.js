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

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
    await page.waitForSelector('body');

    const content = await page.evaluate(() => document.body.innerText);

    await browser.close();
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
