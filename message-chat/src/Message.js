import { Avatar } from "@material-ui/core";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import "./Message.css";
import UserToolTip from './UserToolTip'

const Message = forwardRef(
  (
    { id, sender, message, timeStamp }, //timeStamp,
    ref
  ) => {
    const user = useSelector(selectUser);
    console.log('currmessage' + message)
    return (
      <div
        ref={ref}
        className={`message ${user?.email === sender?.email && "message__sender"}`}
      >
        {/* <small className="message__name">
          {user.email}
          </small> */}
        <UserToolTip arrow title={sender.email} placement="top"  enterTouchDelay = "0">
          <Avatar className="message__photo" src={sender?.photo} />
        </UserToolTip>
        <p>{message}</p>
        <small>
          {/* {new Date(timeStamp?.toDate()).toLocaleString()} */}
          {new Date(parseInt(timeStamp)).toLocaleString()}
          {/* {Date().toLocaleString()} */}
          {/* {Date.now()} */}
        </small>
      </div>
    );
  }
);

export default Message;
