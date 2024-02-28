import * as React from "react";
import LoginPage from "./components/login/LoginPage"
import MainApp from "./components/mainapp/MainApp";
import { useState } from "react";
import { useContext } from 'react';
import inventoryContext from "./context/inventory/inventoryContext";
import { useEffect } from "react";
import InventoryState from "./context/inventory/inventoryState";

function App() {

  // const context = useContext(inventoryContext)

  // useEffect(() => {
  //   console.log(context)
  // },[context])

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  // Function to handle successful login
  const handleLoginSuccess = (token) => {
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
  };

  return (
    <InventoryState>
      <div className="App">
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainApp authToken={authToken} onLogout={handleLogout} />
      )}
    </div>
    </InventoryState>
  )
}

export default App
