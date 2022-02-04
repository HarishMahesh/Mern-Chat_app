import React from "react";
import "./UserListItem.css";

const UserListItem = ({ user, handleClick }) => {
  return (
    <div className="userItem-container" onClick={handleClick}>
      <div className="userItem-imageConatner">
        <img src={user.pic} alt={user.name}></img>
      </div>
      <div>
        <p className="userItem-name">{user.name}</p>
        <p>
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
