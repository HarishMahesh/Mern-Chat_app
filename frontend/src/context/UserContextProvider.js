import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const userContext = React.createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [fetchagain, setFetchagain] = useState(false);
  const [notification, setNotification] = useState([]);
  const [messages, setMessages] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchagain,
        setFetchagain,
        notification,
        setNotification,
        messages,
        setMessages,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
