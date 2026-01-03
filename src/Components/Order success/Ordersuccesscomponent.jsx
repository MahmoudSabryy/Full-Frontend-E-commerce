import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseURL, getAuthHeaders } from "../../Context/GlobalData";

export default function PaymentResult() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderStatus = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/order/latest`, {
          headers: getAuthHeaders(),
        });
        setOrderData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getOrderStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B0F1A]">
        Loading order...
      </div>
    );
  }

  // لو الطلب فشل
  if (orderData.status === "cancelled" || orderData.isPaid === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F1A] text-white px-6">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Payment Failed ❌
        </h1>
        <p className="text-gray-400 mb-6">
          Something went wrong with your payment. Please try again.
        </p>
        <Link to="/checkout">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold">
            Retry Payment
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-400 mb-6">
              ✔
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Order Placed 🎉
            </h1>
            <p className="text-gray-400">Thank you for your purchase!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Info */}
            <div className="bg-[#0B0F1A] p-6 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-4">
                Shipping Information
              </h3>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white mb-2">{orderData.userId.userName}</p>
              <p className="text-gray-400 text-sm">Phone</p>
              <p className="text-white mb-2">{orderData.phone}</p>
              <p className="text-gray-400 text-sm">Address</p>
              <p className="text-white">{orderData.address}</p>
            </div>

            {/* Order Info */}
            <div className="bg-[#0B0F1A] p-6 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-4">Order Details</h3>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">Order ID</span>
                <span className="text-white font-medium">
                  #{orderData.trackingNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-green-400">
                  {orderData.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">Status</span>
                <span className="text-yellow-400">{orderData.status}</span>
              </div>
              <hr className="border-white/10 my-4" />
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span> {orderData.finalPrice} EGP</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/allorders">
              <button className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                View Orders
              </button>
            </Link>
            <Link to="/home">
              <button className="px-8 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
