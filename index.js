const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs').promises;

async function performScraping() {
    try {
        const response = await axios.get('https://www.teeda.com/blogs/articles/how-many-of-each-ring-size-should-i-stock', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // Capture the larger part of the HTML that includes the ring size information
        // The text of the entire content
        const content = $('.blog-post-description').parent().text();

        // Regular expressions to match the sizes
        const ringSizeRegex = /Size\s(\d+)\s[–-]\s(\d+)%/g;
        let match;
        const allRingSizes = [];

        // Find all matches and push them into the allRingSizes array
        while ((match = ringSizeRegex.exec(content)) !== null) {
            allRingSizes.push({
                size: parseInt(match[1], 10),
                percentage: parseInt(match[2], 10)
            });
        }

        // Start of men's ring array
        const menStartIndex = allRingSizes.findIndex(ring => ring.size === 9 && ring.percentage === 25);

        // Split the array into women's and men's
        const womensRingSizes = allRingSizes.slice(0, menStartIndex);
        const mensRingSizes = allRingSizes.slice(menStartIndex);

        const data = {
            womens: womensRingSizes,
            mens: mensRingSizes
        };

        // Convert data object to JSON string
        const jsonContent = JSON.stringify(data, null, 2);

        // Write JSON string to file
        await fs.writeFile('ring-sizes.json', jsonContent);

        console.log('Ring sizes have been saved to ring-sizes.json');
        return data;
    } catch (error) {
        console.error('Error performing scraping:', error);
        return { womens: [], mens: [] };
    }
}

performScraping();

module.exports.performScraping = performScraping;