
import React from 'react'
import {FaSearch} from 'react-icons/fa'

const Header = () => {
  return (
    <header lassName="bg-slate-200 shadow-md">
      <div className='flex justify-between max-w-6xl mx-auto p-3'>

      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>

      <span className='text-slate-500'>Edris</span>
      <span className='text-slate-700'>Estate</span>
        
      </h1>
      <form className='bg-slate-100 rounded-lg flex items-center gap-2 px-3 py-1 w-32 sm:w-64'>
        <input className='bg-transparent focus:outline-none w-24 sm:w-64' type="text" placeholder='Search...' />
        <FaSearch className='text-slate-500'/>
      </form>
      <ul>
        <Link to="/">
        <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
        </Link>
        <Link to="/about">

        <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
        </Link>
        <Link to="/sign-in">
        
        <li className=' text-slate-700 hover:underline'>Signin</li>
        </Link>
      </ul>
      </div>
    </header>
  )
}

export default Header