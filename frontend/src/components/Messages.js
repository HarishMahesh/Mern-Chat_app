import React, { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ScrollableFeed from "react-scrollable-feed";
import { userContext } from "../context/UserContextProvider";
import "./Message.css";

const Messages = (props) => {
  const { user } = useContext(userContext);

  function getIssameUser(m) {
    if (m.sender._id === user._id) {
      return true;
    } else {
      return false;
    }
  }

  function isLastMessageofUser(messages, m, i) {
    if (i === messages.length - 1) {
      return true;
    }
    if (messages[i + 1].sender._id !== m.sender._id) {
      return true;
    }

    return false;
  }

  return (
    <ScrollableFeed>
      {props.messages.map((m, i) => {
        return !getIssameUser(m) ? (
          <div
            key={m._id}
            className={`message-other-user ${
              isLastMessageofUser(props.messages, m, i)
                ? "last-message-margin"
                : "previous-message-margin"
            }`}
          >
            <div>
              {isLastMessageofUser(props.messages, m, i) && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="button-tooltip-2">{m.sender.name}</Tooltip>
                  }
                >
                  <img src={m.sender.pic} alt={m.sender.name} />
                </OverlayTrigger>
              )}
            </div>
            <p>{m.content}</p>
          </div>
        ) : (
          <div
            className={`message-same-user ${
              isLastMessageofUser(props.messages, m, i) && "last-message-margin"
            }`}
          >
            <p>{m.content}</p>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default Messages;
