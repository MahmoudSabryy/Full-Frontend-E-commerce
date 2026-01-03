import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { baseURL } from "../../../Context/GlobalData";

export default function Ordercomponent() {
  const [ordersData, setOrdersData] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

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

  function StatusBadge({ status }) {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}
      >
        {status.replaceAll("_", " ")}
      </span>
    );
  }

  const getAllOrders = async () => {
    try {
      const myHeaders = {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      };
      const { data } = await axios.get(`${baseURL}/order`, {
        headers: myHeaders,
      });
      setOrdersData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const changeOrderStatus = async (order, status) => {
    try {
      const myHeaders = {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      };
      const { data } = await axios.patch(
        `${baseURL}/order/${order._id}`,
        { status },
        { headers: myHeaders }
      );
      toast.success(data.message);
      getAllOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error");
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const filteredOrders = ordersData.filter((order) => {
    if (search && !order.trackingNumber.toString().includes(search.toString()))
      return false;

    if (statusFilter === "pending" && order.status !== "pending") return false;
    if (statusFilter === "preparing" && order.status !== "preparing")
      return false;
    if (statusFilter === "ready_to_ship" && order.status !== "ready_to_ship")
      return false;
    if (statusFilter === "shipped" && order.status !== "shipped") return false;
    if (
      statusFilter === "shipping_failed" &&
      order.status !== "shipping_failed"
    )
      return false;
    if (statusFilter === "delivered" && order.status !== "delivered")
      return false;
    if (statusFilter === "cancelled" && order.status !== "cancelled")
      return false;
    if (statusFilter === "returned" && order.status !== "returned")
      return false;

    if (paymentFilter === "cash" && order.paymentMethod !== "cash")
      return false;
    if (paymentFilter === "card" && order.paymentMethod !== "card")
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders Management</h1>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden bg-[#020617]">
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search by tracking or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[220px] bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready_to_ship">Ready to ship</option>
              <option value="shipped">Shipped</option>
              <option value="shipping_failed">Shipping failed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">All Payments</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-[#111827] text-gray-400">
              <tr>
                <th className="p-4 text-left">Tracking</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th className="text-right pr-6">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-t border-white/10 hover:bg-white/5 transition">
                    <td className="p-4 font-semibold">
                      #{order.trackingNumber}
                    </td>
                    <td>{order.userId?.userName}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="font-semibold text-indigo-400">
                      EGP {order.finalPrice}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="text-right pr-6">
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order._id ? null : order._id
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-xs"
                      >
                        {expandedOrderId === order._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {expandedOrderId === order._id && (
                    <tr>
                      <td
                        colSpan="6"
                        className="bg-[#020617] border-t border-white/10"
                      >
                        <div className="p-6 animate-slideDown space-y-6">
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <p>
                              <span className="text-gray-400">Customer:</span>{" "}
                              {order.userId?.userName}
                            </p>
                            <p>
                              <span className="text-gray-400">Phone:</span>{" "}
                              {order.phone[0]}
                            </p>
                            <p>
                              <span className="text-gray-400">Payment:</span>{" "}
                              {order.paymentMethod}
                            </p>
                            <p>
                              <span className="text-gray-400">Paid:</span>{" "}
                              {order.isPaid ? "Yes" : "No"}
                            </p>
                            <p className="col-span-2">
                              <span className="text-gray-400">Address:</span>{" "}
                              {order.address}
                            </p>
                          </div>

                          <div className="space-y-4">
                            {order.products.map((product) => (
                              <div
                                key={product._id}
                                className="flex items-center justify-between bg-[#111827] rounded-xl p-4"
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={product.productId.mainImage.secure_url}
                                    alt={product.name}
                                    className="w-14 h-14 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="font-semibold">
                                      {product.name}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                      {product.quantity} × EGP {product.price}
                                    </p>
                                  </div>
                                </div>

                                <p className="font-semibold text-indigo-400">
                                  EGP {product.finalPrice}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-end border-t border-white/10 pt-4">
                            <div className="text-sm space-y-1">
                              <p className="text-gray-400">
                                Subtotal: EGP {order.subTotalPrice}
                              </p>
                              <p className="text-gray-400">
                                Shipping: EGP {order.shippingPrice}
                              </p>
                              <p className="font-bold text-white">
                                Total: EGP {order.finalPrice}
                              </p>
                            </div>

                            <select
                              onChange={(e) =>
                                changeOrderStatus(order, e.target.value)
                              }
                              className="bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-sm"
                            >
                              <option value="">Change Status</option>
                              <option value="pending">pending</option>
                              <option value="preparing">preparing</option>
                              <option value="ready_to_ship">
                                ready_to_ship
                              </option>
                              <option value="shipped">shipped</option>
                              <option value="shipping_failed">
                                shipping_failed
                              </option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
