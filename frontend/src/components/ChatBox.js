import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/UserContextProvider";
import "./ChatBox.css";
import SingleChatPage from "./SingleChatPage";
import io from "socket.io-client";

const ENDPOINT = "https://we-chat-ap.herokuapp.com/";
var socket;

const ChatBox = () => {
  const {
    selectedChat,
    notification,
    setNotification,
    user,
    setFetchagain,
    fetchagain,
    setMessages,
    messages,
  } = useContext(userContext);
  const [socketConnected, setsocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on("new message", (newmessageReceived) => {
      if (!selectedChat || selectedChat._id !== newmessageReceived.chat._id) {
        //notification logic;

        let flteredNotification = notification.filter(
          (m) => m.chat._id !== newmessageReceived.chat._id
        );
        console.log("hi");
        setNotification([newmessageReceived, ...flteredNotification]);
        setFetchagain(!fetchagain);
      } else {
        setMessages([...messages, newmessageReceived]);
        setFetchagain(!fetchagain);
      }
    });
  });

  return (
    <div className={`chatbox-container ${selectedChat ? "chatboxDispay" : ""}`}>
      {selectedChat ? (
        <SingleChatPage socket={socket} />
      ) : (
        <div className="chatbox-message">
          <p>Select anyone of the chats to text..</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
