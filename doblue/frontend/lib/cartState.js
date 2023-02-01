import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalstatProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // custom provider. We will store (state and fuctionality (updates). anyoue can acces it via the consumer

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalstatProvider
      value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
    >
      {children}
    </LocalstatProvider>
  );
}

// make a custom hook for accessing the cart local state
function useCart() {
  // Use a consumer to acces the local state
  const all = useContext(LocalStateContext);
  return all;
}
export { CartStateProvider, useCart };
