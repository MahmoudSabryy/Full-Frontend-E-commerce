import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  baseURL,
  getAuthHeaders,
  globalDataContext,
} from "../../Context/GlobalData";
import { globalCartDataContext } from "../../CartContext/CartContextData";
import toast from "react-hot-toast";

export default function Productdetailscomponent() {
  const [productData, setProductData] = useState({});
  const { addToWishlist } = useContext(globalDataContext);
  const { addToCartLocal, addToCartApi, isLoggedIn } = useContext(
    globalCartDataContext
  );

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loadingReview, setLoadingReview] = useState(false);

  const { _id } = useParams();

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      setLoadingReview(true);
      await axios.post(
        `${baseURL}/product/${_id}/review`,
        { comment, raiting: rating },
        { headers: getAuthHeaders() }
      );
      toast.success("Review added successfully ✅");
      setComment("");
      setRating(5);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error adding review");
    } finally {
      setLoadingReview(false);
    }
  };

  const getProductDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/product/details/${_id}`);
      setProductData(data.data);
    } catch (error) {
      console.log(error);
    }
  }, [_id]);

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] pt-28 text-white">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* ===== HERO ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* IMAGE */}
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <img
                src={productData?.mainImage?.secure_url}
                alt={productData?.name}
                className="w-full object-contain"
              />
            </div>
            <div className="mt-6 flex gap-3 overflow-x-auto">
              {productData?.subImages?.map((i) => (
                <div
                  key={i?.public_id}
                  className="w-20 h-20 bg-white rounded-xl p-2 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
                >
                  <img
                    src={i?.secure_url}
                    alt={productData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-8">
            <div>
              <h1 className="mt-2 text-3xl font-extrabold leading-snug">
                {productData?.name}
              </h1>
              <p className="mt-2 text-gray-400 text-sm">
                {productData?.description}
              </p>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, i) => {
                const full = i < Math.floor(productData.averageRating);
                const half =
                  i < productData.averageRating &&
                  i >= Math.floor(productData.averageRating);
                return (
                  <span
                    key={i}
                    className={`text-2xl ${
                      full
                        ? "text-yellow-400"
                        : half
                        ? "text-yellow-300"
                        : "text-gray-500"
                    }`}
                  >
                    ★
                  </span>
                );
              })}
              <span className="text-gray-400 text-sm">
                {productData.averageRating} • {productData.totalReviews} Reviews
              </span>
            </div>

            {/* PRICE CARD */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111827] to-[#020617] border border-white/10 p-6">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 blur-3xl"></div>
              <p className="text-4xl font-extrabold text-indigo-400">
                EGP {productData?.finalPrice}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-gray-400 line-through">
                  EGP {productData?.price}
                </p>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                  Save {productData?.discount}%
                </span>
              </div>
              {productData?.stock === 0 ? (
                <p className="mt-4 text-green-400 font-semibold">
                  ⛔ Out of Stock
                </p>
              ) : productData?.stock > 5 ? (
                <p className="mt-4 text-green-400 font-semibold">
                  ✔ In Stock • Ready to ship
                </p>
              ) : (
                <p className="mt-4 text-green-400 font-semibold">
                  ✔ In Stock ({productData?.stock} items remaining) • Ready to
                  ship
                </p>
              )}
            </div>

            {/* OPTIONS */}
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Color</p>
                <div className="flex gap-3">
                  {productData.colors?.map((color, index) => (
                    <span
                      key={index}
                      className="w-9 h-9 rounded-full ring-2 ring-indigo-500"
                      style={{ backgroundColor: color }}
                    ></span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm mb-2">Size</p>
                <div className="flex gap-3">
                  {productData?.size?.map((s, index) => (
                    <button
                      key={index}
                      className="px-5 py-2 rounded-xl bg-[#111827] border border-white/10 hover:border-indigo-500 transition"
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <button
                disabled={productData.stock === 0}
                onClick={(e) => {
                  e.preventDefault();
                  if (isLoggedIn) {
                    addToCartApi(productData);
                  } else {
                    addToCartLocal(productData);
                  }
                }}
                className="mt-3 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition font-bold text-lg shadow-lg shadow-indigo disabled:bg-gray-300 text-sm font-semibold rounded-md py-2"
              >
                Add to Cart
              </button>

              <button
                onClick={() => addToWishlist(productData)}
                className="w-16 h-16 rounded-2xl bg-[#111827] border border-white/10 hover:border-red-500 text-red-400 text-xl transition"
              >
                ❤
              </button>
            </div>

            {/* TRUST */}
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
              <div className="bg-[#111827] rounded-xl p-3 text-center">
                🚚 Delivery 50 EGP
              </div>
              <div className="bg-[#111827] rounded-xl p-3 text-center">
                💳 Cash / Card
              </div>
              <div className="bg-[#111827] rounded-xl p-3 text-center">
                ↩️ 14 Days Return
              </div>
            </div>
          </div>
        </div>

        {/* ===== DESCRIPTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-[#111827] rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-bold mb-4">About this product</h2>
            <p className="text-gray-400 leading-relaxed">
              {productData?.description}
            </p>
          </div>
        </div>

        {/* ===== REVIEW SECTION ===== */}
        <div className="bg-[#111827] rounded-2xl p-8 border border-white/10 mt-10 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Write a Review</h2>

          <form onSubmit={submitReview} className="space-y-4">
            {/* Rating stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Write your review..."
              className="w-full p-3 rounded-xl bg-[#0B0F1A] border border-white/10 resize-none"
              required
            />

            <button
              disabled={loadingReview || rating === 0}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loadingReview ? "Sending..." : "Submit Review"}
            </button>
          </form>

          {/* Display product rating */}
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: 5 }, (_, i) => {
              const full = i < Math.floor(productData.averageRating);
              const half =
                i < productData.averageRating &&
                i >= Math.floor(productData.averageRating);
              return (
                <span
                  key={i}
                  className={`text-2xl ${
                    full
                      ? "text-yellow-400"
                      : half
                      ? "text-yellow-300"
                      : "text-gray-500"
                  }`}
                >
                  ★
                </span>
              );
            })}
            <span className="text-gray-400 text-sm ml-2">
              {productData.averageRating} • {productData.totalReviews} Reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
