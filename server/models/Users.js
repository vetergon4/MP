const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    personalIdentificationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      msg: 'Personal identification number must be unique'
    },
    taxNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      msg: 'Tax number must be unique'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      msg: 'Email must be unique'
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    vessel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  User.prototype.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  };

  User.prototype.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  };

  User.prototype.generateJwt = function () {
    //console.log('Generating JWT');
    //console.log('JWT: ' + process.env.JWT_SECRET);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    
    return jwt.sign(
      {
        id: this.id, // Assuming 'id' is the primary key column in your MySQL model
        email: this.email,
        name: this.name,
        surname: this.surname,
        personalIdentificationNumber: this.personalIdentificationNumber,
        taxNumber: this.taxNumber,
        birthday: this.birthday,
        vessel: this.vessel,
        exp: parseInt(expiry.getTime() / 1000)
      },
      process.env.REACT_APP_JWT_SECRET
      );
  };

  return User;
};

