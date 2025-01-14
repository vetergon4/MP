const qr = require('qrcode');
const crypto = require('crypto');
const fs = require('fs/promises');

async function generateQRCodeAndHash(buoyNumber) {
    try {
        // Generate a unique string to use as the data for the QR code
        const data = `Buoy${buoyNumber}`;

        // Generate the QR code image and save it to a file
        await qr.toFile(`./qrCodes/qrCode${buoyNumber}.png`, data, {
            color: {
                dark: '#000',  // QR code color
                light: '#fff'  // Background color
            }
        });

        // Generate the hash of the data and save it to a file
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        await fs.writeFile(`./qrCodes/qrCodeHash${buoyNumber}.txt`, hash);

        // Save the data to a file
        await fs.writeFile(`./qrCodes/qrData${buoyNumber}.txt`, data);
    } catch (error) {
        console.error(`Error generating QR code and hash for buoy ${buoyNumber}: ${error}`);
    }
}

async function generateQRCodeAndHashForAllBuoys() {
    for (let i = 1; i <= 20; i++) {
        await generateQRCodeAndHash(i);
    }
}

async function generateQRCodeAndHashForSingleBuoy() {
    try {
        // Generate a unique string to use as the data for the QR code
        const data = Math.random().toString(36).substring(2, 8);

        // Generate the QR code image and save it to a file
        await qr.toFile('./qrCode.png', data, {
            color: {
                dark: '#000',  // QR code color
                light: '#fff'  // Background color
            }
        });

        console.log('QR code saved!');

        // Generate the hash of the data and save it to a file
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        await fs.writeFile('./qrCodeHash.txt', hash);

        console.log('Hash saved!');
    } catch (error) {
        console.error(`Error generating QR code and hash: ${error}`);
    }
}

async function main() {
    await generateQRCodeAndHashForAllBuoys();
    await generateQRCodeAndHashForSingleBuoy();
}

main();
