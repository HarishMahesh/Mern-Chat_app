import axios from "axios";
import React, { useState, useContext } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { userContext } from "../../context/UserContextProvider";
import "./SideSearchBar.css";
import UserListItem from "./UserListItem";

const SideSearchBar = ({ show, handleClose }) => {
  const ctx = useContext(userContext);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const searchHandeler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${ctx.user.token}`,
      },
    };
    try {
      const { data } = await axios.get("/api/users?search=" + search, config);
      setSearchResults(data);
    } catch (err) {
      console.log(err.message);
      alert(err.message);
    }
    setLoading(false);
  };

  const accessChat = async (id) => {
    setChatLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${ctx.user.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        "/api/chats/",
        {
          userId: id,
        },
        config
      );

      ctx.setSelectedChat(data);
      let flag = ctx.chats.find((c) => c._id === data._id);
      console.log(flag);
      if (!flag) {
        console.log("hi");
        ctx.setChats([data, ...ctx.chats]);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
    setChatLoading(false);
    handleClose();
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search User</Offcanvas.Title>
        </Offcanvas.Header>
        <hr></hr>
        <Offcanvas.Body>
          <form className="sidebar-search-container" onSubmit={searchHandeler}>
            <input
              type="text"
              required
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></input>
            <Button type="submit" variant="secondary">
              Go
            </Button>
          </form>
          <div className="results-container">
            {loading
              ? "Loading..."
              : searchResults.map((singleUser) => {
                  return (
                    <UserListItem
                      key={singleUser._id}
                      user={singleUser}
                      handleClick={() => accessChat(singleUser._id)}
                    />
                  );
                })}
          </div>
          <div>{chatLoading ? "Loading..." : ""}</div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SideSearchBar;
