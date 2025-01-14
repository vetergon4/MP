const e = require('express');
const db = require('../models');
const Receipt = require('../models/Receipts.js')(db.sequelize, db.Sequelize);
const User = require('../models/Users.js')(db.sequelize, db.Sequelize);
const Vessel = require('../models/Vessels.js')(db.sequelize, db.Sequelize);
const Buoy = require('../models/Buoys.js')(db.sequelize, db.Sequelize);

//add receipt
const addReceipt = async (req, res) => {
const { idUsera, idVessel, idBuoy, totalPrice, pdf } = req.body;

    // ... (rest of your code)

    try {
        const newReceipt = await Receipt.create({
            totalPrice: totalPrice,
            date: new Date(),
            user: idUsera,
            vessel: idVessel,
            buoy: idBuoy,
            pdf: pdf
        });

        return res.status(200).json({ message: 'Receipt added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


//get all receipts
const getReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.findAll();

        return res.status(200).json(receipts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//get receipt by id
const getReceiptById = async (req, res) => {
    const idReceipt = req.params.idReceipt;

    try {
        const receipt = await Receipt.findByPk(idReceipt);

        if (!receipt) {
            return res.status(404).json({ message: 'This receipt doesnt exist' });
        }

        return res.status(200).json(receipt);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//get receipts from specific user if params.idUsera equals to receipt.user add it to array
const getReceiptsByUser = async (req, res) => {
    const idUser = req.params.idUser;
    const receipts = await Receipt.findAll();
    const userReceipts = [];
    
    try {
        for (let i = 0; i < receipts.length; i++) {
            if (receipts[i].user == idUser) {
                userReceipts.push(receipts[i]);
            }
        }

        return res.status(200).json(userReceipts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addReceipt,
    getReceipts,
    getReceiptById,
    getReceiptsByUser,
};
