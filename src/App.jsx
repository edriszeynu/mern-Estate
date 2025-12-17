import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import SignOut from './pages/SignOut';
import About from './pages/About';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Header from './component/Header';
import Profile from './pages/Profile';
import PrivateRoute from './component/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path='/search' element={<Search/>}/>

        {/* ✅ FIXED LISTING ROUTE */}
        <Route path="/listing/:listingId" element={<Listing />} />

        {/* ✅ PRIVATE ROUTES */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />

          {/* ✅ FIXED UPDATE ROUTE */}
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
