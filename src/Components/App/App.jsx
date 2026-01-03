import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Masterlayoutcomponent from "../Master Layout/Masterlayoutcomponent";
import DashboardLayout from "../Dashboard Layout/DashboardLayout";

import Homecomponent from "../Home/homecomponent";
import Cartcomponent from "../Cart/Cartcomponent";
import Logincomponent from "../Auth/Login/Logincomponent";
import Checkoutcomponent from "../Check out/Checkoutcomponent";
import Ordersuccesscomponent from "../Order success/Ordersuccesscomponent";
import Allorderscomponent from "../All orders/Allorderscomponent";
import Wishlistcomponent from "../Wishlist/Wishlistcomponent";
import Notfoundcomponent from "../Not found/Notfoundcomponent";

import Dashboardcomponent from "../Dashboard/Dashboardcomponent";
import ProductComponent from "../Dashboard/Product/ProductComponent";
import Categorycomponent from "../Dashboard/Category/Categorycomponent";
import Subcategorycomponent from "../Dashboard/Subcategory/Subcategorycomponent";
import Statscomponent from "../Dashboard/Stats/Statscomponent";
import Ordercomponent from "../Dashboard/Orders/Ordercomponent";
import Registercomponent from "../Auth/Register/Registercomponent";
import Profilecomponent from "../Profile/Profilecomponent";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "../Protected Route/ProtectedRoute";
import Productdetailscomponent from "../Product Details/Productdetailscomponent";
import Categorydetailscomponent from "../Category/Categorydetailscomponent";
import AllSubCategorycomponent from "../subCategory/allSubCategorycomponent";
import Brandcomponent from "../Dashboard/Brand/Brandcomponent";
import Couponcomponent from "../Dashboard/Coupons/Couponcomponent";
import ForgetPasswordcomponent from "../Forget Password/ForgetPasswordcomponent";
import AllBrandcomponent from "../Brand/AllBrandcomponent";
import AllProductsBySlug from "../All Products by slug/AllProductsBySlug";

export default function App() {
  const [userData, setUserData] = useState(null);

  const saveUserData = () => {
    const encodedToken = localStorage.getItem("token");
    const decodedToken = jwtDecode(encodedToken);
    setUserData(decodedToken);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setUserData(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      saveUserData();
    }
  }, []);

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Masterlayoutcomponent userData={userData} logOut={logOut} />,
      errorElement: <Notfoundcomponent />,
      children: [
        { index: true, element: <Homecomponent /> },
        {
          path: "home",
          element: <Homecomponent />,
        },
        {
          path: "details/:_id",
          element: <Productdetailscomponent />,
        },
        {
          path: "search/:productsSlug",
          element: <AllProductsBySlug />,
        },
        {
          path: "category/:categorySlug",
          element: <Categorydetailscomponent />,
        },
        {
          path: "subcategory/:subcategorySlug",
          element: <AllSubCategorycomponent />,
        },
        {
          path: "brand/:brandSlug/:brandId",
          element: <AllBrandcomponent />,
        },
        { path: "cart", element: <Cartcomponent /> },
        {
          path: "login",
          element: <Logincomponent saveUserData={saveUserData} />,
        },
        { path: "signup", element: <Registercomponent /> },

        { path: "forgetpassword", element: <ForgetPasswordcomponent /> },

        {
          path: "checkout",
          element: (
            <ProtectedRoute userData={userData}>
              <Checkoutcomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "success",
          element: (
            <ProtectedRoute userData={userData}>
              <Ordersuccesscomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "allorders",
          element: (
            <ProtectedRoute userData={userData}>
              <Allorderscomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "wishlist",
          element: (
            <ProtectedRoute userData={userData}>
              <Wishlistcomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute userData={userData}>
              <Profilecomponent logOut={logOut} />
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute userData={userData}>
              <Dashboardcomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "stats",
          element: (
            <ProtectedRoute userData={userData}>
              <Statscomponent userData={userData} />
            </ProtectedRoute>
          ),
        },
        {
          path: "product",
          element: (
            <ProtectedRoute userData={userData}>
              <ProductComponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "category",
          element: (
            <ProtectedRoute userData={userData}>
              <Categorycomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "subcategory",
          element: (
            <ProtectedRoute userData={userData}>
              <Subcategorycomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "order",
          element: (
            <ProtectedRoute userData={userData}>
              <Ordercomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "brand",
          element: (
            <ProtectedRoute userData={userData}>
              <Brandcomponent />
            </ProtectedRoute>
          ),
        },
        {
          path: "coupon",
          element: (
            <ProtectedRoute userData={userData}>
              <Couponcomponent />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </>
  );
}
