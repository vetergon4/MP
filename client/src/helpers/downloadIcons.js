const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Directory to save icons
const iconDir = path.join(__dirname, 'weather-icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Base URL for icons
const baseUrl = 'https://openweathermap.org/img/wn/';

// List of all weather condition codes with day/night suffixes
const conditionCodes = [
  '01d', '01n', '02d', '02n', '03d', '03n', '04d', '04n',
  '09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n', '50d', '50n'
];

// Function to download an icon
const downloadIcon = async (code) => {
  const url = `${baseUrl}${code}@2x.png`;
  const filePath = path.join(iconDir, `${code}.png`);
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(filePath));
    console.log(`Downloaded: ${code}.png`);
  } catch (error) {
    console.error(`Failed to download: ${code}.png`, error);
  }
};

// Download all icons
const downloadAllIcons = async () => {
  const downloadPromises = conditionCodes.map(code => downloadIcon(code));
  await Promise.all(downloadPromises);
  console.log('All icons downloaded.');
};

downloadAllIcons();
