import React, { useContext, useState } from 'react';

import CartProvider from './../contextApi';

import SingleNotification from './SingleNotification/SingleNotification';

import axios from 'axios';
function NotificationScreen() {
  const { cookies, setCookie } = useContext(CartProvider);
  const [loadingCondition3, setLoadingCondition3] = React.useState(true);
  const [allNotifications, setAllNotifications] = React.useState(true);

  const getData = () => {
    axios
      .get(
        'http://localhost:3000/adminNotification/getNotification',

        {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        }
      )
      .then((res) => {
        // setProductsFromBackend(res);
        setLoadingCondition3(false);
        setAllNotifications(res.data.data.notificationarray);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  React.useEffect(() => {
    getData();
  }, []);

  if (loadingCondition3) {
    return (
      <div>
        <p>Please wait</p>
      </div>
    );
  } else {
    return (
      <div>
        {allNotifications.map((n) => {
          return (
            <SingleNotification userId={n.refOfUser} notificationId={n._id} />
          );
        })}
      </div>
    );
  }
}

export default NotificationScreen;
