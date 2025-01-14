const db = require('../models');
const Service = require('../models/Service.js')(db.sequelize, db.Sequelize);
const User = require('../models/Users.js')(db.sequelize, db.Sequelize);
const Buoy = require('../models/Buoys.js')(db.sequelize, db.Sequelize);
const Receipt = require('../models/Receipts.js')(db.sequelize, db.Sequelize);

const getUser = async (req, res) => {
  // Get user info
  const id = req.params.id;
  if (id) {

    const user = await User.findByPk(id);
    console.log("server, user je: " + user);
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }
    return res.status(200).json(user);

  } else {
    res.status(400).json({ sporocilo: "Id parameter of user wasnt issued." });
  }
};

const updateUser = async (req, res) => {
  const idUsera = req.body.id;

  // Perform validation first
  const validationError = validateRegistrationForm(req);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await User.findByPk(idUsera);
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // Update fields if they exist in req.body
    const fieldsToUpdate = ['name', 'surname', 'personalIdentificationNumber', 'taxNumber', 'email', 'birthday', 'vessel', 'password'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.setPassword(req.body.password);  // Assuming setPassword hashes the password
    }

    await user.save();
    return res.status(200).json({ user, token: user.generateJwt() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUser = (req, res) => {
  const idUsera = req.params.id;
  if (!idUsera) {
    return res.status(404).json({
      message: "Id parameter wasn't issued.",
    });
  }

  // Update receipts with the user id we want to delete
  Receipt.destroy({ where: { user: idUsera } })
    .then(() => {
      // Now that receipts are deleted, delete associated services and buoys
      return Service.findAll({ where: { user: idUsera } });
    })
    .then((services) => {
      return Promise.all(services.map((service) => {
        return Buoy.findByPk(service.buoy)
          .then((buoy) => {
            if (!buoy) {
              return res.status(404).json({ message: 'Buoy not found' });
            }
            buoy.isPaid = false;
            return buoy.save();
          })
          .then(() => service.destroy());
      }));
    })
    .then(() => {
      // Once all services and buoys are deleted, delete the user
      return User.destroy({ where: { id: idUsera } });
    })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      // If user is successfully deleted, send the response
      res.status(204).json(null);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};


const getUsers = (req, res) => {
  // Get all users, sequelize
  User.findAll().then((users) => {
    res.status(200).json(users);
  });
}

//validation function
function validateRegistrationForm(req) {
  const {
    name,
    surname,
    personalIdentificationNumber: pin,
    taxNumber,
    email,
    birthday,
    password
  } = req.body;

  const nameSurnameRegex = /^[A-Za-zšŠžŽćĆčČđĐ]+$/u;
  if (!nameSurnameRegex.test(name) || !nameSurnameRegex.test(surname)) {
    return 'Name and surname must contain only letters';
  }

  const pinRegex = /^\d{13}$/;
  if (!pinRegex.test(pin)) {
    return 'Pin must be 13 digits long';
  }

  const taxNumberRegex = /^\d{8}$/;
  if (!taxNumberRegex.test(taxNumber)) {
    return 'Tax number must be 8 digits long';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }

  const passwordRegex = /^(?=.*[A-Za-zšŠžŽčČćĆ])(?=.*\d).{8,}$/u;
  if (password && !passwordRegex.test(password)) {  // Only validate password if it's provided
    return 'Password must contain at least 8 characters and include at least one number and one letter';
  }

  return null; // No validation errors
}

//get user information based on id, functions receives it as a paramterer. this is not api call
const getUserInformation = async (vesselId) => {
  try {
      // Assuming you have a User model that has a relation to Vessel
      const user = await User.findOne({
          where: { vessel: vesselId }
      });

      if (!user) {
          throw new Error('User not found for vessel ID: ' + vesselId);
      }

      return user;
  } catch (error) {
      throw new Error('Failed to retrieve user information: ' + error.message);
  }
};

module.exports = {
  getUser,
  deleteUser,
  updateUser,
  getUsers,
  getUserInformation
};