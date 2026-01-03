import { useContext, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { globalStatsDataContext } from "../../../StatsContext/StatsContextData";

export default function Statscomponent({ userData }) {
  const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899", "#14b8a6"];
  const {
    overView,
    revenue,
    salesByCategory,
    orderStatus,
    topProducts,
    getOverView,
    getRenenue,
    getSalesByCategory,
    getOrderStatus,
    getTopProducts,
  } = useContext(globalStatsDataContext);
  useEffect(() => {
    getOverView();
    getRenenue();
    getSalesByCategory();
    getOrderStatus();
    getTopProducts();
  }, [
    getOverView,
    getRenenue,
    getSalesByCategory,
    getOrderStatus,
    getTopProducts,
  ]);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedRevenue = revenue.map((item) => ({
    month: monthNames[item._id - 1],
    revenue: item.totalSales,
    orders: item.totalOrders,
  }));

  const formattedSalesByCategory = salesByCategory.map((item) => ({
    name: item.categoryName,
    value: item.totalRevenue,
  }));

  return (
    <div className="pt-[130px] min-h-screen bg-[#0B0F1A] px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {userData?.userName} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here’s what’s happening with your store today
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Sales" value={overView?.totalSales + " EGP"} />
          <StatCard title="Completed Orders" value={overView?.totalOrders} />
          <StatCard title="Refunded" value="2" />
          <StatCard title="Active Products" value={overView?.activeProducts} />
          <StatCard
            title="Low Stock Products"
            value={overView?.lowStockProducts}
          />
          <StatCard
            title="Out of Stock Products"
            value={overView?.outOfStock}
          />
        </div>

        {/* CHART + SIDE */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* REVENUE */}
          <div className="xl:col-span-2 bg-[#111827] border border-white/10 rounded-2xl p-6 ">
            <h3 className="text-white font-semibold mb-4">Revenue vs Orders</h3>

            <div className="h-[260px] flex items-center justify-center text-gray-500 text-sm">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#22c55e"
                    strokeWidth={3}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">
            {/* SALES BY CATEGORY */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4">
                Sales by Category
              </h4>

              <div className="h-[180px] flex items-center justify-center text-gray-500 text-sm">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={formattedSalesByCategory}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={70}
                      fill="#8884d8"
                      label
                    >
                      {formattedSalesByCategory.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ORDER STATUS */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-white font-semibold mb-2">Order Status</h4>
              {orderStatus &&
                Object.entries(orderStatus).length > 0 &&
                Object.entries(orderStatus).map(([status, count], idx) => (
                  <Progress
                    key={idx}
                    label={status.replaceAll("_", " ")}
                    value={`${count}`}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Top Products</h3>
            <input
              placeholder="Search product..."
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
            />
          </div>

          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <ProductRow
                key={index}
                name={product.name}
                totalItemsSold={product.totalItemsSold}
                totalItemsRevenue={product.totalItemsRevenue}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 hover:shadow-lg hover:shadow-indigo-500/10 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="mt-2 text-xl font-extrabold text-white">{value}</h3>
    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full"
          style={{ width: Math.min(value, 100) + "%" }}
        />
      </div>
    </div>
  );
}

function ProductRow({ name, totalItemsSold, totalItemsRevenue }) {
  return (
    <div className="grid grid-cols-3 gap-10 text-sm bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-3 text-gray-300">
      <span className="text-white font-medium">{name}</span>
      <span> {totalItemsSold}</span>
      <span className="text-green-400">EGP {totalItemsRevenue}</span>
    </div>
  );
}
