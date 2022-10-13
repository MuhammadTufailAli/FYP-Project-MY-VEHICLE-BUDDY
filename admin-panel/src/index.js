import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Screens/login';

import App from './App';
import Dashboard from './Screens/Dashboard';
import AllUsers from './Screens/AllUsers';
import SignUp from './Screens/SignUp';
import AllProducts from './Screens/AllProducts';
import NotificationScreen from './Screens/NotificationScreen';
import SelectedUserDetails from './Screens/SelectedUserDetails';
import SelectedProductDetails from './Screens/SelectedProductDetails';
import Messenger from './Screens/Messenger';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { CartProvider } from './contextApi';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="AllUsers" element={<AllUsers />} />
          <Route path="Notification" element={<NotificationScreen />} />
          <Route
            path="AllUsers/SelectedUserDetails"
            element={<SelectedUserDetails />}
          />
          <Route path="AllProducts" element={<AllProducts />} />
          <Route
            path="AllProducts/SelectedProductDetails"
            element={<SelectedProductDetails />}
          />
          <Route path="Messenger" element={<Messenger />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
