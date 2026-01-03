import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { globalCartDataContext } from "../../CartContext/CartContextData";
import styles from "./cart.module.css";
import axios from "axios";
import { baseURL } from "../../Context/GlobalData";
export default function CartComponent() {
  const {
    cart,
    isLoggedIn,

    removeFromCartApi,
    increaseQuantityApi,
    decreaseQuantityApi,

    increaseQuantityLocal,
    decreaseQuantityLocal,
    removeFromCartLocal,
  } = useContext(globalCartDataContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const applyCoupon = async () => {
    try {
      const { data } = await axios.post(
        `${baseURL}/coupon/validate`,
        { name: couponCode },
        {}
      );

      setDiscountPercent(data.data.discountPercent);
      toast.success("Coupon applied 🎉");
    } catch (error) {
      setDiscountPercent(0);
      toast.error(error.response?.data?.message || "Invalid coupon");
    }
  };

  const subTotal = cart.reduce(
    (acc, item) => acc + item.productId.finalPrice * item.quantity,
    0
  );

  const discountValue = (subTotal * discountPercent) / 100;

  const total = Math.max(subTotal - discountValue, 0);

  const isEmpty = cart.length === 0;
  const handleRemove = (product) => {
    isLoggedIn ? removeFromCartApi(product) : removeFromCartLocal(product);
  };

  const handleIncrease = (product) => {
    isLoggedIn ? increaseQuantityApi(product) : increaseQuantityLocal(product);
  };

  const handleDecrease = (product) => {
    isLoggedIn ? decreaseQuantityApi(product) : decreaseQuantityLocal(product);
  };

  // ================= UI =================
  return (
    <div className="bg-[#0B0F1A] min-h-screen py-3">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isEmpty ? (
          <div className="lg:col-span-3 flex flex-col items-center justify-center text-center py-32">
            <div className="w-32 h-32 mb-8 flex items-center justify-center rounded-full bg-indigo-600/10">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-400 max-w-md mb-8">
              You haven’t added any products to your cart yet.
            </p>
            <Link to="/home">
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* ===== CART ITEMS ===== */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => {
                const product = item.productId;
                if (!product) return null;

                return (
                  <div
                    key={product._id}
                    className="bg-[#111827] rounded-xl p-6 flex gap-6 border border-white/10"
                  >
                    <img
                      src={product.mainImage?.secure_url}
                      alt={product.name}
                      className="w-28 h-28 object-contain rounded-lg bg-white"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="text-white font-semibold text-lg">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between pt-4">
                        <button
                          onClick={() => handleRemove(product)}
                          className="text-sm text-red-400 hover:text-red-500"
                        >
                          🗑 Remove
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              item.quantity > 1 && handleDecrease(product)
                            }
                            className={styles.qtybtn}
                          >
                            −
                          </button>

                          <span className="text-white w-6 text-center font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              item.quantity < product.stock
                                ? handleIncrease(product)
                                : toast.error("No more stock available!")
                            }
                            className={styles.qtybtn}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-xl font-bold text-white">
                        EGP {product.finalPrice}
                      </p>

                      {product.discount > 0 && (
                        <>
                          <p className="text-sm text-gray-400 line-through">
                            EGP {product.price}
                          </p>
                          <p className="text-sm text-green-400">
                            {product.discount}% OFF
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== SUMMARY ===== */}
            <div className="bg-[#111827] p-6 rounded-xl space-y-4">
              <h3 className="text-white font-bold text-lg">Order Summary</h3>

              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>EGP {subTotal}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span>- EGP {discountValue.toFixed(2)}</span>
                </div>
              )}

              <hr className="border-white/10" />

              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>EGP {total}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 p-2 rounded bg-[#0B0F1A] text-white"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 bg-indigo-600 rounded text-white"
                  disabled={discountPercent > 0}
                >
                  {discountPercent > 0 ? "Applied" : "Apply"}
                </button>
              </div>

              {/* ===== Checkout Button ===== */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (cart.length === 0) {
                      toast.error("Your cart is empty!");
                      return;
                    }
                    navigate("/checkout", {
                      state: {
                        cart,
                        total,
                        discountPercent,
                        couponCode,
                      },
                    });
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
