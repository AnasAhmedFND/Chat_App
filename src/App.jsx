
// src/App.js
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Home from './Pages/Home';
import Chat_p from './Pages/Chat_p';

const App = () => {
  const [user] = useAuthState(auth);

  return user ? <Chat_p /> : <Home />;
};

export default App;

