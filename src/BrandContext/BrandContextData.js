import axios from "axios";
import { createContext, useContext } from "react";
import {
  baseURL,
  getAuthHeaders,
  globalDataContext,
} from "../Context/GlobalData";
import toast from "react-hot-toast";

export const globalBrandDataContext = createContext(null);

export default function GlobalBrandDataProvider(props) {
  const { getAllBrands } = useContext(globalDataContext);
  const deleteBrand = async (brandId) => {
    try {
      const { data } = await axios.delete(
        `${baseURL}/brand/delete/${brandId}`,
        { headers: getAuthHeaders() }
      );
      getAllBrands();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const undeleteBrand = async (brandId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/brand/undelete/${brandId}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(data.message);

      getAllBrands();
    } catch (error) {
      console.log(error);
    }
  };

  const activateBrand = async (brandId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/brand/activate/${brandId}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(data.message);

      getAllBrands();
    } catch (error) {
      console.log(error);
    }
  };

  const deactivateBrand = async (brandId) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/brand/deactivate/${brandId}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(data.message);

      getAllBrands();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <globalBrandDataContext.Provider
      value={{ deleteBrand, undeleteBrand, activateBrand, deactivateBrand }}
    >
      {props.children}
    </globalBrandDataContext.Provider>
  );
}
