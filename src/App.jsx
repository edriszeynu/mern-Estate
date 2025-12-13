import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import Signin from './pages/Signin'
import SignOut from './pages/SignOut'
import About from './pages/About'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Header from './component/Header'
import Profile from './pages/Profile'

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Home/>
      <Routes>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-out" element={<SignOut />} />
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App