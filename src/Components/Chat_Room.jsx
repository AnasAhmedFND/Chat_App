// src/ChatRoom.js
import React, { useState, useEffect } from "react";
import Me from './img/portfolio.jpg'
import { auth, db } from "../firebase";
import { TiDelete } from "react-icons/ti";
import { deleteDoc, doc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; 


const Chat_Room = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);

  const messagesRef = collection(db, "messages");

  // ইউজার Login হলে Firestore এ সংরক্ষণ করো
  const updateUserOnlineStatus = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name: user.displayName,
      photo: user.photoURL,
      status: "online",
      lastActive: serverTimestamp()
    }, { merge: true });
  };
    //  ইউজার লগইন হলে স্ট্যাটাস সেট করা হচ্ছে
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      await updateUserOnlineStatus();
    } else {
      // ইউজার লগআউট করলে স্ট্যাটাস offline
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, { status: "offline" }, { merge: true });
      }
    }
  });

  return () => unsubscribe();
}, []);




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
    })

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      setChatUsers(users);
    });

    return () => unsubscribe();
  }, []);

  // Delete message............................................
  const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this message?");
  if (!confirm) return;

  try {
    await deleteDoc(doc(db, "messages", id));
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};


  return (
    <section className=" md:w-[600px]  h-screen mx-auto md:p-[20px] md:px-0 px-2 ">
      <div className="flex gap-2 md:p-[20px] p-2 items-center bg-linear-60 from-[#dd27dd] to-red-500 shadow-2xl ">
        <img className="w-[50px] h-[50px] rounded-full border-4 border-yellow-500 " src={Me} alt="" />
        <h2 className="font-bold text-2xl text-white">Chat App</h2>
      </div>

      {/* sidebar............................................ */}
      <div className="flex overflow-x-auto md:border border-b-2 md:p-2 ">


        {chatUsers.map((user) => (
          <div key={user.uid} className=" overflow-x-auto  mb-3 p-2 hover:bg-gray-200 rounded cursor-pointer relative">
            <img
              src={user.photo}
              className="w-10 h-10 rounded-full border "
            />


            {user.status === "online" && (
              <p className="absolute w-4 h-4 bg-green-500 border-white border-2 rounded-full bottom-0 top-0 "></p>
              // <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}

            <span className="text-gray-800 font-medium">{user.name}</span>
          </div>
        ))}
      </div>

      <div className="md:border  " style={{ maxWidth: 600, margin: "auto", }}>


        {/* message section ........................................*/}
        <div className="shadow-2xl h-[450px] " style={{ overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
          {messages.map((msg) => (
            <div className="border bg-[#78a7bdfa] flex gap-4 relative "
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
                <p className="break-words max-w-[190px]  ">{msg.text}</p>
              </div>
              {msg.uid === auth.currentUser.uid && (
                <button onClick={() => handleDelete(msg.id)} className=" text-2xl  absolute top-0 right-0 cursor-pointer "><TiDelete /></button>

              )}

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