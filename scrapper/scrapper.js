const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base URL
const baseURL = 'https://www.models-resource.com/download/';
// Folder where files will be saved
const folderPath = './downloads';

// Ensure the downloads folder exists
if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath);
}

// Function to download a file
const downloadFile = async (url, filename) => {
    const filePath = path.join(folderPath, filename);
    const writer = fs.createWriteStream(filePath);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download file: ${url}`);
        console.error(error);
    }
};

// Function to scrape and download files
const scrapeAndDownload = async () => {
    for (let i = 0; i <= 151; i++) {
        const url = `${baseURL}${i+9318}/`;
        
        try {
            const response = await axios.get(url);

            // Check if the response is valid
            if (response.status === 200) {
                const filename = `file_${i}.zip`; // Adjust the file extension as needed
                console.log(`Downloading ${filename} from ${url}`);
                await downloadFile(url, filename);
            } else {
                console.log(`No file found at ${url}`);
            }
        } catch (error) {
            console.error(`Failed to access ${url}`);
        }
    }
};

// Start the scraping and downloading process
scrapeAndDownload();
