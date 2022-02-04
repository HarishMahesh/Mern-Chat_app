import React, { useContext } from "react";
import { userContext } from "../context/UserContextProvider";
import Header from "../components/chatsPage/Header";
import Mychats from "../components/Mychats";
import ChatBox from "../components/ChatBox";
import "./ChatPage.css";

const ChatPage = () => {
  const ctx = useContext(userContext);
  return (
    <>
      <div>{ctx.user ? <Header /> : ""}</div>
      {ctx.user ? (
        <div className="main-chatpage-container">
          <Mychats />
          <ChatBox />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ChatPage;
