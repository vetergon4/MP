const passport = require("passport");
const db = require('../models');
const User = require('../models/Users')(db.sequelize, db.Sequelize);



const register = async (req, res) => {
 //console.log("Doing registration.");
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.pin ||
    !req.body.taxNumber ||
    !req.body.email ||
    !req.body.birthday ||
    !req.body.password
  ) {
    console.log("All fields required.");
    return res.status(400).json({ message: "All fields required." });
  } else if (
    req.body.name &&
    req.body.surname &&
    req.body.pin &&
    req.body.taxNumber &&
    req.body.email &&
    req.body.birthday &&
    req.body.password
  ) {
    //check regex of attributes
    const validationError = validateRegistrationForm(req);
    if (validationError) {
      console.log(validationError);
      return res.status(400).json({ message: validationError });
    } else {
      //console.log(req.body);
      const user = new User();
      user.name = req.body.name;
      user.surname = req.body.surname;
      user.personalIdentificationNumber = req.body.pin;
      user.taxNumber = req.body.taxNumber;
      user.email = req.body.email;
      user.birthday = req.body.birthday;
      user.vessel = 0;
      user.setPassword(req.body.password);

      try {
        await user.save();

        res.status(200).json({ token: user.generateJwt() });
      } catch (err) {
        if (err.name === 'SequelizeValidationError') {
          //console.error('Validation errors:', err.errors);
          res.status(400).json({ message: 'Validation error', errors: err.errors });
        } else {
          console.error('Error saving user:', err);
          res.status(500).json({ message: err.message });
        }
      }
    }
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    let token;
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      token = user.generateJwt();
      res.status(200).json({ token });
    } else {
      res.status(401).json(info);
    }
  })(req, res, next);  // Pass the `next` function to `passport.authenticate`
};


function validateRegistrationForm(req) {
  const {
    name,
    surname,
    pin,
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
  if (!passwordRegex.test(password)) {
    return 'Password must contain atleast 8 characters and atleast one number and one letter';
  }

  return null; // No validation errors
}

module.exports = {
  register,
  login,
};