const e = require('express');
const db = require('../models');
const Chat = require('../models/Chat.js')(db.sequelize, db.Sequelize);
const User = require('../models/Users.js')(db.sequelize, db.Sequelize);
const Message = require('../models/Message.js')(db.sequelize, db.Sequelize);
const sequelize = require('sequelize');
const { Op } = require('sequelize');

//Create message
const addMessage = async (req, res) => {
    let { senderId, text, timestamp, chatId} = req.body;

    try {
        const newMessage = await db.Message.create({
            senderId,
            text,
            timestamp,
            chatId
        });

        return res.status(200).json(newMessage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//get messages of chat  
const getMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        console.log(`Fetching messages for chat ID: ${chatId}`); // Debug log

        const messages = await db.Message.findAll({
            where: {
                chatId
            }
        });
//if there are no messages found return 406
        if (!messages) {
            return res.status(406).json({ message: 'No messages found' });
        }
        console.log(`Found messages: ${JSON.stringify(messages)}`); // Debug log
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

//export
module.exports = {
    addMessage,
    getMessages
};
