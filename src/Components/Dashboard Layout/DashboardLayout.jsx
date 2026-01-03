import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white relative">
      {/* Leave icon */}
      <Link
        to="/home"
        className="fixed top-4 right-4 z-50
             bg-info/90 backdrop-blur
             p-3 rounded-full
             shadow-[0_0_25px_rgba(99,102,241,0.6)]
             hover:bg-indigo-500
             transition"
      >
        <img
          src="/images/leaveicon.png"
          alt="Leave"
          className="w-8 h-8 invert hover:invert-0 transition"
        />
      </Link>

      {/* Sidebar */}
      <aside className="w-64 bg-[#020617] border-r border-white/10 p-6">
        <h2 className="text-2xl font-extrabold mb-8 text-indigo-400">Admin</h2>

        <nav className="space-y-4">
          <Link to="/dashboard/stats" className="block hover:text-indigo-400">
            📊 Stats
          </Link>

          <Link to="/dashboard/product" className="block hover:text-indigo-400">
            📦 Products
          </Link>

          <Link
            to="/dashboard/category"
            className="block hover:text-indigo-400"
          >
            🗂 Categories
          </Link>

          <Link
            to="/dashboard/subcategory"
            className="block hover:text-indigo-400"
          >
            🧩 SubCategories
          </Link>

          <Link to="/dashboard/order" className="block hover:text-indigo-400">
            🗳 Order
          </Link>

          <Link to="/dashboard/brand" className="block hover:text-indigo-400">
            💹 Brand
          </Link>

          <Link to="/dashboard/coupon" className="block hover:text-indigo-400">
            🎫 Coupon
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
