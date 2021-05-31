import { IconButton } from "@material-ui/core";
import MicNoneIcon from "@material-ui/icons/MicNone";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Chat.css";
import { selectChatId, selectChatName } from "./features/chatSlice";
import db from "./firebase";
import Message from "./Message";
import firebase from "firebase";
import { selectUser } from "./features/userSlice";
import FlipMove from "react-flip-move";
import axios from './axios'
import Pusher from 'pusher-js'
import { useDispatch } from "react-redux";
import { setChat } from "./features/chatSlice";

var pusher = new Pusher('efea9d1d752dba7cb8ff', {
  cluster: 'us2'
});

function Chat(props) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  let chatName = useSelector(selectChatName);
  let chatId = useSelector(selectChatId);
  const [messages, setMessages] = useState([]);
  let creating = props.creating
  const [roomName, setRoomName] = useState("");
  const [newId, setNewId] = useState("")


  const getConversation = (chatId) => {
    if (chatId) {
      axios.get(`/get/conversation?id=${chatId}`)
      .then((res) => {
        console.log("stuff" + res.data[0].conversation[0].message)
        setMessages(res.data[0].conversation)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const addChat = (e) => {
    e.preventDefault()
    const chatName = roomName;
    const firstMsg = input

    if (chatName && firstMsg) {
      let chatId = ''
      axios.post('/new/conversation', {
        chatName: chatName
      }).then((res) => {
        chatId = res.data._id
        setNewId(chatId)
      }).then(() => {
        axios.post(`/new/message?id=${chatId}`, {
          message: firstMsg,
          timeStamp: Date.now(),
          user: user
        })
      }).catch((err) => {
        console.log(err)
      })
    }
    props.getData(false)
    setInput("")
  }

  useEffect(() => {
    const channel = pusher.subscribe('chats');
    channel.bind('newChat', function (data) {
      setMessages([])
      dispatch(
        setChat({
          chatId: newId,
          chatName: roomName,
        })
      )
    })
    creating = false
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [dispatch, newId, roomName])

  useEffect(() => {
    // pusher.unsubscribe('messages')

    getConversation(chatId)
    
    const channel = pusher.subscribe('messages');
    channel.bind('newMessage', function (data) {
      getConversation(chatId)
    });

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }

  }, [chatId]);

  const sendMessage = (e) => {
    e.preventDefault()

    axios.post(`/new/message?id=${chatId}`, {
      message: input,
      timeStamp: Date.now(),
      user: user
    }).catch((err) => {
      console.log(err)
    })
    setInput("")
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <h4>
          Chat Name: {!creating && <span className="chat__name"><strong>{chatName}</strong></span>}
        </h4>
        {creating && <div className="chat__headerRoomname"><form><input placeholder="Name group here" type="text" onChange={(e) => setRoomName(e.target.value)}></input></form></div>}
        {/* <strong>Details</strong> */}
      </div>

      {/* chat messages */
      console.log("messages" + messages[0]?.message)
      }
      <div className="chat__messages">
        <FlipMove>
          {creating ? <div></div> : messages.map(({ user, _id, message, timeStamp }) => (
            <Message key={_id} id={_id} sender={user} message={message} timeStamp={timeStamp} />
          ))}
        </FlipMove>
      </div>

      <div className="chat__input">
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${creating ? 'Create group by sending welcome message' : "Send Message"}`}
            type="text"
          />
          <button onClick={creating ? addChat : sendMessage}>Send Message</button>
        </form>

        <IconButton>
          <MicNoneIcon className="chat__mic" />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
