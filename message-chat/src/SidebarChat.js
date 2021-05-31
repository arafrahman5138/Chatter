import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChat } from "./features/chatSlice";
import db from "./firebase";
import "./SidebarChat.css";
import * as timeago from "timeago.js";
import axios from './axios.js'
import Pusher from 'pusher-js'

var pusher = new Pusher('efea9d1d752dba7cb8ff', {
  cluster: 'us2'
});

function SidebarChat({ id, chatName }) {
  const dispatch = useDispatch();
  const [chatInfo, setChatInfo] = useState([]);
  const [lastMsg, setLastMsg] = useState("")
  const [lastPhoto, setLastPhoto] = useState("")
  const [lastTimeStamp, setLastTimeStamp] = useState("")

  const getSidebarElement = () => {
    axios.get(`/get/lastMessage?id=${id}`)
    .then((res) => {
      setLastMsg(res.data.message)
      setLastPhoto(res.data.user?.photo)
      setLastTimeStamp(res.data.timeStamp)
    })
  }

  useEffect(() => {
    getSidebarElement()
    
    const channel = pusher.subscribe('messages');
    channel.bind('newMessage', function (data) {
      getSidebarElement()
    });

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [id])

  return (
    <div
      onClick={() =>
        dispatch(
          setChat({
            chatId: id,
            chatName: chatName,
          })
        )
      }
      className="sidebarChat"
    >
      <Avatar src={lastPhoto} />
      <div className="sidebarChat__info">
        <h3>{chatName}</h3>
        {/* <p>{chatInfo[0]?.message}</p> */}
        <p>{lastMsg}</p>
        <small>
          {/* {timeago.format(new Date(chatInfo[0]?.timestamp?.toDate()))} */}
          {timeago.format(new Date(parseInt(lastTimeStamp)).toLocaleString())}
        </small>
      </div>
    </div>
  );
}

export default SidebarChat;
