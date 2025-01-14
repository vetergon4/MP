module.exports = (sequelize, DataTypes) => {
    const User = require('./Users')(sequelize, DataTypes);

    const Vessel = sequelize.define('Vessel', {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        length: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nameOfVessel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        registernumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numberofPersonOnboard: {
            type: DataTypes.STRING,
            allowNull: false
        },
        captain: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    return Vessel;
};

