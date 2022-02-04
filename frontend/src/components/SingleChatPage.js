import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { userContext } from "../context/UserContextProvider";
import Messages from "./Messages";
import ProfileModal from "./ProfileModal";
import "./SingleChatPage.css";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChatPage = ({ socket }) => {
  const [messageLoading, setMessageLoading] = useState(false);

  const [latestmessage, setLatestmessage] = useState();
  const {
    user,
    setSelectedChat,
    selectedChat,
    setFetchagain,
    fetchagain,
    messages,
    setMessages,
  } = useContext(userContext);

  function getSender(users) {
    if (users[0]._id === user._id) {
      return users[1].name;
    } else {
      return users[0].name;
    }
  }

  function getSenderFull(users) {
    if (users[0]._id === user._id) {
      return users[1];
    } else {
      return users[0];
    }
  }

  const fetchAllmessages = async () => {
    setMessageLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
    } catch (err) {
      alert(`${err.response.data.message} - unable to fetch messages`);
    }
    setMessageLoading(false);
    socket.emit("join chat", selectedChat._id);
  };

  const sendmessageHandeler = async () => {
    if (latestmessage) {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        let { data } = await axios.post(
          "/api/message/",
          {
            content: latestmessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setLatestmessage("");
        setFetchagain(!fetchagain);
        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };

  const typingHandeler = (event) => {
    setLatestmessage(event.target.value);
  };

  useEffect(() => {
    fetchAllmessages();
  }, [selectedChat]);

  return (
    <div className="singlechat-entire-container">
      <div className="singlechat-header">
        <div className="singlechat-backicon" onClick={() => setSelectedChat()}>
          <i class="fas fa-arrow-left"></i>
        </div>
        <div className="singlechat-name">
          <p>
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : getSender(selectedChat.users)}
          </p>
        </div>
        {!selectedChat.isGroupChat && (
          <ProfileModal user={getSenderFull(selectedChat.users)}>
            <div className="singlechat-viewicon">
              <i class="fas fa-eye"></i>
            </div>
          </ProfileModal>
        )}
        {selectedChat.isGroupChat && <UpdateGroupChatModal />}
      </div>

      <div className="singlechat-chat-area">
        <div className="singlechat-message-area">
          {messageLoading ? (
            <div className="singlechat-spinner">
              <Spinner animation="border" size="lg" />{" "}
            </div>
          ) : (
            <Messages messages={messages} />
          )}
        </div>
        <div className="singlechat-message-send-area">
          <input
            type="text"
            placeholder="Send message.."
            onChange={typingHandeler}
            onKeyDown={(e) => e.key === "Enter" && sendmessageHandeler()}
            value={latestmessage}
          ></input>
          <Button variant="primary" onClick={sendmessageHandeler}>
            <i class="fas fa-paper-plane"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleChatPage;
