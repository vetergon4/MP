'use strict';

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    members: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Using ARRAY for array storage in PostgreSQL
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Chat; // Make sure to return the model
};
