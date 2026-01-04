import { createContext, useEffect, useState } from "react";
import { baseURL, getAuthHeaders } from "../Context/GlobalData";
import axios from "axios";
import toast from "react-hot-toast";

export let globalCartDataContext = createContext(null);

export default function GlobalCartDataProvider(props) {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking login:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const getUserCartApi = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/cart`, {
        headers: getAuthHeaders(),
      });

      setCart(data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCartApi = async (product) => {
    try {
      const { data } = await axios.post(
        `${baseURL}/cart/${product._id}`,
        {},
        { headers: getAuthHeaders() }
      );
      setCart(data.data.products);
      getUserCartApi();
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCartApi = async (product) => {
    try {
      const { data } = await axios.delete(
        `${baseURL}/cart/remove/${product._id}`,
        { headers: getAuthHeaders() }
      );

      setCart(data.data.products);
      getUserCartApi();
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantityApi = async (product) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/cart/increase/${product._id}`,
        {},
        { headers: getAuthHeaders() }
      );

      setCart(data.data.products);

      getUserCartApi();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQuantityApi = async (product) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/cart/decrease/${product._id}`,
        {},
        { headers: getAuthHeaders() }
      );

      setCart(data.data.products);
      getUserCartApi();
    } catch (error) {
      console.log(error);
    }
  };

  const mergeCartApi = async (guestCart) => {
    try {
      const { data } = await axios.post(
        `${baseURL}/cart/merge`,
        { guestCart },
        { headers: getAuthHeaders() }
      );

      setCart(data.data.products);
      localStorage.removeItem("cart");
    } catch (error) {
      console.log("MERGE ERROR:", error.response?.data || error);
    }
  };

  const getUserCartLocal = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  };

  const syncLocalCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCartLocal = (product) => {
    let cartData = getUserCartLocal();
    const index = cartData.findIndex((p) => p.productId._id === product._id);

    if (index !== -1) {
      cartData[index].quantity++;
    } else {
      cartData.push({ productId: product, quantity: 1 });
    }

    syncLocalCart(cartData);
    toast.success("Added to cart 🛒");
  };

  const removeFromCartLocal = (product) => {
    const newCart = getUserCartLocal().filter(
      (p) => p.productId._id !== product._id
    );
    syncLocalCart(newCart);
    toast.success("Removed from cart 🗑");
  };

  const increaseQuantityLocal = (product) => {
    let cartData = getUserCartLocal();

    cartData = cartData.map((p) =>
      p.productId._id === product._id
        ? {
            ...p,
            quantity: p.quantity < product.stock ? p.quantity + 1 : p.quantity,
          }
        : p
    );

    syncLocalCart(cartData);
  };

  const decreaseQuantityLocal = (product) => {
    let cartData = getUserCartLocal();

    cartData = cartData.map((p) =>
      p.productId._id === product._id
        ? {
            ...p,
            quantity: p.quantity > 1 ? p.quantity - 1 : 1,
          }
        : p
    );

    syncLocalCart(cartData);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setCart(getUserCartLocal());
      getUserCartLocal();
      return;
    }

    const guestCart = getUserCartLocal();

    if (guestCart.length > 0) {
      const formattedGuestCart = guestCart.map((item) => ({
        _id: item.productId._id,
        quantity: item.quantity,
      }));

      mergeCartApi(formattedGuestCart);
    } else {
      getUserCartApi();
    }
  }, [isLoggedIn]);

  return (
    <globalCartDataContext.Provider
      value={{
        cart,
        isLoggedIn,
        addToCartApi,
        removeFromCartApi,
        increaseQuantityApi,
        decreaseQuantityApi,
        addToCartLocal,
        removeFromCartLocal,
        increaseQuantityLocal,
        decreaseQuantityLocal,
        mergeCartApi,
        getUserCartApi,
      }}
    >
      {props.children}
    </globalCartDataContext.Provider>
  );
}
