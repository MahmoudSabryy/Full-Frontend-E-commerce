import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { baseURL, getAuthHeaders } from "../../Context/GlobalData";
import toast from "react-hot-toast";

export default function Allorderscomponent() {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  let [ordersData, setOrdersData] = useState([]);

  const statusStyles = {
    pending: "bg-yellow-500/20 text-yellow-400",
    preparing: "bg-blue-500/20 text-blue-400",
    ready_to_ship: "bg-purple-500/20 text-purple-400",
    shipped: "bg-orange-500/20 text-orange-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
    shipping_failed: "bg-red-700/30 text-red-500",
    returned: "bg-gray-500/20 text-gray-400",
  };

  const getAllOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/order`, {
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      setOrdersData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const refund = async (orderId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/order/refund/${orderId}`,
        {},
        { headers: getAuthHeaders() }
      );

      getAllOrders();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/order/cancel/${orderId}`,
        {},
        { headers: getAuthHeaders() }
      );

      getAllOrders();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  if (ordersData.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-6 animate-fadeIn">
            <div className="relative mx-auto w-24 h-24 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
              <span className="absolute inset-0 rounded-2xl bg-indigo-600/20 blur-xl animate-pulse"></span>
              <span className="relative text-4xl">📦</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              No Orders Yet
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              You haven’t placed any orders yet. Start shopping and your orders
              will appear here.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition hover:scale-[1.03]">
                Start Shopping
              </button>

              <button className="px-6 py-3 rounded-xl border border-white/15 text-gray-300 hover:text-white hover:border-indigo-500 transition">
                Back Home
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 pt-6 text-xs text-gray-500">
              <span className="w-10 h-px bg-white/10"></span>
              <span>E-Shop</span>
              <span className="w-10 h-px bg-white/10"></span>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-[#0B0F1A] ">
        <div className="max-w-7xl mx-auto space-y-8 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              My Orders
            </h1>

            <span className="text-sm text-gray-400">
              Total Orders: {ordersData.length}
            </span>
          </div>

          {ordersData.map((order) => (
            <div key={order._id} className="space-y-6">
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all duration-300 animate-fadeIn">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-white font-semibold">
                      Order #{order.trackingNumber}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[order.status] ||
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {order.status.replaceAll("_", " ").toUpperCase()}
                    </span>

                    <span className="text-white font-bold">
                      EGP {order.finalPrice}
                    </span>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.products.map((p) => (
                    <div key={p._id} className="flex gap-4">
                      <img
                        src={p.productId.mainImage.secure_url}
                        alt=""
                        className="w-20 h-20 rounded-lg bg-white object-contain"
                      />
                      <div>
                        <h4 className="text-white text-sm font-medium">
                          {p.productId.name}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          Qty: {p.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Payment: {order.paymentMethod}
                  </span>

                  <button
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order._id ? null : order._id
                      )
                    }
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                  >
                    {expandedOrderId === order._id
                      ? "Hide Details ↑"
                      : "View Details →"}
                  </button>

                  {!order.isCancelled &&
                    order.paymentMethod === "card" &&
                    ["pending", "preparing", "ready_to_ship"].includes(
                      order.status
                    ) && (
                      <button
                        onClick={() => refund(order._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Refund
                      </button>
                    )}
                  {!order.isCancelled &&
                    order.paymentMethod === "cash" &&
                    ["pending", "preparing", "ready_to_ship"].includes(
                      order.status
                    ) && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    )}
                </div>

                {/* ✅ EXPANDED DETAILS */}
                {expandedOrderId === order._id && (
                  <div className="mt-6 border-t border-white/10 pt-4 space-y-3 animate-fadeIn">
                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Address:</span>{" "}
                      {order.address}
                    </div>

                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Phone:</span>{" "}
                      {order.phone}
                    </div>

                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Paid:</span>{" "}
                      {order.isPaid ? "✅" : "❌"}
                    </div>

                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Status:</span>{" "}
                      {order.status.replaceAll("_", " ")}
                    </div>

                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">shipping Price:</span> EGP{" "}
                      {order.shippingPrice}
                    </div>

                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">sub total Price:</span>{" "}
                      EGP {order.subTotalPrice}
                    </div>

                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Total Price:</span> EGP{" "}
                      {order.finalPrice}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
