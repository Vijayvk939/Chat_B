const { messages, users } = require("../models");
const { ReE, ReS } = require("../services/util.service");
const { Op } = require("sequelize");

const sendMessage = async function (req, res) {
    let { receiverId, content } = req.body;
    let senderId = req.user.id;

    if (!receiverId || !content) {
        return ReE(res, "Receiver ID and content are required", 400);
    }

    try {
        const newMessage = await messages.create({
            senderId,
            receiverId,
            content,
            isDelivered: false,
        });

        return ReS(res, { message: "Message sent successfully", data: newMessage });
    } catch (error) {
        return ReE(res, error.message, 500);
    }
};

module.exports.sendMessage = sendMessage;

const getMessages = async function (req, res) {
    let userId = req.user.id;

    if (!userId) {
        return ReE(res, "User ID is required", 400);
    }

    try {
        const chatHistory = await messages.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            order: [["createdAt", "ASC"]],
            include: [
                { model: users, as: "sender", attributes: ["id", "firstName", "lastName"] },
                { model: users, as: "receiver", attributes: ["id", "firstName", "lastName"] }
            ]
        });

        return ReS(res, { chatHistory });
    } catch (error) {
        return ReE(res, error.message, 500);
    }
};

module.exports.getMessages = getMessages;


const markMessageSeen = async function (req, res) {
    let { messageId, receiverId } = req.body;

    if (!messageId || !receiverId) {
        return ReE(res, "Message ID and Receiver ID are required", 400);
    }

    try {
        const message = await messages.findOne({ where: { id: messageId, receiverId } });

        if (!message) {
            return ReE(res, "Message not found or unauthorized", 404);
        }

        await message.update({ isSeen: true });

        return ReS(res, { message: "Message marked as seen" });
    } catch (error) {
        return ReE(res, error.message, 500);
    }
};

module.exports.markMessageSeen = markMessageSeen;

