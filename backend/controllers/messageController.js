const asynhandeler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = asynhandeler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ message: "Required inputs missing" });
  }

  try {
    let data = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    data = await Message.findById(data._id).populate("sender").populate("chat");
    data = await User.populate(data, {
      path: "chat.users",
      select: "name email pic",
    });

    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: data._id,
      },
      { new: true }
    );

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
});

const getAllmessages = asynhandeler(async (req, res) => {
  chatId = req.params.chatId;

  try {
    let data = await Message.find({ chat: chatId })
      .populate("sender")
      .populate("chat");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal server error" });
  }
});

module.exports = { sendMessage, getAllmessages };
