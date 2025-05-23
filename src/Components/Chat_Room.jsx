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
  const [chatUsers, setChatUsers] = useState([]);

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

      // Unique users বের করো
      const uniqueUsers = [];
      const seenUids = new Set();

      msgs.forEach((msg) => {
        if (!seenUids.has(msg.uid)) {
          seenUids.add(msg.uid);
          uniqueUsers.push({
            uid: msg.uid,
            name: msg.displayName,
            photo: msg.photoURL,
          });
        }
      });

      setChatUsers(uniqueUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className=" w-[600px] mx-auto p-[20px] ">
      <div className="flex gap-2 p-[20px] items-center bg-linear-60 from-[#dd27dd] to-red-500 shadow-2xl ">
        <img className="w-[50px] h-[50px] rounded-full border-4 border-yellow-500 " src={Me} alt="" />
        <h2 className="font-bold text-2xl text-white">Chat App</h2>
      </div>

      <div className="border " style={{ maxWidth: 600, margin: "auto", }}>

        <div className="flex">
          {/* sidebar............................................ */}
          <div className="w-[30%] border-r p-2">
            <h2 className="font-bold text-xl py-2 border-b-2 mb-2">Chat Users</h2>
            {chatUsers.map((user) => (
              <div key={user.uid} className="flex items-center gap-3 mb-3 p-2 hover:bg-gray-200 rounded cursor-pointer">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border"
                />
                <span className="text-gray-800 font-medium">{user.name}</span>
              </div>
            ))}
          </div>

          {/* message section ........................................*/}
          <div className="shadow-2xl w-[70%]  " style={{ height: "400px", overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
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