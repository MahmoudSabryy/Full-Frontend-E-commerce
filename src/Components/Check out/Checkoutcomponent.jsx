import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";
import { baseURL, getAuthHeaders } from "../../Context/GlobalData";
import toast from "react-hot-toast";

export default function Checkoutcomponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post(
        `${baseURL}/order`,
        {
          address: formData.address,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
          couponName: formData.couponName || undefined,
        },
        { headers: getAuthHeaders() }
      );
      localStorage.removeItem("cart");
      if (formData.paymentMethod === "cash") {
        navigate("/success");
      } else {
        window.location.replace(response.data.data.url);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0B0F1A] pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-2 space-y-8"
          >
            {/* SHIPPING INFO */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white text-lg font-semibold mb-4">
                Shipping Information
              </h2>

              <input
                className={styles.inputdark}
                placeholder="Full Address"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="error-text">{errors.address.message}</p>
              )}

              <input
                className={`${styles.inputdark} mt-4`}
                placeholder="Phone Number"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && (
                <p className="error-text">{errors.phone.message}</p>
              )}

              <input
                className={`${styles.inputdark} mt-4`}
                placeholder="Coupon Code (optional)"
                {...register("couponName")}
              />
            </div>

            {/* PAYMENT */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white text-lg font-semibold mb-4">
                Payment Method
              </h2>

              <label className={styles.paymentoption}>
                <input
                  type="radio"
                  value="cash"
                  {...register("paymentMethod", { required: true })}
                  defaultChecked
                />
                <span>💵 Cash on Delivery</span>
              </label>

              <label className={styles.paymentoption}>
                <input
                  type="radio"
                  value="card"
                  {...register("paymentMethod")}
                />
                <span>💳 Credit / Debit Card</span>
              </label>

              {errors.paymentMethod && (
                <p className="error-text">Payment method is required</p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* RIGHT */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 h-fit sticky top-32">
            <h3 className="text-white font-semibold mb-4">Order Summary</h3>

            <p className="text-gray-400 text-sm">
              Final price will be calculated after applying coupon & shipping.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
