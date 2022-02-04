import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { userContext } from "../context/UserContextProvider";
import AddToGroupModal from "./AddToGroupModal";
import "./Mychats.css";

const Mychats = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat, fetchagain } =
    useContext(userContext);

  function getSender(users) {
    if (users[0]._id === user._id) {
      return users[1].name;
    } else {
      return users[0].name;
    }
  }

  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      let { data } = await axios.get("/api/chats/", config);

      setChats(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchagain]);

  return (
    <div className={`mychats-container ${selectedChat ? "changeDispaly" : ""}`}>
      <div className="mychats-header">
        <span>My Chats</span>
        <AddToGroupModal>
          <Button variant="light">New Group Chat +</Button>
        </AddToGroupModal>
      </div>
      <div className="mychats-chatlist">
        {chats.map((chat) => {
          return (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`single-chat-list ${
                selectedChat && selectedChat._id === chat._id
                  ? "isSelected"
                  : ""
              }`}
            >
              <p>{chat.isGroupChat ? chat.chatName : getSender(chat.users)}</p>
              {chat.latestMessage && (
                <p className="chats-list-latest-message">
                  {chat.latestMessage.sender._id === user._id ? (
                    <b>me : </b>
                  ) : (
                    <b>{`${chat.latestMessage.sender.name} : `}</b>
                  )}
                  {chat.latestMessage.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mychats;
