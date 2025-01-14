const db = require('../models');
const Chat = require('../models/Chat.js')(db.sequelize, db.Sequelize);
const { Op } = require('sequelize');

// Add Chat
const addChat = async (req, res) => {
    let { members, timestamp } = req.body;

    try {
        // Log the type and value of members
        console.log('Type of members:', typeof members);
        console.log('Members:', members);

        // Ensure members is an array and contains integers
        if (typeof members === 'string') {
            // Convert the string to an array of integers
            //remove [ ] and split by comma
            members = members.replace(/[\[\]']+/g, '').split(',').map(Number);
            
        }

        if (!Array.isArray(members) || !members.every(Number.isInteger)) {
            return res.status(400).json({ message: 'Members should be an array of integers' });
        }

        const newChat = await Chat.create({
            members,
            timestamp
        });

        return res.status(200).json(newChat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Get Chats
const getChats = async (req, res) => {
    try {
        const chats = await Chat.findAll();

        return res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Get User Chats
const getUserChats = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10); // Ensure userId is an integer
        console.log(`Fetching chats for user ID: ${userId}`); // Debug log

        const chats = await Chat.findAll({
            where: {
                members: {
                    [Op.contains]: [userId]
                }
            }
        });

        console.log(`Found chats: ${JSON.stringify(chats)}`); // Debug log
        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Find Chat
const findChat = async (req, res) => {
    const members = req.query.members ? JSON.parse(req.query.members) : [];

    try {
        const chat = await Chat.findOne({
            where: {
                members: {
                    [Op.contains]: members
                }
            }
        });

        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addChat,
    getChats,
    getUserChats,
    findChat
};
