import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import CartProvider from './../../contextApi';

import { Box, Stack } from '@mui/system';

import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { Button } from '@mui/material';

function SingleNotification({ userId, notificationId }) {
  const [user, setUser] = useState(null);
  const { cookies, setCookie } = useContext(CartProvider);

  const getfriends = () => {
    axios
      .get(`http://localhost:3000/users/singleUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`
        }
      })
      .then((res) => {
        console.log(res.data.data.doc);
        setUser(res.data.data.doc);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = (status) => {
    axios
      .patch(
        `http://localhost:3000/users/updateUser/${userId}`,
        {
          active: status
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`
          }
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .delete(`http://localhost:3000/adminNotification/deleteNotification/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`
        }
      })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getfriends();
  }, []);

  if (!user) {
    return (
      <div>
        <p>Please wait</p>
      </div>
    );
  } else {
    const url = '/Backend/public/images/users/' + user?.photo;
    return (
      // <div className="conversationContainer">
      <React.Fragment>
        <Box>
          <div style={{ padding: 10 }}>
            <div style={{ padding: 10, border: '1px solid' }}>
              <img
                style={{ width: 30, height: 30 }}
                className="FriendPhoto"
                src={user?.photoUrl}
                alt="Avatar"
              />
              <span style={{ fontWeight: 'bold' }}>
                {user?.firstname} {user?.lastname}
              </span>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingLeft: 2,
                  marginTop: 6
                }}>
                <Button
                  variant="outlined"
                  // style={{ color: 'green' }}
                  color="success"
                  onClick={() => {
                    updateUser('active');
                  }}>
                  <AiOutlineCheck />
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  // style={{ color: 'red' }}
                  onClick={() => {
                    updateUser('inactive');
                  }}>
                  <AiOutlineClose />
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </React.Fragment>
      // </div>
    );
  }
}

export default SingleNotification;
