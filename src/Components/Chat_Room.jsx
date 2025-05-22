// src/ChatRoom.js
import React, { useState, useEffect } from "react";
import Me from './img/portfolio.jpg'
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

const Chat_Room = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, "messages");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      uid: auth.currentUser.uid,
    });

    setMessage("");
  };

  useEffect(() => {
    const q = query(messagesRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className=" w-[600px] mx-auto p-[20px] ">
      <div className="flex gap-2 p-[20px] items-center bg-linear-60 from-[#dd27dd] to-red-500 shadow-2xl ">
        <img className="w-[50px] h-[50px] rounded-full border-4 border-yellow-500 " src={Me}  alt="" />
        <h2 className="font-bold text-2xl text-white">Chat App</h2>
      </div>

    <div className="border" style={{ maxWidth: 600, margin: "auto",  }}>
      <div className="shadow-2xl  " style={{ height: "400px", overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg) => (
          <div className="border bg-[#78a7bdfa] flex gap-4"
            key={msg.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              backgroundColor: msg.uid === auth.currentUser.uid ? "#78a7bdfa" : "#f5f",
              padding: "5px 10px",
              borderRadius: 10,
              maxWidth: "80%",
              marginLeft: msg.uid === auth.currentUser.uid ? "auto" : 0,
            }}
          >
            <img className="border-white flex items-center justify-center w-[40px] h-[40px] rounded-full   "
              src={msg.photoURL}              
              
            />
            
            <div className="">              
              <strong>{msg.displayName}</strong>
              <p style={{ margin: 0 }}>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex mt-4">
        <input className="border rounded-xl "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={{ flexGrow: 1, padding: 10, fontSize: 16 }}
        />
        <button className="border bg-[#821ade] text-white rounded-xl " type="submit" style={{ padding: "10px 20px" }}>
          Send
        </button>
      </form>
    </div>

    </section>
  );
};

export default Chat_Room;