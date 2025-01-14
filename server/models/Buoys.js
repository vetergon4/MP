module.exports = (sequelize, DataTypes) => {

    const Vessel = require('./Vessels')(sequelize, DataTypes);

    const Buoy = sequelize.define('Buoy', {
        qrCode: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        qrCodeHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        qrData: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lat: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        lng: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        vessel: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    });


    return Buoy;
};
