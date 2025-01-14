const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//import User model
const db = require("../models");
const User = require("../models/Users")(db.sequelize, db.Sequelize);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, cbDone) => {
      try {
        // Find the user by email
        const user = await User.findOne({
          where: { email: username },
        });

        // If the user is not found, provide an error message
        if (!user) {
          return cbDone(null, false, { message: "Incorrect username." });
        }

        // Check if the provided password is valid
        const isPasswordValid = await user.validPassword(password);

        // If the password is not valid, provide an error message
        if (!isPasswordValid) {
          return cbDone(null, false, { message: "Incorrect password." });
        }

        // If both email and password are valid, return the user
        return cbDone(null, user, { message: "Login successful." });
      } catch (err) {
        // Handle other errors
        return cbDone(err);
      }
    }
  )
);
