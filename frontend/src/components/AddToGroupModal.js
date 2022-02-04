import axios from "axios";
import React, { useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { userContext } from "../context/UserContextProvider";
import UserListItem from "./chatsPage/UserListItem";
import "./AddToGroupModal.css";

const AddToGroupModal = ({ children }) => {
  const [show, setShow] = useState(false);
  const [chatname, setChatname] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = useContext(userContext);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setChatname("");
    setSearchResults([]);
    setSelectedUsers([]);
    setShow(true);
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
    let flag = selectedUsers.find((u) => u._id === userdata._id);

    if (flag) {
      alert("User allerady added");
      return;
    }

    setSelectedUsers([...selectedUsers, userdata]);
  };

  const removeuserHandeler = (userdata) => {
    console.log("hi");
    let filteredUser = selectedUsers.filter(
      (data) => data._id !== userdata._id
    );
    setSelectedUsers([...filteredUser]);
  };

  const submitHandeler = async () => {
    if (!chatname || selectedUsers.length < 1) {
      alert("Please enter the chat name and select users");
      return;
    }

    let userIds = JSON.stringify(selectedUsers.map((u) => u._id));
    let config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      let { data } = await axios.post(
        "/api/chats/group",
        {
          chatName: chatname,
          users: userIds,
        },
        config
      );

      setChats([data, ...chats]);
      setShow(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <span onClick={handleShow}>{children}</span>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Group chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Chat name"
            value={chatname}
            onChange={(e) => setChatname(e.target.value)}
          />
          <Form.Control
            size="sm"
            type="text"
            placeholder="Search by user name.."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className="selected-users-conatiner">
            {selectedUsers.map((u) => (
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitHandeler}>
            Create chat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddToGroupModal;
