import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export let globalDataContext = createContext(null);

export const baseURL = "https://full-backend-e-commerce-app.vercel.app";

export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  authorization: localStorage.getItem("token"),
});

export default function GlobalDataProvider(props) {
  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);

  const getAllProducts = async () => {
    const { data } = await axios.get(`${baseURL}/product/all`);
    setProductsData(data.data);
  };

  const getAllCategories = async () => {
    const { data } = await axios.get(`${baseURL}/category`);
    setCategoriesData(data.data);
  };

  const getAllBrands = async () => {
    const { data } = await axios.get(`${baseURL}/brand`);
    setBrandsData(data.data);
  };

  const addToWishlist = async (product) => {
    try {
      const response = await axios.patch(
        `${baseURL}/product/wishlist/${product._id}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
    getAllBrands();
  }, []);

  return (
    <globalDataContext.Provider
      value={{
        productsData,
        categoriesData,
        brandsData,
        addToWishlist,
        getAllProducts,
        getAllBrands,
        getAllCategories,
      }}
    >
      {props.children}
    </globalDataContext.Provider>
  );
}
