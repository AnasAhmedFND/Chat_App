import React from 'react'

const Navbar = () => {
  return (
    <section className='container mx-auto'>
        <nav>
            <ul className='flex gap-5  border py-10 px-10 bg-yellow-500 text-white font-bold text-2xl  '>
                <li>Login</li>
                <li>Chat-Room</li>
            </ul>
        </nav>
    </section>
  )
}

export default Navbar
