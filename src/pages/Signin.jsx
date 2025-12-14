import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ REQUIRED for JWT cookie
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setLoading(false)
        setError(data.message || 'Signin failed')
        return
      }

      setLoading(false)
      navigate('/')

    } catch (err) {
      setLoading(false)
      setError('Server error. Please try again.')
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="email"
          placeholder='Email'
          className='border p-3 rounded-lg'
          id="email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder='Password'
          className='border p-3 rounded-lg'
          id="password"
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          type='submit'
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Don’t have an account?</p>
        <Link to="/sign-up" className='text-blue-700 hover:underline'>
          Sign up
        </Link>
      </div>

      {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}

export default Signin
