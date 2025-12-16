import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import Contact from "../component/Contact";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/listing/get/${params.listingId}`
        );

        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  if (error)
    return (
      <p className="text-center my-7 text-red-500">Something went wrong!</p>
    );

  return (
    <main className="max-w-6xl mx-auto p-4">
      {listing && (
        <>
          {/* 🖼 Image Slider */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 📌 Listing Info */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{listing.name}</h1>
            <p className="text-gray-600 mt-2">{listing.address}</p>

            <p className="mt-4 text-lg">{listing.description}</p>

            <div className="mt-4 flex flex-wrap gap-6 text-lg">
              <p>
                <strong>Price:</strong> ${listing.regularPrice}
              </p>
              {listing.discountPrice && (
                <p>
                  <strong>Discount Price:</strong> ${listing.discountPrice}
                </p>
              )}
              <p>
                <strong>Bedrooms:</strong> {listing.bedrooms}
              </p>
              <p>
                <strong>Bathrooms:</strong> {listing.bathrooms}
              </p>
              <p>
                <strong>Furnished:</strong> {listing.furnished ? "Yes" : "No"}
              </p>
              <p>
                <strong>Parking:</strong>{" "}
                {listing.parking ? "Available" : "Not Available"}
              </p>
              <p>
                <strong>Type:</strong> {listing.type}
              </p>
              <p>
                <strong>Offer:</strong> {listing.offer ? "Yes" : "No"}
              </p>
            </div>
            {currentUser &&
              listing.userRef !== currentUser._id &&
              !contact(
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
