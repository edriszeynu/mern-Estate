import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../component/ListingItem";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [showMore, setShowmore] = useState(false);
  const [listings, setListings] = useState([]);

  const handleChange = (e) => {
    if (["all", "rent", "sale"].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (["parking", "furnished", "offer"].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlparams.get("searchTerm");
    const typeFromUrl = urlparams.get("type");
    const parkingFromUrl = urlparams.get("parking");
    const furnishedFromUrl = urlparams.get("furnished");
    const sortFromUrl = urlparams.get("sort");
    const orderFromUrl = urlparams.get("order");
    const offerFromUrl = urlparams.get("offer");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlparams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();

        console.log(data);
        if (data.length > 8) {
          setShowmore(true);
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams();
    urlparams.set("searchTerm", sidebardata.searchTerm);
    urlparams.set("type", sidebardata.type);
    urlparams.set("parking", sidebardata.parking);
    urlparams.set("furnished", sidebardata.furnished);
    urlparams.set("offer", sidebardata.offer);
    urlparams.set("sort", sidebardata.sort);
    urlparams.set("order", sidebardata.order);

    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    try {
      setLoading(true);
      setShowmore(false);

      // Get current number of listings
      const startIndex = listings.length;

      // Build query string
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);

      // Fetch data
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();

      // Decide whether to show "Show More"
      if (data.length > 8) {
        setShowmore(true);
      } else {
        setShowmore(false);
      }

      // Append new listings
      setListings([...listings, data]);
    } catch (err) {
      console.error("Error fetching more listings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search Term */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className="flex gap-2 flex-wrap items-center ">
            <label>Type:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                id="all"
                name="type"
                value="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="type"
                value="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="type"
                value="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 flex-wrap items-center ">
            <label>Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label>Sort:</label>
            <select
              id="sort_order"
              value={`${sidebardata.sort}_${sidebardata.order}`}
              onChange={handleChange}
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* Listings */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results
        </h1>
        <div className="p-3 flex flex-wrap gap-2">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700 text-center">
              No listings found
            </p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center">Loading...</p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
