module.exports = (sequelize, DataTypes) => {
    
    const Vessel = require('./Vessels')(sequelize, DataTypes);
    
    const Quay = sequelize.define('Quay', {
        qrCode: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        qrCodeHash: {
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
        vessel: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Vessel,
                key: 'id'
            }
        }
    });

    return Quay;
};
