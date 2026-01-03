import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { baseURL } from "../../../Context/GlobalData";

export default function Categorycomponent() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deleted, setDeleted] = useState("all");

  const [selectedCategory, setSelectedCategory] = useState(null);

  const { register, handleSubmit } = useForm();

  const myHeaders = {
    authorization: localStorage.getItem("token"),
  };

  const onSubmitAdd = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("isActive", data.isActive);
      formData.append("file", data.file[0]);

      const response = await axios.post(`${baseURL}/category`, formData, {
        headers: myHeaders,
      });

      getAllCategories();

      if (response.data.success) return toast.success(response.data.message);

      return toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitEdit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("file", data.file[0]);

      const response = await axios.put(
        `${baseURL}/category/update/${data._id}`,
        formData,
        {
          headers: myHeaders,
        }
      );

      getAllCategories();

      if (response.data.success) return toast.success(response.data.message);

      return toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = useCallback(async () => {
    const response = await axios.get(`${baseURL}/category`);
    setCategoryData(response.data.data);
  }, []);

  const deleteCategory = async (_id) => {
    const response = await axios.delete(`${baseURL}/category/${_id}`, {
      headers: myHeaders,
    });
    toast.success(response.data.message);
    getAllCategories();
  };

  const unDeleteCategory = async (_id) => {
    const response = await axios.patch(
      `${baseURL}/category/undelete/${_id}`,
      {},
      { headers: myHeaders }
    );
    toast.success(response.data.message);

    getAllCategories();
  };

  const activateCategory = async (_id) => {
    try {
      const response = await axios.patch(
        `${baseURL}/category/activate/${_id}`,
        {},
        { headers: myHeaders }
      );
      toast.success(response.data.message);
      getAllCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const deactivateCategory = async (_id) => {
    try {
      const response = await axios.patch(
        `${baseURL}/category/deactivate/${_id}`,
        {},
        { headers: myHeaders }
      );
      toast.success(response.data.message);
      getAllCategories();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const filteredCategories = categoryData.filter((category) => {
    if (search && !category.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    if (status === "active" && !category.isActive) return false;
    if (status === "inactive" && category.isActive) return false;

    if (deleted === "deleted" && !category.isDeleted) return false;
    if (deleted === "not" && category.isDeleted) return false;

    return true;
  });

  const sortedfilteredCategories = filteredCategories.sort(
    (a, b) => a.isDeleted - b.isDeleted
  );

  return (
    <>
      <div className="min-h-screen bg-[#0B0F1A] pt-32 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Categories</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage categories, subcategories & visibility
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
            >
              + Add Category
            </button>
          </div>

          {/* FILTERS */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 flex flex-wrap gap-4">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search category..."
              className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />

            <select
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              onChange={(e) => setDeleted(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">Deleted: All</option>
              <option value="not">Not Deleted</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* CATEGORY CARD */}
          {sortedfilteredCategories.map((cat) => (
            <div
              key={cat._id}
              className={`relative rounded-xl p-5 flex items-center justify-between transition

    ${
      cat.isDeleted
        ? "bg-[#0f172a] border border-red-500/40 opacity-70"
        : "bg-[#111827] border border-white/10 hover:border-indigo-500/50"
    }
    
  `}
            >
              {cat.isDeleted && (
                <span className="absolute -top-2 -right-2 px-3 py-1 text-xs rounded-full bg-red-600 text-white shadow">
                  Deleted
                </span>
              )}

              <div>
                <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                {cat.subcategories.map((sub) => (
                  <span key={sub._id} className="text-sm text-gray-400">
                    {sub.name + " "}
                  </span>
                ))}

                <div className="flex gap-2 mt-2 text-xs">
                  {cat.isActive && (
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                      Active
                    </span>
                  )}
                  {!cat.isActive && (
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-red-400">
                      Not Active
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                    {cat.subcategories.length} Subcategories
                  </span>
                </div>

                <div className="flex gap-2 mt-2 text-xs">
                  {!cat.isDeleted && (
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                      Not Deleted
                    </span>
                  )}
                  {cat.isDeleted && (
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-red-400">
                      Deleted
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowEdit(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white transition"
                >
                  Edit
                </button>

                {cat.isActive ? (
                  <button
                    onClick={() => deactivateCategory(cat._id)}
                    className="px-4 py-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white transition"
                  >
                    DeActive
                  </button>
                ) : (
                  <button
                    onClick={() => activateCategory(cat._id)}
                    className="px-4 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white transition"
                  >
                    Activate
                  </button>
                )}

                {!cat.isDeleted ? (
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => unDeleteCategory(cat._id)}
                    className="px-4 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmitAdd)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">Add Category</h2>

            <input
              {...register("name", { required: "category name is required" })}
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white mb-4"
              placeholder="Category Name"
            />

            <select
              {...register("isActive", { required: "status is required" })}
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>

            <input
              type="file"
              {...register("file")}
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-lg border border-white/20 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {showEdit && selectedCategory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmitEdit)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">Edit Category</h2>

            <input
              type="hidden"
              {...register("_id")}
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white mb-4"
              value={selectedCategory._id}
            />
            <input
              type="text"
              {...register("name")}
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white mb-4"
              placeholder={selectedCategory.name}
            />

            <input
              type="file"
              {...register("file")}
              className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 rounded-lg border border-white/20 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
