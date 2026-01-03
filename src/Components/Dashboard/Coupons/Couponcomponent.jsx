import { useContext, useState } from "react";
import { baseURL } from "../../../Context/GlobalData";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { globalCouponDataContext } from "../../../CouponContext/CouponContextData";

export default function Couponcomponent() {
  const {
    couponsData,
    getAllCoupons,
    deactivatecoupon,
    activatecoupon,
    deletecoupon,
    undeletecoupon,
  } = useContext(globalCouponDataContext);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedcoupon, setSelectedCoupon] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const myHeaders = {
    authorization: localStorage.getItem("token"),
  };

  const addCouponSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);

      formData.append("isActive", data.isActive);

      formData.append("amount", data.amount);

      formData.append("expireDate", data.expireDate);

      if (data.file && data.file[0]) {
        formData.append("image", data.file);
      }

      const response = await axios.post(`${baseURL}/coupon`, formData, {
        headers: myHeaders,
      });
      getAllCoupons();
      setAddModal(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data.error);
      console.log(error);
    }
  };

  const editCouponSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.name) {
        formData.append("name", data.name);
      }
      if (data.expireDate) {
        formData.append("expireDate", data.expireDate);
      }
      if (data.amount) {
        formData.append("amount", data.amount);
      }
      if (data.file && data.file[0]) {
        formData.append("image", data.file[0]);
      }

      const response = await axios.put(
        `${baseURL}/coupon/${selectedcoupon._id}`,
        formData,
        { headers: myHeaders }
      );
      getAllCoupons();
      toast.success(response.data.message);
      setEditModal(false);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data.error);
    }
  };

  const filteredCoupons = couponsData.filter((coupon) => {
    if (
      search &&
      !coupon.name.toLowerCase().trim().includes(search.toLowerCase().trim())
    )
      return false;

    if (status === "Active" && coupon.isActive !== true) return false;

    if (status === "Inactive" && coupon.isActive !== false) return false;

    if (deleted === "NotDeleted" && coupon.isDeleted !== false) return false;

    if (deleted === "Deleted" && coupon.isDeleted !== true) return false;

    return true;
  });

  return (
    <>
      <div className="min-h-screen bg-[#0B0F1A] pt-32 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Coupons</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage Coupons & visibility
              </p>
            </div>

            <button
              onClick={() => setAddModal(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
            >
              + Add Coupon
            </button>
          </div>

          {/* FILTERS */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 flex flex-wrap gap-4">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Coupon..."
              className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />

            <select
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Status: All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              onChange={(e) => setDeleted(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Deleted: All</option>
              <option value="NotDeleted">Not Deleted</option>
              <option value="Deleted">Deleted</option>
            </select>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {/* CARD */}
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-500/40 transition"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {coupon.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Used By:{" "}
                      <span className="text-indigo-400">
                        {coupon.usedBy.length}
                      </span>
                    </p>
                  </div>
                </div>
                {coupon.isActive ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-red-400">
                    InActive
                  </span>
                )}
                <span>
                  expireDate
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400">
                    {new Date(coupon.expireDate).toLocaleDateString()}
                  </span>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setEditModal(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white transition"
                  >
                    Edit
                  </button>

                  {coupon.isActive ? (
                    <button
                      onClick={() => {
                        deactivatecoupon(coupon._id);
                      }}
                      className="px-4 py-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white transition"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        activatecoupon(coupon._id);
                      }}
                      className="px-4 py-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white transition"
                    >
                      Activate
                    </button>
                  )}

                  {coupon.isDeleted ? (
                    <button
                      onClick={() => undeletecoupon(coupon._id)}
                      className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-green-600 hover:text-white transition"
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => deletecoupon(coupon._id)}
                      className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD coupon MODAL */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(addCouponSubmit)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">Add Coupon</h2>

            <div className="space-y-4">
              <input
                {...register("name", {
                  required: "Name is required",
                })}
                type="text"
                placeholder="coupon name"
                className={`w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white
    ${errors.name ? "border-red-500" : "border-white/10"}
  `}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}

              <input
                {...register("amount", {
                  required: "Name is required",
                })}
                type="number"
                placeholder="coupon amount"
                className={`w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white
    ${errors.name ? "border-red-500" : "border-white/10"}
  `}
              />
              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.amount.message}
                </p>
              )}

              <input
                {...register("expireDate", {
                  required: "expire Date is required",
                })}
                type="date"
                placeholder="coupon expire date"
                className={`w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white
    ${errors.name ? "border-red-500" : "border-white/10"}
  `}
              />
              {errors.expireDate && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.expireDate.message}
                </p>
              )}
              <select
                {...register("isActive", {
                  required: "Status is required",
                })}
                className={`w-full bg-[#0B0F1A] border rounded-lg px-3 py-2 text-sm text-white
    ${errors.isActive ? "border-red-500" : "border-white/10"}
  `}
              >
                <option value="">Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>

              {errors.isActive && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.isActive.message}
                </p>
              )}

              <input
                {...register("file")}
                type="file"
                className="w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setAddModal(false)}
                type="button"
                className="px-4 py-2 rounded-lg border border-white/20 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit coupon MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(editCouponSubmit)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">Edit coupon</h2>

            <div className="space-y-4">
              {/* hidden couponId */}
              <input
                {...register("couponId")}
                type="hidden"
                defaultValue={selectedcoupon._id}
              />

              {/* coupon name */}
              <input
                {...register("name")}
                type="text"
                defaultValue={selectedcoupon.name}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="coupon name"
              />
              <input
                {...register("amount")}
                type="number"
                placeholder="coupon amount"
                className="w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white"
              />

              <input
                {...register("expireDate")}
                type="date"
                placeholder="coupon expire date"
                className="w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white"
              />

              {/* coupon image */}
              <input
                {...register("file")}
                type="file"
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                type="button"
                className="px-4 py-2 rounded-lg border border-white/20 text-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
