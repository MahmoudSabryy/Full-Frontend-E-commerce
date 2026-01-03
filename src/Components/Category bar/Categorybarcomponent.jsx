import { useContext } from "react";
import { globalDataContext } from "../../Context/GlobalData";
import { Link } from "react-router-dom";

export default function Categorybarcomponent() {
  const { categoriesData } = useContext(globalDataContext);

  return (
    <nav className="bg-[#111827]/90 h-12 relative overflow-visible">
      <div className="px-6 h-12 flex items-center gap-10 text-sm">
        {categoriesData.map((cat) => (
          <div key={cat._id} className="group">
            {/* Category Name */}
            <span className="flex items-center gap-1 text-gray-300 cursor-pointer hover:text-white transition">
              {cat.name}
              <svg
                className="w-3 h-3 transition group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>

            {/* MEGA MENU */}
            <div
              className="
                absolute top-full left-0 right-0
                bg-[#0B0F1A]
                border-t border-white/10
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-300
                shadow-2xl z-50
              "
            >
              <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-4 gap-10">
                {/* Subcategories */}
                {cat.subcategories.map((sub) => (
                  <div key={sub._id}>
                    <Link
                      to={`/subcategory/${sub.slug}`}
                      className="block text-white font-semibold mb-4 hover:text-indigo-400 transition"
                    >
                      {sub.name}
                    </Link>

                    <ul className="space-y-2 text-gray-400">
                      {sub.subsubcategory.map((subsub) => (
                        <li
                          key={subsub._id}
                          className="hover:text-indigo-400 cursor-pointer transition"
                        >
                          {subsub.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
