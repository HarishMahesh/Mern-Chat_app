const asynchandeler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const createChat = asynchandeler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "userId param is not sent" });
    throw new Error("userId param is not sent");
  }

  // check if the chat is allready exists with this user allready

  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate("users")
    .populate("latestMessage");

  if (chat.length > 0) {
    console.log("hi");
    res.status(200).json(chat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      let data = await Chat.create(chatData);

      let fullChatData = await Chat.findOne({ _id: data._id }).populate(
        "users"
      );

      res.status(200).json(fullChatData);
    } catch (err) {
      res.status(400).json({ message: "internal server error" });
    }
  }
});

const fetchChats = asynchandeler(async (req, res) => {
  try {
    let allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users")
      .populate("latestMessage")
      .populate("groupAdmin")
      .sort({ updatedAt: -1 });
    allChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "name email pic",
    });
    res.status(200).json(allChats);
  } catch (err) {
    res.status(400).json({ message: "internal server error" });
  }
});

const createGroupChat = asynchandeler(async (req, res) => {
  let { chatName, users } = req.body;

  if (!chatName && !users) {
    return res.status(400).json({ message: "Please fill all fileds" });
  }

  users = JSON.parse(users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "Number of users should be greater than 2" });
  }

  users.push(req.user._id);
  try {
    let data = await Chat.create({
      chatName: chatName,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id,
    });

    let fullChatData = await Chat.findOne({ _id: data._id })
      .populate("users")
      .populate("groupAdmin");
    res.status(200).json(fullChatData);
  } catch (err) {
    res.status(400).json({ message: "internal server error" });
  }
});

const renameGroupChat = asynchandeler(async (req, res) => {
  let { chatName, chatId } = req.body;

  try {
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      { new: true } // to return the updated chat value
    )
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(updateChat);
  } catch (err) {
    res.status(400).json({ message: "internal server error" });
  }
});

const adduserInGroup = asynchandeler(async (req, res) => {
  let { chatId, userId } = req.body;

  try {
    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(updatedChat);
  } catch (err) {
    res.status(400).json({ message: "internal server error" });
  }
});

const removeuserInGroup = asynchandeler(async (req, res) => {
  let { chatId, userId } = req.body;

  try {
    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId }, // remove that user id from that user array
      },
      { new: true }
    )
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(updatedChat);
  } catch (err) {
    res.status(400).json({ message: "internal server error" });
  }
});

module.exports = {
  createChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  adduserInGroup,
  removeuserInGroup,
};
