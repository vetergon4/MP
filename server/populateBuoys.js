const fs = require('fs');
const path = require('path');
const db = require('./models/index');
const Buoy = require('./models/Buoys')(db.sequelize, db.Sequelize);;

async function createBuoys() {
  const buoys = [
    { lat: 43.686200, lng: 15.707616, title: 'Buoy 1' },
    { lat: 43.686417, lng: 15.707937, title: 'Buoy 2' },
    { lat: 43.686632, lng: 15.708313, title: 'Buoy 3' },
    { lat: 43.686892, lng: 15.708632, title: 'Buoy 4' },
    { lat: 43.687124, lng: 15.708969, title: 'Buoy 5' },
    { lat: 43.686875, lng: 15.709321, title: 'Buoy 6' },
    { lat: 43.686614, lng: 15.708992, title: 'Buoy 7' },
    { lat: 43.686394, lng: 15.708624, title: 'Buoy 8' },
    { lat: 43.686139, lng: 15.708296, title: 'Buoy 9' },
    { lat: 43.685861, lng: 15.707920, title: 'Buoy 10' },
    { lat: 43.685646, lng: 15.708170, title: 'Buoy 11' },
    { lat: 43.685890, lng: 15.708507, title: 'Buoy 12' },
    { lat: 43.686111, lng: 15.708844, title: 'Buoy 13' },
    { lat: 43.686348, lng: 15.709204, title: 'Buoy 14' },
    { lat: 43.686111, lng: 15.709478, title: 'Buoy 15' },
    { lat: 43.685912, lng: 15.709172, title: 'Buoy 16' },
    { lat: 43.685621, lng: 15.708743, title: 'Buoy 17' },
    { lat: 43.685473, lng: 15.708431, title: 'Buoy 18' },
    { lat: 43.685249, lng: 15.708767, title: 'Buoy 19' },
    { lat: 43.685411, lng: 15.709059, title: 'Buoy 20' },
  ];

  for (let i = 0; i < buoys.length; i++) {
    const buoy = buoys[i];

    // Read the QR code image and hash from the files
    const qrCode = fs.readFileSync(path.join(__dirname, 'qrCodes', `qrCode${i + 1}.png`));
    const qrCodeHash = fs.readFileSync(path.join(__dirname, 'qrCodes', `qrCodeHash${i + 1}.txt`), 'utf8');
    const qrData = fs.readFileSync(path.join(__dirname, 'qrCodes', `qrData${i + 1}.txt`), 'utf8');

    // Create the buoy in the database
    await Buoy.create({
      qrCode,
      qrCodeHash,
      qrData,
      lat: buoy.lat,
      lng: buoy.lng,
      price: 50, 
      isPaid: false,
      vessel: null,
    });
  }
}

createBuoys().catch(console.error);

