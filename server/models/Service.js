//sequilze model for Service which has attributes: type, user, vessel, date, time, status, price
module.exports = (sequelize, DataTypes) => {
    const User = require('./Users')(sequelize, DataTypes);
    const Vessel = require('./Vessels')(sequelize, DataTypes);
    const Buoy = require('./Buoys')(sequelize, DataTypes);

    const Service = sequelize.define('Service', {
//type - can be of type: berth, fuel, trash waste
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        vessel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buoy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Service;
}