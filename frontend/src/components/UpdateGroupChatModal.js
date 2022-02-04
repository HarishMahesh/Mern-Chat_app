import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { userContext } from "../context/UserContextProvider";
import UserListItem from "./chatsPage/UserListItem";
import "./UpdateGroupChatModal.css";

const UpdateGroupChatModal = () => {
  const [show, setShow] = useState(false);
  const [chatname, setChatname] = useState();
  const [changeNameloading, setChangeNameLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [userAddRemovalLoading, setAddRemovalLoading] = useState(false);

  const { user, selectedChat, setSelectedChat, fetchagain, setFetchagain } =
    useContext(userContext);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setSearchResults([]);
    setShow(true);
  };
  const changeGroupNameHandeler = async () => {
    setChangeNameLoading(true);
    if (!chatname) {
      setChangeNameLoading(false);
      return;
    }
    let config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      let { data } = await axios.put(
        "/api/chats/rename/",
        {
          chatId: selectedChat._id,
          chatName: chatname,
        },
        config
      );
      setSelectedChat(data);
      setFetchagain(!fetchagain);
      setChangeNameLoading(false);
    } catch (error) {
      setChangeNameLoading(false);
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }

    setChatname("");
  };

  const handleSearch = async (input) => {
    setLoading(true);
    if (!input) {
      setLoading(false);
      setSearchResults([]);
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.get("/api/users?search=" + input, config);
      setSearchResults(data);
    } catch (err) {
      console.log(err.message);
      alert(err.message);
    }

    setLoading(false);
  };

  const adduserHandeler = async (userdata) => {
    setAddRemovalLoading(true);
    if (!(selectedChat.groupAdmin._id === user._id)) {
      setAddRemovalLoading(false);
      alert("Only the admin can add or remove users");
      return;
    }

    let flag = selectedChat.users.find((u) => u._id === userdata._id);

    if (flag) {
      setAddRemovalLoading(false);
      alert("User allready in group");
      return;
    }

    let config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      let { data } = await axios.put(
        "/api/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: userdata._id,
        },
        config
      );

      setAddRemovalLoading(false);
      setFetchagain(!fetchagain);
      setSelectedChat(data);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      setAddRemovalLoading(false);
    }
  };

  const removeuserHandeler = async (userdata) => {
    setAddRemovalLoading(true);
    if (!(selectedChat.groupAdmin._id === user._id)) {
      setAddRemovalLoading(false);
      alert("Only the admin can add or remove users");
      return;
    }
    if (userdata._id === user._id) {
      setAddRemovalLoading(false);
      alert("Admin cannot leave the group");
      return;
    }

    let config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      let { data } = await axios.put(
        "/api/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: userdata._id,
        },
        config
      );

      setAddRemovalLoading(false);
      setFetchagain(!fetchagain);
      setSelectedChat(data);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      setAddRemovalLoading(false);
    }
  };

  return (
    <>
      <div className="singlechat-viewicon" onClick={handleShow}>
        <i class="fas fa-eye"></i>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Admin : </b>
            {selectedChat.groupAdmin.name}
          </p>
          <div className="selected-users-conatiner">
            {selectedChat.users.map((u) => (
              <div key={u._id}>
                <span>
                  <b>{u.name}</b>
                </span>
                <span onClick={() => removeuserHandeler(u)}>
                  <i class="fas fa-times selected-user-close-icon"></i>
                </span>
              </div>
            ))}
          </div>
          <div className="groupname-change-container">
            <Form.Control
              size="sm"
              type="text"
              placeholder="Chat name"
              onChange={(e) => setChatname(e.target.value)}
              value={chatname}
            />
            <Button
              variant="secondary"
              disabled={changeNameloading}
              onClick={changeGroupNameHandeler}
            >
              {changeNameloading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Update"
              )}
            </Button>
          </div>

          <Form.Control
            size="sm"
            type="text"
            placeholder="Add user to group"
            onChange={(e) => handleSearch(e.target.value)}
          />

          {loading
            ? "Loading..."
            : searchResults
                .slice(0, 3)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => adduserHandeler(user)}
                  />
                ))}

          {userAddRemovalLoading && "Loading..."}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
