const express = require("express");
const {
  sendMessage,
  getAllmessages,
} = require("../controllers/messageController");
const verifyUser = require("../middleware/authMidleware");
const Router = express();

Router.post("/", verifyUser, sendMessage);
Router.get("/:chatId", verifyUser, getAllmessages);

module.exports = Router;
