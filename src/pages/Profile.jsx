import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);

      const res = await fetch(
        `http://localhost:3000/api/user/update/${currentUser._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || 'Update failed'));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  // DELETE USER
  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;

    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `http://localhost:3000/api/user/delete/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message || 'Delete failed'));
        return;
      }

      dispatch(deleteUserSuccess());
      alert('User deleted successfully!');
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  // SIGN OUT
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch('http://localhost:3000/api/auth/signout', {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signOutUserFailure(data.message || 'Sign out failed'));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  // SHOW LISTINGS
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      setListingsLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/user/listings/${currentUser._id}`,
        { credentials: 'include' }
      );

      if (!res.ok) throw new Error('Failed to fetch listings');

      const data = await res.json();

      if (Array.isArray(data)) {
        setUserListings(data);
      } else {
        setShowListingsError(true);
      }

      setListingsLoading(false);
    } catch (err) {
      console.log(err);
      setShowListingsError(true);
      setListingsLoading(false);
    }
  };

  // DELETE LISTING
  const handleListingDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/delete/${listingId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        console.log(data.message || 'Delete listing failed');
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover self-center mt-2"
        />

        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Username"
        />

        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Email"
        />

        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          placeholder="Password"
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-5">User updated successfully</p>}

      <button
        onClick={handleShowListings}
        className="text-green-700 w-full mt-5"
        disabled={listingsLoading}
      >
        {listingsLoading ? 'Loading Listings...' : 'Show Listings'}
      </button>

      {showListingsError && <p className="text-red-700 mt-5">Error showing listings</p>}

      {userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>

          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls?.[0]}
                  alt={listing.name}
                  className="w-16 h-16 object-contain"
                />
              </Link>

              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline truncate"
              >
                {listing.name}
              </Link>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
