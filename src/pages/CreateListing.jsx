import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent', // 'rent' or 'sale'
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 100,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { id, value, checked, type, name } = e.target;

    if (type === 'radio') {
      setFormData((prev) => ({ ...prev, type: value }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [id]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (+formData.discountPrice > +formData.regularPrice) {
      setError('Discount price must be less than regular price');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare payload for backend
      const payload = { ...formData };

      const res = await fetch('http://localhost:3000/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // include cookies for auth
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        {/* LEFT */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            minLength={10}
            maxLength={62}
            required
            value={formData.name}
            onChange={handleChange}
          />

          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
            value={formData.address}
            onChange={handleChange}
          />

          {/* TYPE: Sale / Rent */}
          <div className="flex gap-6 flex-wrap">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="type"
                value="sale"
                checked={formData.type === 'sale'}
                onChange={handleChange}
              />
              Sell
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="type"
                value="rent"
                checked={formData.type === 'rent'}
                onChange={handleChange}
              />
              Rent
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                checked={formData.parking}
                onChange={handleChange}
              />
              Parking
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.furnished}
                onChange={handleChange}
              />
              Furnished
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                checked={formData.offer}
                onChange={handleChange}
              />
              Offer
            </label>
          </div>

          {/* NUMBERS */}
          <div className="flex flex-wrap gap-6 mt-2">
            <input
              type="number"
              id="bedrooms"
              min={1}
              max={10}
              value={formData.bedrooms}
              onChange={handleChange}
              className="p-3 border rounded-lg"
              placeholder="Bedrooms"
            />

            <input
              type="number"
              id="bathrooms"
              min={1}
              max={10}
              value={formData.bathrooms}
              onChange={handleChange}
              className="p-3 border rounded-lg"
              placeholder="Bathrooms"
            />

            <input
              type="number"
              id="regularPrice"
              min={100}
              value={formData.regularPrice}
              onChange={handleChange}
              className="p-3 border rounded-lg"
              placeholder="Regular Price"
            />

            {formData.offer && (
              <input
                type="number"
                id="discountPrice"
                min={0}
                value={formData.discountPrice}
                onChange={handleChange}
                className="p-3 border rounded-lg"
                placeholder="Discount Price"
              />
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4 flex-1">
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
