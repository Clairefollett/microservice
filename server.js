const express = require('express');
const app = express();
const port = 3000; // You can choose any port that's available

// Grab performScraping function
const { performScraping } = require('./index'); 

// GET endpoint to trigger the scraping and return JSON data
app.get('/scrape-rings', async (req, res) => {
    try {
        const ringSizes = await performScraping();
        res.json(ringSizes);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).send('Error occurred while scraping: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});