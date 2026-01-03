import { useContext } from "react";
import { Link } from "react-router-dom";
import { globalCartDataContext } from "../../CartContext/CartContextData";
import { globalWishlistDataContext } from "../../WishListContext/WishListDataContext";

export default function Wishlistcomponent() {
  const { addToCartApi, addToCartLocal, isLoggedIn } = useContext(
    globalCartDataContext
  );
  const { wishlist, removeFromWishList } = useContext(
    globalWishlistDataContext
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] ">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Wishlist</h1>
            <p className="text-gray-400 text-sm mt-1">
              Products you saved for later
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}

        {wishlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center animate-fadeIn">
            <div className="text-7xl mb-4 animate-pulse">💔</div>
            <h2 className="text-white text-xl font-semibold">
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Save products to find them easily later
            </p>
            <br />
            <Link to={"/home"}>
              <button className="mt-6 px-6 py-3  rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                Browse Products
              </button>
            </Link>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* CARD */}
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="group relative bg-[#111827] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              {/* IMAGE */}
              <div className="relative bg-white h-36 flex items-center justify-center">
                <img
                  src={product.mainImage.secure_url}
                  alt={product.name}
                  className="h-28 object-contain transition group-hover:scale-105"
                />

                {/* HEART */}
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-red-500 flex items-center justify-center transition hover:scale-110 hover:bg-red-600 hover:text-white">
                  ❤️
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-400">
                  {product.categoryId.name} • {product.subcategoryId.name}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-indigo-400 font-bold text-sm">
                    EGP {product.finalPrice}
                  </p>

                  {product.stock > 5 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                      {product.stock} Items
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
                  <button
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isLoggedIn) {
                        addToCartApi(product);
                      } else {
                        addToCartLocal(product);
                      }
                    }}
                    className="py-1.5 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishList(product)}
                    className="py-1.5 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
