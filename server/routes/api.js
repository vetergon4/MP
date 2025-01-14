const express = require('express')
const router = express.Router()
const { expressjwt: jwt } = require("express-jwt");

/* const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
}); */

/* Add database sync function */
const syncDatabase = require('../sync');

/* Add models */
const db = require('../models');

const User = require('../models/Users')(db.sequelize, db.Sequelize);
const Buoy = require('../models/Buoys')(db.sequelize, db.Sequelize);
const Vessel = require('../models/Vessels')(db.sequelize, db.Sequelize);
const Receipt = require('../models/Receipts')(db.sequelize, db.Sequelize);
const Service = require('../models/Service')(db.sequelize, db.Sequelize);
const Chat = require('../models/Chat')(db.sequelize, db.Sequelize);
const Message = require('../models/Message')(db.sequelize, db.Sequelize);


/* Add controllers */
const ctrlAuthentication = require("../controllers/authentication");
const ctrlUser = require("../controllers/users");
const ctrlBuoys = require("../controllers/buoys");
const ctrlVessel = require("../controllers/vessels");
const ctrlReceipts = require("../controllers/receipts");
const ctrlServices = require("../controllers/services");
const ctrlWeather = require("../controllers/weather");
const ctrlChat = require("../controllers/chats");
const ctrlMessage = require("../controllers/messages");

/*Add methods from controllers */
router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);

router.get("/users", ctrlUser.getUsers);
router.get("/users/:id", ctrlUser.getUser);
router.put("/users/:id", ctrlUser.updateUser);
router.delete("/users/:id", ctrlUser.deleteUser);

//methods for buoys
router.get("/buoys/occupied", ctrlBuoys.getOccupiedBuoys);
router.get("/buoys/occupied/users", ctrlBuoys.getOccupiedBuoyUsers);
router.get("/buoys/paid", ctrlBuoys.getNumberOfPaidBuoys);
router.get("/buoys/id/:id", ctrlBuoys.getBuoy);
router.get("/buoys/qrCode/:qrCodeHash", ctrlBuoys.getBuoyByQRCodeHash);
router.get("/buoys/qrData/:qrData", ctrlBuoys.getBuoyByQrData);
router.get("/buoys", ctrlBuoys.getBuoys);
router.post("/buoys", ctrlBuoys.addBuoy);
router.put("/buoys/update/:id", ctrlBuoys.updateBuoy);
router.post("/buoys-populate", ctrlBuoys.populate); //adding buoys to the database
router.delete("/buoys-delete", ctrlBuoys.deleteAllBuoys);


//methods for vessels
//router.get("/vessels/:idVessel/user", ctrlVessel.getVesselUser); //not cool
router.get("/vessels", ctrlVessel.getVessels);
router.get("/vessels/:idVessel", ctrlVessel.getVessel);
router.delete("/vessels/:idVessel", ctrlVessel.deleteVessel);
router.put("/vessels/:idVessel", ctrlVessel.updateVessel);
router.post("/vessels", ctrlVessel.addVessel);

//methods for receipts
router.post("/receipts", ctrlReceipts.addReceipt);
router.get("/receipts", ctrlReceipts.getReceipts);
router.get("/receipts/:idReceipt", ctrlReceipts.getReceiptById);
router.get("/receipts/user/:idUser", ctrlReceipts.getReceiptsByUser);


//methods for services
router.delete("/services/:idService/delete", ctrlServices.deleteService);
router.put("/services/:idService", ctrlServices.updateServiceStatus);
router.post("/services", ctrlServices.addService);
router.get("/services/pending", ctrlServices.getPendingServices);
router.get("/services", ctrlServices.getServices);
router.get("/services/user/:idUsera", ctrlServices.getServicesByUser);
router.get("/services/type/:type", ctrlServices.getServicesByType);
router.get("/services/berth/:idUsera", ctrlServices.getBerthService);
/*
** Stripe payment
*/
router.post("/stripe/create-payment-intent", ctrlServices.stripePayment);
router.post("/stripe/create-checkout-session", ctrlServices.stripeCheckoutSession);

//weather
router.get('/weather', ctrlWeather.getWeather);
router.get('/weather/wind', ctrlWeather.getWind);

//Chats
router.get('/chats', ctrlChat.getChats);
router.get('/chats/user/:userId', ctrlChat.getUserChats);
router.post('/chats', ctrlChat.addChat);
router.get('/chats/find', ctrlChat.findChat);

//Messages
router.post('/messages', ctrlMessage.addMessage);
router.get('/messages/:chatId', ctrlMessage.getMessages);

//Method for syncing database
router.post('/sync', async (req, res) => {
  try {
    // Call your sync function
    await syncDatabase();

    // Send a success response
    res.status(200).json({ message: 'Database synchronized successfully.' });
  } catch (error) {
    console.error('Error synchronizing database:', error);

    // Send an error response
    res.status(500).json({ message: 'An error occurred while synchronizing the database.', error: error.message });
  }
});

router.delete('/delete-data', async (req, res) => {
  try {
    //Delete all data from database with destroy
    await User.destroy({ where: {} });
    await Buoy.destroy({ where: {} });
    await Vessel.destroy({ where: {} });
    await Receipt.destroy({ where: {} });
    await Service.destroy({ where: {} });
    await Chat.destroy({ where: {} });
    await Message.destroy({ where: {} });

    res.status(200).json({ message: 'Data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'An error occurred while deleting data.', error: error.message });
  }
});



module.exports = router;