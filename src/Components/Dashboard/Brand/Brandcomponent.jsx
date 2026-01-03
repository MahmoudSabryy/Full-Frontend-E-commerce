import React, { useContext, useState } from "react";
import { baseURL, globalDataContext } from "../../../Context/GlobalData";
import { useForm } from "react-hook-form";
import axios from "axios";
import { globalBrandDataContext } from "../../../BrandContext/BrandContextData";
import toast from "react-hot-toast";

export default function Brandcomponent() {
  const { brandsData, getAllBrands } = useContext(globalDataContext);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const { deleteBrand, undeleteBrand, activateBrand, deactivateBrand } =
    useContext(globalBrandDataContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const myHeaders = {
    authorization: localStorage.getItem("token"),
  };

  const addBrandSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);

      formData.append("isActive", data.isActive);

      formData.append("image", data.file[0]);

      const response = await axios.post(`${baseURL}/brand`, formData, {
        headers: myHeaders,
      });
      getAllBrands();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data.error);
      console.log(error);
    }
  };

  const editBrandSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.name) {
        formData.append("name", data.name);
      }
      if (data.file && data.file[0]) {
        formData.append("image", data.file[0]);
      }

      const response = await axios.put(
        `${baseURL}/brand/${selectedBrand._id}`,
        formData,
        { headers: myHeaders }
      );
      getAllBrands();
      toast.success(response.data.message);
      setEditModal(false);
    } catch (error) {
      toast.error(error.response?.data.error);
    }
  };

  const filteredBrands = brandsData.filter((brand) => {
    if (
      search &&
      !brand.name.toLowerCase().trim().includes(search.toLowerCase().trim())
    )
      return false;

    if (status === "Active" && brand.isActive !== true) return false;

    if (status === "Inactive" && brand.isActive !== false) return false;

    if (deleted === "NotDeleted" && brand.isDeleted !== false) return false;

    if (deleted === "Deleted" && brand.isDeleted !== true) return false;

    return true;
  });

  return (
    <>
      <div className="min-h-screen bg-[#0B0F1A] pt-32 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Brands</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage brands & visibility
              </p>
            </div>

            <button
              onClick={() => setAddModal(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
            >
              + Add Brand
            </button>
          </div>

          {/* FILTERS */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 flex flex-wrap gap-4">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search brand..."
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
            {filteredBrands.map((brand) => (
              <div
                key={brand._id}
                className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-500/40 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={brand.image.secure_url}
                    alt={brand.name}
                    className="w-14 h-14 rounded-xl object-cover bg-white"
                  />

                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Products:{" "}
                      <span className="text-indigo-400">
                        {brand.product.length}
                      </span>
                    </p>
                  </div>
                </div>
                {brand.isActive ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-red-400">
                    InActive
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedBrand(brand);
                      setEditModal(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white transition"
                  >
                    Edit
                  </button>

                  {brand.isActive ? (
                    <button
                      onClick={() => {
                        deactivateBrand(brand._id);
                      }}
                      className="px-4 py-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white transition"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        activateBrand(brand._id);
                      }}
                      className="px-4 py-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white transition"
                    >
                      Activate
                    </button>
                  )}

                  {brand.isDeleted ? (
                    <button
                      onClick={() => undeleteBrand(brand._id)}
                      className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-green-600 hover:text-white transition"
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteBrand(brand._id)}
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

      {/* ADD BRAND MODAL */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(addBrandSubmit)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">Add Brand</h2>

            <div className="space-y-4">
              <input
                {...register("name", {
                  required: "Name is required",
                })}
                type="text"
                placeholder="Brand name"
                className={`w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white
    ${errors.name ? "border-red-500" : "border-white/10"}
  `}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
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
                {...register("file", {
                  required: "Image is required",
                })}
                type="file"
                className={`w-full bg-[#0B0F1A] border rounded-lg px-4 py-2 text-sm text-white
    ${errors.name ? "border-red-500" : "border-white/10"}
  `}
              />
              {errors.file && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.file.message}
                </p>
              )}
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

      {/* Edit BRAND MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(editBrandSubmit)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">Edit Brand</h2>

            <div className="space-y-4">
              {/* hidden brandId */}
              <input
                {...register("brandId")}
                type="hidden"
                defaultValue={selectedBrand._id}
              />

              {/* brand name */}
              <input
                {...register("name")}
                type="text"
                defaultValue={selectedBrand.name}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Brand name"
              />

              {/* brand image */}
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
