import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import "./Header.css";
import {
  Button,
  Dropdown,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { userContext } from "../../context/UserContextProvider";
import SideSearchBar from "./SideSearchBar";

const Header = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showSidebar, setShowSidebar] = useState(false);

  const handleCloseSide = () => setShowSidebar(false);
  const handleShowSide = () => setShowSidebar(true);
  const ctx = useContext(userContext);
  const logoutHandeler = () => {
    localStorage.removeItem("userInfo");
    ctx.setSelectedChat();
    navigate("/");
  };

  return (
    <div className="header-chat">
      <div>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-bottom">Search User</Tooltip>}
        >
          <Button
            className="header-search"
            variant="light"
            onClick={handleShowSide}
          >
            <i class="fas fa-search"></i> <b>Search User</b>
          </Button>
        </OverlayTrigger>
      </div>
      <div className="header-title">
        <p>We Chat</p>
      </div>
      <div className="header-userinfo">
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <NotificationBadge
                count={ctx.notification.length}
                effect={Effect.SCALE}
                className="notification-count"
              />
              <i class="fas fa-bell"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {!ctx.notification.length && (
                <Dropdown.Item>No new messages</Dropdown.Item>
              )}
              {ctx.notification.length &&
                ctx.notification.map((m) => (
                  <Dropdown.Item
                    key={m._id}
                    onClick={() => {
                      ctx.setSelectedChat(m.chat);
                      ctx.setNotification(
                        ctx.notification.filter((data) => data._id !== m._id)
                      );
                    }}
                  >{`New message received from : ${
                    m.chat.isGroupChat ? m.chat.chatName : m.sender.name
                  }`}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <Dropdown className="user-drop">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <div className="header-avatar">
                <img src={ctx.user.pic} alt={ctx.user.name}></img>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button" onClick={handleShow}>
                My Profile
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={logoutHandeler}>
                Logout
              </Dropdown.Item>

              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>{ctx.user.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                  <div className="model-avatar">
                    <img src={ctx.user.pic} alt={ctx.user.name}></img>
                  </div>
                  <p>{ctx.user.email}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <SideSearchBar handleClose={handleCloseSide} show={showSidebar} />
    </div>
  );
};

export default Header;
