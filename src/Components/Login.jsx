import React from 'react'
import Me from './img/portfolio.jpg'
import Google from './img/google.jpg'
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";


const Login = () => {
    const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

    return (
        <section className='container mx-auto w-[400px] h-[600px] border rounded-xl shadow-2xl '>

            <div className="flex py-4 px-4 bg-[#4835a4] text-white rounded-t-xl items-center ">
                <img className='w-[50px] h-[50px] rounded-full border-4  ' src={Me} alt="" />
               <h2 className='ml-4 font-bold text-xl'>Chat..</h2>
            </div>

            <div className="text-center mt-10">
                <h1 className='font-bold text-4xl'>Sign in</h1>
                <p className='mt-2'>Sign in with your Google account</p>
            </div>

            <div onClick={signInWithGoogle}  className="border flex px-4  items-center gap-2 w-[70%] mx-auto mt-15 rounded-lg shadow-2xl cursor-pointer ">
                <img className='w-[50px] h-[50px] rounded-full ' src={Google} alt="" />
                <p className='font-bold text-lg cursor-pointer '>Sign in with Google</p>
            </div>
        </section>
    )
}

export default Login
