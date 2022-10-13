import React, { useContext, useState, useEffect } from 'react';
import './chatOnline.css';
import CartProvider from './../../contextApi';

import axios from 'axios';

function ChatOnline({ onlineUsers, curentId, setcurrentChat }) {
  const { cookies, setCookie } = useContext(CartProvider);
  const [allUsers, setAllusers] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [cond, setCond] = useState(true);

  const getData = () => {
    axios
      .get('http://localhost:3000/users/allUsers', {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        setAllusers(res.data.data.doc);
        console.log(res.data.data.doc);
        setCond(false);
      })
      .catch((err) => {
        // setauthCondition(false);
        console.log(err.response.data.message);
      });
  };

  useEffect(() => {
    getData();
  }, [curentId]);

  useEffect(() => {
    var tempOnlineUser = [];
    var count = 0;

    allUsers.map((f) => {
      onlineUsers.map((o) => {
        if (o.userId === f._id) {
          tempOnlineUser[count] = f;
          count++;
        }
      });
    });
    console.log(tempOnlineUser);
    setOnlineFriends(tempOnlineUser);
  }, [allUsers, onlineUsers]);

  const handleClick = async (user) => {
    console.log('I am clicked');
    try {
      console.log(user._id);
      const res = await axios.get(
        `http://localhost:3000/conversation/find/${curentId}/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      );
      console.log(res);
      setcurrentChat(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (cond) {
    return (
      <div>
        <p>Please wait</p>
      </div>
    );
  } else {
    console.log(onlineFriends);

    return (
      <div>
        <p>Online Users</p>
        {onlineFriends.map((o) => {
          if (o._id !== curentId) {
            const url = '/Backend/public/images/users/' + o?.photo;
            return (
              <div className="OnlineUsers" onClick={() => handleClick(o)}>
                <img className="UserPhoto" src={url} alt="No photo" />

                <p className="UserName">
                  {o?.firstname} {o?.lastname}
                </p>
                <div className="GreenDot"></div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default ChatOnline;
