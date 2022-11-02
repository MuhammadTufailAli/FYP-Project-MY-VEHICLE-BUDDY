import React, { useContext, useState, useEffect, useRef } from 'react';
import LeftDrawer from './LeftDrawer';
import './../ScreensCss/Messenger.css';
import Conversation from './conversation/Conversation';
import Message from './message/Message';
import ChatOnline from './chatOnline/ChatOnline';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { io } from 'socket.io-client';

import CartProvider from './../contextApi';

function Messenger() {
  const { cookies, setCookie } = useContext(CartProvider);
  const [conversation, setConversation] = useState([]);
  const [currentChat, setcurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newmessages, setNewMessages] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socket = useRef(); //it is not http connection ws means web socket
  const [currentUser, setcurrentUser] = useState();
  const [receiverUser, setreceiverUser] = useState();

  const scrollRef = useRef();

  const getConversation = () => {
    axios
      .get('http://localhost:3000/conversation', {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        setConversation(res.data.data);
        setcurrentUser(res.data.currentUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log('LAAST MESSAGE' + lastMessage);
  console.log('The Current user is ' + currentUser);

  const getMessages = () => {
    const otherUserId = currentChat?.members.filter(
      (user) => user !== currentUser
    );

    axios
      .get(`http://localhost:3000/message/${currentChat?._id}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`http://localhost:3000/users/singleUser/${otherUserId}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        setreceiverUser(res.data.data.doc);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //To connect to server using socket io
  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    //To recieve message which was send by user to server and server again send to receiver
    socket.current.on('getMessage', (data) => {
      console.log(data.text);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //If there is change in arrival message then we will update our messages

  useEffect(() => {
    //currentChat?.members.includes(arrivalMessage.sender) is ka mtlb k jisa send kiya ha message sirf usa receive ho
    console.log('The arrival message isssssssssssss' + arrivalMessage?.text);
    setLastMessage(arrivalMessage?.text);
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  //To add user to online users list
  useEffect(() => {
    socket.current.emit('addUser', currentUser);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(users);
    });
  }, [currentUser]);

  //To get conversation
  useEffect(() => {
    getConversation();
    console.log('I am Called');
  }, [messages]);

  //To get messages
  useEffect(() => {
    getMessages();
  }, [currentChat]);

  //To automatically scroll the scroll bar
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (Object.keys(conversation).length === 0) {
    return (
      <div>
        <p>Please wait</p>
      </div>
    );
  } else {
    const url = '/Backend/public/images/users/' + receiverUser?.photo;
    return (
      <div
        className="TopContainer"
        style={{ display: 'flex', overflow: 'hidden' }}
      >
        <LeftDrawer />
        <div className="ChatScreen">
          <div className="ChatMenu">
            <div className="ChatMenuWrapper">
              <TextField
                id="standard-basic"
                label="Search for friend"
                variant="standard"
              />
              {conversation.map((c) => {
                if (
                  c.members.includes(arrivalMessage?.sender) &&
                  c.members.includes(currentUser)
                ) {
                  c.lastMessage = lastMessage;
                }

                return (
                  <div
                    //Ab hum jab click kara ga chat pa to vo conversation mil  jay gi
                    //Or hum us conversation id ko use karta hova sari chat hasil kar la ga
                    onClick={() => {
                      setcurrentChat(c);
                    }}
                  >
                    <Conversation
                      conversation={c}
                      currentUser={currentUser}
                      lastMessage={c.lastMessage}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ChatBox">
            {/* To Take input */}
            {currentChat ? (
              <div className="ChatBoxWrapper">
                <div className="ChatUserName">
                  <img className="OtherUserPhoto" src={url} alt="No photo" />
                  <span className="OtherUserName">
                    {receiverUser?.firstname} {receiverUser?.lastname}
                  </span>
                </div>
                <div className="messageArea">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === currentUser} />
                    </div>
                  ))}
                </div>

                <div className="ChatboxtotakeInput">
                  <Formik
                    initialValues={{ message: '' }}
                    onSubmit={async (values) => {
                      const message = {
                        sender: currentUser,
                        text: values.message,
                        conversationId: currentChat._id,
                      };

                      const receiverId = currentChat.members.find(
                        (member) => member !== currentUser
                      );
                      console.log('The recivere id is' + receiverId);
                      //We are sending message to server using socket io
                      socket.current.emit('sendMessage', {
                        senderId: currentUser,
                        receiverId,
                        text: values.message,
                      });

                      axios
                        .post(`http://localhost:3000/message`, message, {
                          headers: {
                            Authorization: `Bearer ${cookies.jwt}`,
                          },
                        })
                        .then((res) => {
                          setLastMessage(res.data.text);
                          setMessages([...messages, res.data]);
                          values.message = '';
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    <Form>
                      <Field
                        className="InputMessageContainer"
                        name="message"
                        type="text"
                        className="textArea"
                      />

                      <button type="submit" className="SendButton">
                        Send
                      </button>
                    </Form>
                  </Formik>
                </div>
              </div>
            ) : (
              <span>Open a conversation to start a chat</span>
            )}
          </div>
          <div className="ChatOnline">
            <div className="ChatOnlineWrapper">
              <ChatOnline
                onlineUsers={onlineUsers}
                curentId={currentUser}
                setcurrentChat={setcurrentChat}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Messenger;
