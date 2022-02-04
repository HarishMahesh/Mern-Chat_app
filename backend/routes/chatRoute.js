const express = require("express");
const {
  createChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  adduserInGroup,
  removeuserInGroup,
} = require("../controllers/chatController");
const verifyUser = require("../middleware/authMidleware");
const Router = express();

Router.post("/", verifyUser, createChat); // used to create a single chat or to return the chat when it is already created user id is passed in body
Router.get("/", verifyUser, fetchChats); // to get all the chats of the user logged in
Router.post("/group", verifyUser, createGroupChat); // to create group chat;
Router.put("/rename", verifyUser, renameGroupChat);
Router.put("/groupadd", verifyUser, adduserInGroup);
Router.put("/groupremove", verifyUser, removeuserInGroup);

module.exports = Router;
