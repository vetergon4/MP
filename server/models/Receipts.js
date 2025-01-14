//receipt is a model for receipt for orders so it contains attributes:
//array of orders, total price, date, time, user, vessel, buoy
module.exports = (sequelize, DataTypes) => {
    const User = require('./Users')(sequelize, DataTypes);
    const Vessel = require('./Vessels')(sequelize, DataTypes);
    const Buoy = require('./Buoys')(sequelize, DataTypes);
    const Order = require('./Service')(sequelize, DataTypes);

    const Receipt = sequelize.define('Receipt', {
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        vessel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Vessel,
                key: 'id'
            }
        },
        buoy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Buoy,
                key: 'id'
            }
        },
        //blob for PDF file of receipt
        pdf: {
            type: DataTypes.BLOB,
            allowNull: true
        }
    });

    return Receipt;
}