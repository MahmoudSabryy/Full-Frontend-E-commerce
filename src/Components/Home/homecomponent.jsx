import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useContext, useEffect } from "react";
import { globalDataContext } from "../../Context/GlobalData";
import { globalCartDataContext } from "../../CartContext/CartContextData";
import { globalStatsDataContext } from "../../StatsContext/StatsContextData";

export default function Homecomponent() {
  const { categoriesData, addToWishlist, brandsData } =
    useContext(globalDataContext);

  const { addToCartApi, isLoggedIn, addToCartLocal } = useContext(
    globalCartDataContext
  );
  const { topProducts, bestBySubCategory, getBestProductsBySubCategory } =
    useContext(globalStatsDataContext);
  useEffect(() => {
    if (categoriesData?.length) {
      categoriesData.forEach((cat) => {
        cat.subcategories.forEach((sub) => {
          getBestProductsBySubCategory(sub._id);
        });
      });
    }
  }, [categoriesData, getBestProductsBySubCategory]);

  return (
    <>
      {/* banner */}
      <div className="w-full px-4">
        <img
          src="/images/installment.gif"
          alt="Installment Banner"
          className="w-full max-h-[120px] md:max-h-[160px] object-cover rounded-xl shadow-sm"
        />
      </div>

      {/* mainSlider */}
      <section className="bg-white py-1">
        <div className="w-full px-4 flex justify-center">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            allowSlideNext
            allowTouchMove
            className="rounded-xl overflow-hidden"
          >
            <SwiperSlide>
              <img
                src="/images/1.avif"
                alt="1"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                src="/images/2.avif"
                alt="2"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                src="/images/3.avif"
                alt="3"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                src="/images/4.avif"
                alt="4"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                src="/images/5.avif"
                alt="5"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>

            <SwiperSlide>
              <img
                src="/images/6.avif"
                alt="6"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* categorySlider */}
      <div className="w-full px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={6}
          className="py-10"
        >
          {categoriesData.map((cat) => (
            <SwiperSlide key={cat._id}>
              <Link to={`/category/${cat.slug}`}>
                <div className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl">
                  <div className="w-full h-36 overflow-hidden rounded-t-2xl bg-gray-50 flex items-center justify-center">
                    <img
                      src={cat.image.secure_url}
                      alt={cat.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-center mt-2 font-semibold text-gray-900 text-sm line-clamp-2">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Categories Section */}
      {categoriesData.map((cat) => (
        <section key={cat._id} className="bg-gray-100 py-8">
          <div className="px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {cat.name}
              </h2>

              <Link
                to={`/category/${cat.slug}`}
                className="border border-gray-400 text-base font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                VIEW ALL
              </Link>
            </div>

            {/* SubCategories Slider */}
            <Swiper
              spaceBetween={16}
              slidesPerView={2}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                480: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="py-2"
            >
              {cat.subcategories.map((sub) => (
                <SwiperSlide key={sub._id}>
                  <Link to={`/subcategory/${sub.slug}`}>
                    <div className="flex flex-col items-center text-center cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl rounded-3xl bg-white overflow-hidden shadow-lg">
                      <div className="w-40 h-48 relative overflow-hidden rounded-t-3xl bg-gray-50 flex items-center justify-center">
                        {sub.image?.secure_url ? (
                          <img
                            src={sub.image.secure_url}
                            alt={sub.name}
                            className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300" />
                        )}
                      </div>

                      <span className="mt-4 mb-6 text-lg font-bold text-gray-900">
                        {sub.name}
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      ))}

      {/* Best Sellers */}
      {topProducts.length > 0 ? (
        <section className="bg-white py-10">
          <div className="w-full px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Best Seller
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topProducts.map((item) => (
                <div
                  key={item._id}
                  className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition"
                >
                  <Link
                    to={`/details/${item._id}`}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                      <span
                        className="
  absolute top-4 -left-10 z-10
  rotate-[-45deg]
  bg-gradient-to-r from-emerald-600 to-green-500
  text-white text-[11px] font-bold
  px-12 py-1
  shadow-lg
"
                      >
                        BEST SELLER
                      </span>

                      <img
                        src={item.product.mainImage.secure_url}
                        alt={item.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                      />

                      {item.discount > 0 && (
                        <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                          {item.discount}% OFF
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToWishlist(item);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-110 transition"
                      >
                        ❤️
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold line-clamp-2 min-h-[40px]">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-extrabold">
                          EGP {item.finalPrice}
                        </span>
                        {item.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            EGP {item.price}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCartLocal(item);
                        }}
                        className="mt-4 w-full bg-black hover:bg-indigo-600 text-white py-2 rounded-xl font-bold transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        ""
      )}

      {/* Best Sellers in {sub.name} */}
      {categoriesData.map((cat) =>
        cat.subcategories.map((sub) =>
          bestBySubCategory[sub._id]?.length ? (
            <section key={sub._id} className="bg-white py-8">
              <div className="px-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">
                  Best Sellers in {sub.name}
                </h2>

                <Swiper
                  spaceBetween={16}
                  slidesPerView={2}
                  breakpoints={{
                    480: { slidesPerView: 2 },
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
                  }}
                >
                  {bestBySubCategory[sub._id].map((product) => (
                    <SwiperSlide key={product._id}>
                      <Link
                        to={`/details/${product._id}`}
                        className="group relative bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition"
                      >
                        {/* Image */}
                        <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                          <span
                            className="
  absolute top-4 -left-10 z-10
  rotate-[-45deg]
  bg-gradient-to-r from-emerald-600 to-green-500
  text-white text-[11px] font-bold
  px-12 py-1
  shadow-lg
"
                          >
                            BEST SELLER
                          </span>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                          />

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
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          ) : null
        )
      )}

      {/* Your Favorite Brands */}
      <div className="w-full px-4 py-10 bg-white rounded-xl shadow-sm">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-900 flex items-center justify-center gap-3">
          Your Favorite Brands
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={false}
          pagination={false}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={8}
          slidesPerView={8}
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
          className="py-4"
        >
          {brandsData.map((brand) => (
            <SwiperSlide key={brand._id} className="flex justify-center">
              <Link to={`/brand/${brand.slug}/${brand._id}`}>
                <div className="w-32 h-32 flex items-center justify-center cursor-pointer rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <img
                    src={brand.image.secure_url}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
