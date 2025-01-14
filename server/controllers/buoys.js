const db = require('../models');
const Buoy = require('../models/Buoys.js')(db.sequelize, db.Sequelize);
//import necessary modules
const fs = require('fs');
const path = require('path');

//import get user information
const { getUserInformation } = require('./users');
//run populate buoys

const populate = async (req, res) =>  {
    try {
        await createBuoys();
        res.status(200).send('Buoys created successfully');
    } catch (error) {
        res.status(500).send('Error creating buoys: ' + error.message);
    }
}

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


const addBuoy = async (req, res) => {

    try {
        // Create a new buoy object with the buoy data
        const buoy = new Buoy({
            qrCode: req.body.qrCode,
            qrCodeHash: req.body.qrCodeHash,
            lat: req.body.lat,
            lng: req.body.lng,
            isPaid: req.body.isPaid,
            vessel: req.body.vessel,
            price: req.body.price
        });

        // Save the buoy to the database
        await buoy.save();

        // Send a success response with the buoy object
        res.status(201).json({ message: 'Buoy added successfully', buoy });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to add buoy', error: error.message });
    }

}

const updateBuoy = async (req, res) => {
    try {


        // Find the buoy with the specified pk
        const buoy = await Buoy.findByPk(req.params.id);
        // Update the buoy's properties if they are present in req.body
        if (req.body.qrCode) {
            buoy.qrCode = req.body.qrCode;
        }
        if (req.body.qrCodeHash) {
            buoy.qrCodeHash = req.body.qrCodeHash;
        }
        if (req.body.lat) {
            buoy.lat = req.body.lat;
        }
        if (req.body.lng) {
            buoy.lng = req.body.lng;
        }
        if (req.body.isPaid !== undefined) {
            buoy.isPaid = req.body.isPaid;
        }
        if (req.body.vessel) {
            buoy.vessel = req.body.vessel;
        }
        if (req.body.price) {
            buoy.price = req.body.price;
        }

        // Save the buoy to the database
        await buoy.save();

        // Send a success response with the buoy object
        res.status(200).json({ message: 'Buoy updated successfully', buoy });
    } catch (error) {
        // Send an error response
        console.log(error);
        res.status(500).json({ message: 'Failed to update buoy', error: error.message });
    }
}

const getBuoys = async (req, res) => {
    try {
        const buoys = await Buoy.findAll();

        if (buoys.length === 0) {
            return res.status(404).json({ message: 'No buoys found' });
        }

        res.status(200).json(buoys);
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to retrieve buoys', error: error.message });
    }
};

const getBuoyByQRCodeHash = async (req, res) => {
    try {
        // Find the buoy with the specified QR code hash in the database
        const buoy = await Buoy.findOne({ qrCodeHash: req.params.qrCodeHash });

        if (!buoy) {
            return res.status(404).json({ message: 'Buoy not found' });
        }

        // Send a success response with the buoy object
        res.status(200).json({ message: 'Buoy retrieved successfully', buoy });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to retrieve buoy', error: error.message });
    }
};

const getBuoy = async (req, res) => {

    try {
        // Find the buoy with the pk
        const buoy = await Buoy.findByPk(req.params.id);

        // Send a success response with the buoy object
        res.status(200).json({ message: 'Buoy retrieved successfully', buoy });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to retrieve buoy', error: error.message });
    }
};

const getBuoyByQrData = async (req, res) => {
    try {
        // Find the buoy in database which attribute "qrData" is equal to the qrData in the request
        const buoy = await Buoy.findOne({ where: { qrData: req.params.qrData } });

        // Send a success response with just the buoy object
        res.status(200).json(buoy);
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to retrieve buoy', error: error.message });
    }
};


// get number of buoy that are paid
const getNumberOfPaidBuoys = async (req, res) => {

    try {
        const buoys = await Buoy.findAll();
        let count = 0;
        buoys.forEach(buoy => {
            if (buoy.isPaid) {
                count++;
            }
        });
        res.status(200).json(count);
    } catch (error) {
        console.error("Error fetching buoys: " + error);
    }
}

//delete all buoys
const deleteAllBuoys = async (req, res) => {
    try {
        await Buoy.destroy({ where: {} });
        res.status(200).json({ message: 'All buoys deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete all buoys', error: error.message });
    }
};


// Get array of users which have occupied buoy - got hrough all buoys in database, 
//for each id get user information and store user object in array
//not cool
const getBuoyUsers = async (req, res) => {
    try {
        const buoys = await Buoy.findAll();
        const users = [];

        for (let i = 0; i < buoys.length; i++) {
            const buoy = buoys[i];
            if (buoy.vessel) {
                //find which user has this vessel and store it in array

            }
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
    }
}

// Get array of buoys which have vessel > 0 - return array of those vessels
const fetchOccupiedBuoys = async () => {
    try {
        const buoys = await Buoy.findAll();
        const occupiedBuoys = [];

        for (let i = 0; i < buoys.length; i++) {
            const buoy = buoys[i];
            if (buoy.vessel > 0) {
                occupiedBuoys.push(buoy.vessel);
            }
        }

        return occupiedBuoys;
    } catch (error) {
        throw new Error('Failed to retrieve occupied buoys: ' + error.message);
    }
};

const getOccupiedBuoys = async (req, res) => {
    try {
        const occupiedBuoys = await fetchOccupiedBuoys();
        res.status(200).json(occupiedBuoys);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve occupied buoys', error: error.message });
    }
};


// Go through all users and check which user has vessel with id from return array of getOccupiedBuoys function, return those users
const getOccupiedBuoyUsers = async (req, res) => {
    try {
        console.log("Trying to get occupied buoys users");
        const occupiedBuoys = await fetchOccupiedBuoys();
        console.log("Occupied buoys: " + occupiedBuoys);
        const users = [];

        for (let i = 0; i < occupiedBuoys.length; i++) {
            console.log("Occupied buoy: " + occupiedBuoys[i]);
            
            const user = await getUserInformation(occupiedBuoys[i]);
            //First check if this user.id is in one of the users in array
            let found = false;
            for (let j = 0; j < users.length; j++) {
                if (users[j].id === user.id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                users.push(user);
            }
        }
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
    }
}

// Export the addBuoy, getBuoys, and getBuoy functions
module.exports = { populate, addBuoy, updateBuoy, getBuoys, getBuoy, getBuoyByQRCodeHash, getBuoyByQrData, getNumberOfPaidBuoys, deleteAllBuoys, getOccupiedBuoys, getOccupiedBuoyUsers };
