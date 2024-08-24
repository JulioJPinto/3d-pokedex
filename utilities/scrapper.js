const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Ensure the downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Function to download a file with retry logic
async function downloadFile(url, filename, retries = 3) {
    const filePath = path.join(downloadsDir, filename);
    const writer = fs.createWriteStream(filePath);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000, // Set a timeout of 10 seconds
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying download for ${url}. Attempts left: ${retries - 1}`);
            return downloadFile(url, filename, retries - 1);
        } else {
            console.error(`Failed to download ${url} after multiple attempts.`);
        }
    }
}

// Function to fetch and process the webpage
async function fetchAndProcessPage(url) {
    try {
        // Fetch the HTML content of the page
        const { data: html } = await axios.get(url);

        // Load the HTML content into Cheerio
        const $ = cheerio.load(html);

        // Select all divs with the class 'updatesheeticons'
        const divs = $('div.updatesheeticons');

        // Ensure there are at least two divs with this class
        if (divs.length < 2) {
            console.log('Less than two divs with class "updatesheeticons" found.');
            return;
        }

        // Select the second div (index 1)
        const secondDiv = divs.eq(1);

        // Find all anchor tags within this div
        const hrefs = [];
        secondDiv.find('a').each((i, elem) => {
            const href = $(elem).attr('href');
            if (href) {
                hrefs.push(href);
            }
        });

        const numbers = hrefs.map(href => {
            // Use a regular expression to find the number after 'model/'
            const match = href.match(/model\/(\d+)/);
            return match ? match[1] : null;
        }).filter(num => num !== null);

        // Generate the download URLs
        const urls = numbers.map(num => `https://www.models-resource.com/download/${num}/`);

        // Download each file with error handling
        for (let i = 0; i < urls.length; i++) {
            const fileUrl = urls[i];
            const filename = `file_${i + 1}.zip`;
            console.log(`Downloading ${fileUrl} to ${filename}`);
            await downloadFile(fileUrl, filename);
        }

        console.log('All files downloaded successfully.');

    } catch (error) {
        console.error('Error fetching or processing the page:', error.message);
    }
}

// Use the function with your desired URL
const url = 'https://www.models-resource.com/3ds/pokemonxy/?source=genre';  // Replace with the actual URL
fetchAndProcessPage(url);
