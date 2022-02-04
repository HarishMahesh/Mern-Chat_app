import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ProfileModal = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <span onClick={handleShow}>{props.children}</span>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.user.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="model-avatar">
            <img src={props.user.pic} alt={props.user.name}></img>
          </div>
          <p>{props.user.email}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileModal;
