const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

const { messages } = require("../models/messages.model");

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listen for "markMessageSeen" event from receiver
    socket.on("markMessageSeen", async ({ messageId, receiverId }) => {
        try {
            const message = await messages.findOne({ where: { id: messageId, receiverId } });

            if (message) {
                await message.update({ isSeen: true });

                // Notify the sender that their message is seen
                io.emit("messageSeen", { messageId, senderId: message.senderId });
            }
        } catch (error) {
            console.error("Error marking message as seen:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});
