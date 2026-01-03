import axios from "axios";
import React, { createContext, useCallback, useState } from "react";
import { baseURL, getAuthHeaders } from "../Context/GlobalData";

export const globalStatsDataContext = createContext(null);
export default function GlobalStatsDataProvider(props) {
  const [overView, setOverView] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [bestBySubCategory, setBestBySubCategory] = useState([]);

  const getOverView = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/analysis/overview`, {
        headers: getAuthHeaders(),
      });

      setOverView(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getRenenue = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/analysis/revenue`, {
        headers: getAuthHeaders(),
      });

      setRevenue(data.totalSales);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getSalesByCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/analysis/category`, {
        headers: getAuthHeaders(),
      });

      setSalesByCategory(data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getOrderStatus = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/analysis/status`, {
        headers: getAuthHeaders(),
      });

      setOrderStatus(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTopProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/analysis/top`, {
        headers: getAuthHeaders(),
      });

      setTopProducts(data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getBestProductsBySubCategory = useCallback(async (subCategoryId) => {
    try {
      const { data } = await axios.get(
        `${baseURL}/analysis/bestSoldProductsOfSpecificCategory/${subCategoryId}`,
        { headers: getAuthHeaders() }
      );
      setBestBySubCategory(data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <globalStatsDataContext.Provider
      value={{
        overView,
        revenue,
        salesByCategory,
        orderStatus,
        topProducts,
        bestBySubCategory,
        getOverView,
        getRenenue,
        getSalesByCategory,
        getOrderStatus,
        getBestProductsBySubCategory,
        getTopProducts,
      }}
    >
      {props.children}
    </globalStatsDataContext.Provider>
  );
}
