import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseURL, getAuthHeaders } from "../Context/GlobalData";
import toast from "react-hot-toast";

export const globalCouponDataContext = createContext(null);

export default function GlobalCouponDataProvider(props) {
  const [couponsData, setCouponsData] = useState([]);

  const getAllCoupons = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/coupon`, {
        headers: getAuthHeaders(),
      });

      setCouponsData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deletecoupon = async (couponId) => {
    try {
      const { data } = await axios.delete(
        `${baseURL}/coupon/delete/${couponId}`,
        { headers: getAuthHeaders() }
      );
      getAllCoupons();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const undeletecoupon = async (couponId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/coupon/undelete/${couponId}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(data.message);

      getAllCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  const activatecoupon = async (couponId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/coupon/activate/${couponId}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(data.message);

      getAllCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  const deactivatecoupon = async (couponId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/coupon/deactivate/${couponId}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(data.message);

      getAllCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, []);

  return (
    <globalCouponDataContext.Provider
      value={{
        couponsData,
        getAllCoupons,
        deactivatecoupon,
        activatecoupon,
        deletecoupon,
        undeletecoupon,
      }}
    >
      {props.children}
    </globalCouponDataContext.Provider>
  );
}
