import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Context/GlobalData";
import { globalCartDataContext } from "../../CartContext/CartContextData";

export default function AllProductsBySlug() {
  const { productsSlug } = useParams();
  const decodedSlug = decodeURIComponent(productsSlug);

  const { addToCartApi, addToCartLocal, isLoggedIn } = useContext(
    globalCartDataContext
  );

  console.log(decodedSlug);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [priceRange, setPriceRange] = useState(300000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/product/allslug/${decodedSlug}`
        );

        setProducts(data.data);
        setFilteredProducts(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [productsSlug]);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let temp = [...products];

    // price filter
    temp = temp.filter((p) => p.finalPrice <= priceRange);

    // stock filter
    if (inStockOnly) {
      temp = temp.filter((p) => p.stock > 0);
    }

    // sort
    if (sortBy === "low") {
      temp.sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (sortBy === "high") {
      temp.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    setFilteredProducts(temp);
  }, [priceRange, inStockOnly, sortBy, products]);

  return (
    <>
      {/* ================= MAIN ================= */}
      <section className="bg-gray-50 py-12">
        <div className="px-6 flex gap-8">
          {/* ================= SIDEBAR ================= */}
          <aside className="hidden lg:block w-72 bg-white rounded-3xl shadow p-6 h-fit sticky top-24">
            <h3 className="text-xl font-extrabold mb-6">Filters</h3>

            {/* PRICE */}
            <div className="mb-6">
              <h4 className="font-bold mb-2">Price</h4>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full"
              />
              <p className="text-sm mt-2 font-semibold">
                Up to EGP {priceRange}
              </p>
            </div>

            {/* STOCK */}
            <div className="mb-6">
              <label className="flex items-center gap-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In Stock Only
              </label>
            </div>

            {/* SORT */}
            <div>
              <h4 className="font-bold mb-2">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded-xl px-3 py-2"
              >
                <option value="">Default</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
            </div>
          </aside>

          {/* ================= PRODUCTS ================= */}
          <div className="flex-1">
            {loading && (
              <div className="text-center py-32 text-gray-500 font-semibold">
                Loading Products...
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-32 text-gray-500 font-semibold">
                No Products Found
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-3xl border shadow-sm hover:shadow-2xl transition overflow-hidden"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100">
                      <img
                        src={product.mainImage.secure_url}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition"
                      />

                      {product.discount > 0 && (
                        <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-bold line-clamp-2 min-h-[42px]">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex gap-2 items-center">
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
                          onClick={() => addToCartApi(product)}
                          disabled={product.stock === 0}
                          className="mt-4 w-full bg-black hover:bg-indigo-600 text-white py-2 rounded-xl font-bold transition disabled:bg-gray-300"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCartLocal(product)}
                          disabled={product.stock === 0}
                          className="mt-4 w-full bg-black hover:bg-indigo-600 text-white py-2 rounded-xl font-bold transition disabled:bg-gray-300"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
