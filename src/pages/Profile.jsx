import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react';

const Profile = () => {
  
  const [formData, SetFormData]=useState({})
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form  className='flex flex-col gap-4'>
      
        <img onClick={()=>fileRef.current.click()} src={currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type="text" placeholder='username' className='border p-3 rounded-lg ' id='username'/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg ' id='email'/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg ' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg mt-4 uppercase hover:opacity-95 disabled:opacity-80'>Update Profile</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>DeleteAccount</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile