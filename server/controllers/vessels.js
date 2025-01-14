const db = require('../models');
const User = require('../models/Users.js')(db.sequelize, db.Sequelize);
const Vessel = require('../models/Vessels.js')(db.sequelize, db.Sequelize);
const Buoy = require('../models/Buoys.js')(db.sequelize, db.Sequelize);
const Receipt = require('../models/Receipts.js')(db.sequelize, db.Sequelize);

const getVessels = async (req, res) => {
  try {
    const vessels = await Vessel.findAll();

    return res.status(200).json(vessels);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sporocilo: 'Internal Server Error' });
  }
};


//add vessel
const addVessel = async (req, res) => {
  const idUsera = req.body.id;

  try {
    const user = await User.findByPk(idUsera);

    if (!user) {
      return res.status(404).json({ sporocilo: 'This user doesnt exist' });
    }

    // Create new vessel
   // console.log(req.body);
    const newVessel = await Vessel.create({
      type: req.body.type,
      length: req.body.length,
      nameOfVessel: req.body.nameOfVessel,
      registernumber: req.body.registernumber,
      numberofPersonOnboard: req.body.numberofPersonOnboard,
      captain: user.id, // Assuming captain is a foreign key in the Vessel model
    });

    // Update the user's vessel attribute with the new vessel ID
    user.vessel = newVessel.id;
    await user.save();

    return res.status(200).json({newVessel, user, token: user.generateJwt() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sporocilo: 'Internal Server Error' });
  }
};

// Update vessel
const updateVessel = async (req, res) => {
  const idVessel = req.body.idVessel;

  try {
    const vessel = await Vessel.findByPk(idVessel);

    if (!vessel) {
      return res.status(404).json({ sporocilo: 'This vessel doesnt exist' });
    }

    // Update vessel attributes based on req.body
    if (req.body.type) {
      vessel.type = req.body.type;
    }
    if (req.body.length) {
      vessel.length = req.body.length;
    }
    if (req.body.nameOfVessel) {
      vessel.nameOfVessel = req.body.nameOfVessel;
    }
    if (req.body.registernumber) {
      vessel.registernumber = req.body.registernumber;
    }
    if (req.body.numberofPersonOnboard) {
      vessel.numberofPersonOnboard = req.body.numberofPersonOnboard;
    }

    // Save the updated vessel
    await vessel.save();

    return res.status(200).json(vessel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sporocilo: 'Internal Server Error' });
  }
};

// Delete vessel 
const deleteVessel = async (req, res) => {
  const idVessel = req.body.idVessel;
  console.log("server id : " + idVessel);
  try {
    const vessel = await Vessel.findByPk(idVessel);

    if (!vessel) {
      return res.status(404).json({ sporocilo: 'This vessel doesnt exist' });
    }

    const captainId = vessel.captain;

    if (captainId !== null) {
      // Find the associated user and update their vessel to -1
      const user = await User.findByPk(captainId);
      console.log("user: " + user);
      if (user) {
        await user.update({ vessel: null });

        res.status(200).json({ token: user.generateJwt() });

      }else {
        return res.status(404).json({ sporocilo: 'This user doesnt exist' });
      }
    }
    else {
      return res.status(404).json({ sporocilo: 'This captain doesnt exist' });
    }
    // Delete the vessel
  //  await vessel.destroy();

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sporocilo: 'Internal Server Error' });
  }
};


//get vessel
const getVessel = async (req, res) => {
  
  const idVessel = req.params.idVessel;
  //console.log("na serverju je to id: " +  idVessel);
  try {
    const vessel = await Vessel.findByPk(idVessel);

    if (!vessel) {
      console.log('Vessel not found');
      return res.status(404).json({ sporocilo: 'This vessel doesnt exist' });
    }

  //  console.log('Sending Vessel information:', vessel);
    return res.status(200).json(vessel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sporocilo: 'Internal Server Error' });
  }
};

//not cool
const getVesselUser = async (req, res) => {
  const idVessel = req.params.idVessel;
 console.log("idVessel: " + idVessel);
  //find vessel with this id and return its captain
  try {
    const vessel = await Vessel.findByPk(idVessel);

    if (!vessel) {
      console.log('Vessel not found');
      return res.status(404).json({ sporocilo: 'This vessel doesnt exist' });
    }

    const captain = await User.findByPk(vessel.captain);

    if (!captain) {
      console.log('Captain not found');
      return res.status(404).json({ sporocilo: 'This captain doesnt exist' });
    }

    return res.status(200).json(captain);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ sporocilo: 'Internal Server Error' });
  }

};

//export functions
module.exports = {
  getVessels,
  getVessel,
  addVessel,
  updateVessel,
  deleteVessel,
  getVesselUser
};