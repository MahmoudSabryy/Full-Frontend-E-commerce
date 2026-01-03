import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import { baseURL, globalDataContext } from "../../Context/GlobalData";
import { globalCartDataContext } from "../../CartContext/CartContextData";

export default function Categorydetailscomponent() {
  const { categorySlug } = useParams();
  const { addToWishlist } = useContext(globalDataContext);
  const { addToCartApi, addToCartLocal, isLoggedIn } = useContext(
    globalCartDataContext
  );

  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(300000);
  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    const getCategoryProducts = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/category/slug/${categorySlug}/product/slug/related`
        );
        setProducts(data.data);

        if (data.data.length) {
          setCategoryInfo(data.data[0].categoryId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCategoryProducts();
  }, [categorySlug]);

  /* ================= FILTER + SORT ================= */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    list = list.filter((p) => p.finalPrice <= priceRange);

    if (sort === "low") {
      list.sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (sort === "high") {
      list.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    return list;
  }, [products, sort, inStockOnly, priceRange]);

  const isEmpty = filteredProducts.length === 0;

  return (
    <>
      {/* ================= CATEGORY BANNER ================= */}
      <div className="relative w-full h-[300px]">
        {categoryInfo?.image?.secure_url ? (
          <img
            src={categoryInfo.image.secure_url}
            alt={categoryInfo.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="px-8 text-white">
            <h1 className="text-4xl font-extrabold capitalize">
              {categoryInfo?.name || categorySlug}
            </h1>
            <p className="mt-2 text-white/80 text-lg">
              {products.length} Products Available
            </p>
          </div>
        </div>
      </div>

      {/* ================= BREADCRUMB ================= */}
      <div className="px-6 py-4 text-sm text-gray-500 bg-white border-b">
        <Link to="/home" className="hover:text-indigo-600">
          Home
        </Link>{" "}
        / <span className="capitalize">{categorySlug}</span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="bg-gray-50 py-10">
        <div className="px-6 flex gap-8">
          {/* ================= SIDEBAR ================= */}
          <aside className="hidden lg:block w-64 bg-white rounded-2xl p-6 shadow">
            <h3 className="text-lg font-extrabold mb-6">Filters</h3>

            {/* Stock */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                />
                <span className="font-semibold text-sm">In Stock Only</span>
              </label>
            </div>

            {/* Price */}
            <div>
              <h4 className="font-bold mb-2">Max Price</h4>
              <input
                type="range"
                min="100"
                max="100000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full"
              />
              <div className="mt-1 text-sm font-semibold">EGP {priceRange}</div>
            </div>
          </aside>

          {/* ================= MAIN ================= */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold">Products</h2>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded-xl px-4 py-2 text-sm font-semibold"
              >
                <option value="default">Sort By</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>

            {/* EMPTY */}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-6xl mb-6">😕</span>
                <h3 className="text-2xl font-bold mb-2">
                  No Products Match Your Filters
                </h3>
                <p className="text-gray-500">
                  Try changing filters or sorting.
                </p>
              </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/details/${product._id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.mainImage.secure_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    />

                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                        🎫 {product.discount}% OFF
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-110 transition"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold line-clamp-2 min-h-[40px]">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-extrabold">
                        EGP {product.finalPrice}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          EGP {product.price}
                        </span>
                      )}
                    </div>

                    {isLoggedIn ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCartApi(product);
                        }}
                        className="mt-4 w-full bg-black hover:bg-indigo-600 text-white py-2 rounded-xl font-bold transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCartLocal(product);
                        }}
                        className="mt-4 w-full bg-black hover:bg-indigo-600 text-white py-2 rounded-xl font-bold transition"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
