import { createContext, useEffect, useState } from "react";
import { baseURL, getAuthHeaders } from "../Context/GlobalData";
import axios from "axios";
import toast from "react-hot-toast";

export let globalWishlistDataContext = createContext(null);

export default function GlobalWishlistDataProvider(props) {
  const [wishlist, setWishList] = useState([]);

  const userWishList = async () => {
    try {
      const response = await axios.get(`${baseURL}/user`, {
        headers: getAuthHeaders(),
      });
      setWishList(response.data.data.wishList);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromWishList = async (product) => {
    try {
      const response = await axios.delete(
        `${baseURL}/product/wishlist/${product._id}`,
        {
          headers: getAuthHeaders(),
        }
      );
      userWishList();
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userWishList();
  }, []);
  return (
    <globalWishlistDataContext.Provider
      value={{ wishlist, removeFromWishList }}
    >
      {props.children}
    </globalWishlistDataContext.Provider>
  );
}
