import React, { useState, createContext } from 'react';
import { useCookies } from 'react-cookie';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cookies, setCookie] = useCookies(['jwt']);
  return (
    <CartContext.Provider value={{ cookies, setCookie }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
