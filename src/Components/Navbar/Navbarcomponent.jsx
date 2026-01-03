import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { globalCartDataContext } from "../../CartContext/CartContextData";
import { globalWishlistDataContext } from "../../WishListContext/WishListDataContext";

export default function Navbarcomponent({ userData, logOut }) {
  const { cart } = useContext(globalCartDataContext);
  const { wishlist } = useContext(globalWishlistDataContext);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {}, [search, setSearch]);

  return (
    <>
      <nav className="bg-[#0B0F1A]/80 backdrop-blur h-20">
        <div className="px-6 h-20 flex items-center gap-6">
          <Link to="home">
            <h1 className="text-2xl font-extrabold text-white cursor-pointer">
              E<span className="text-indigo-500">.</span>Shop
            </h1>
          </Link>

          <div className="flex-1 relative">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search products, brands..."
              className="w-full h-11 pl-4 pr-12 rounded-xl bg-[#111827] text-gray-200 placeholder-gray-400 outline-none border border-white/10 focus:border-indigo-500 transition"
            />
            <button
              onClick={() => {
                if (search) {
                  navigate(`/search/${search}`);
                  setSearch(null);
                } else {
                  navigate(`/home`);
                }
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white h-9 w-10 rounded-lg flex items-center justify-center transition"
            >
              🔍
            </button>
          </div>

          <div className="flex items-center gap-5 text-gray-300">
            {userData && (
              <Link className="relative" to={"/wishlist"}>
                ❤️
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-xs px-2 rounded-full">
                  {wishlist.length}
                </span>
              </Link>
            )}

            <Link className="relative" to="cart">
              🛒
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-xs px-2 rounded-full">
                {cart.length}
              </span>
            </Link>

            {userData ? (
              <div className="relative group">
                {/* Profile Icon */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {userData.userName?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-48 bg-[#0B0F1A] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-semibold">
                      {userData.userName}
                    </p>
                    <p className="text-xs text-gray-400">{userData.email}</p>
                  </div>

                  <ul className="py-2 text-gray-300">
                    <li>
                      <Link
                        to={"/profile"}
                        className="block px-4 py-2 hover:bg-indigo-600/20 hover:text-white transition"
                      >
                        👤 Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/allorders"
                        className="block px-4 py-2 hover:bg-indigo-600/20 hover:text-white transition"
                      >
                        📦 Orders
                      </Link>
                    </li>

                    {userData.role === "admin" && (
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-indigo-600/20 hover:text-white transition"
                        >
                          🧠 Dashboard
                        </Link>
                      </li>
                    )}

                    <li>
                      <button
                        onClick={() => {
                          logOut();
                          navigate("/login");
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition"
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition">
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            {!userData?.role === "admin" && (
              <Link to={"/dashboard"}>
                <ul>
                  <li className="cursor">Dashboard</li>
                </ul>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
