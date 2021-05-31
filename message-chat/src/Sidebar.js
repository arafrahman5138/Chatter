import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SearchIcon from "@material-ui/icons/Search";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import SidebarChat from "./SidebarChat";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import db, { auth } from "./firebase";
import axios from './axios'
import Pusher from 'pusher-js'
import ToolTip from './UserToolTip'
import { IoChatboxEllipsesOutline } from 'react-icons/io5';


const pusher = new Pusher('efea9d1d752dba7cb8ff', {
  cluster: 'us2'
});

function Sidebar(props) {
  const user = useSelector(selectUser);
  const [chats, setChats] = useState([]);
  const [creating, setCreating] = useState(false)

  const getChats = () => {
    axios.get('/get/conversationList')
      .then((res) => {
        setChats(res.data)
      }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    getChats()

    setCreating(props.creating)

    const channel = pusher.subscribe('chats');
    channel.bind('newChat', function (data) {
      getChats()
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [props.creating]);

  const addChat = (e) => {
    e.preventDefault()

    setCreating(true)
    props.getData(true)

    // const chatName = prompt("Please enter a chat name");
    // const firstMsg = prompt('Please Send Welcome Message')

    // if (chatName && firstMsg) {
    //   let chatId = ''
    //   axios.post('/new/conversation', {
    //     chatName: chatName
    //   }).then((res) => {
    //     chatId = res.data._id
    //   }).then(() => {
    //     axios.post(`/new/message?id=${chatId}`, {
    //       message: firstMsg,
    //       timeStamp: Date.now(),
    //       user: user
    //     })
    //   })
    // }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <img
          src="message.png"
          alt=""
        />
        <ToolTip title="Logout">
        <Avatar
          onClick={() => auth.signOut()}
          src={user.photo}
          className="sidebar__avatar"
        />
        </ToolTip>
        <div className="sidebar__input">
          <SearchIcon />
          <input placeholder="Search" />
        </div>
        <ToolTip title="Create New Chat">
          <IconButton variant="outlined" className="sidebar__inputButton">
            <IoChatboxEllipsesOutline className="sidebar__newChat" onClick={addChat} />
          </IconButton>
        </ToolTip>
      </div>

      <div className="sidebar__chats">
        {chats.map(({ id, name, timeStamp }) => (
          <SidebarChat key={id} id={id} chatName={name} timeStamp={timeStamp} />
        ))}
        {creating && <SidebarChat chatName="Creating New Room" id="newchat" />}
      </div>
    </div>
  );
}

export default Sidebar;
