const db = require('./models'); // Adjust the path as necessary

async function syncDatabase() {
    try {
        await db.sequelize.sync({ force: false });
        console.log('Database synced successfully.');
    } catch (err) {
        console.error('Error syncing database:', err);
        throw err;
    }
}

module.exports = syncDatabase;
