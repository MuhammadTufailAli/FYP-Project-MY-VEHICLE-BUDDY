import React, { useState, createContext, useContext } from 'react';
import { useCookies } from 'react-cookie';
import Login from './Screens/login';
import Dashboard from './Screens/Dashboard';
import CartProvider from './contextApi';

// const cookie = createContext();
function App() {
  const { cookies, setCookie } = useContext(CartProvider);
  console.log("The length is "+ Object.keys(cookies).length);

  if (Object.keys(cookies).length === 0) {
    return (
      <div>
        <Login />
      </div>
    );
  } else {
    console.log('I am in dashboard now');
    return (
      <div>
        <Dashboard />
      </div>
    );
  }
}

export default App;
