import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { baseURL } from "../../../Context/GlobalData";

export default function Subcategorycomponent() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deleted, setDeleted] = useState("all");
  const [categories, setCategories] = useState("all");

  const { register, handleSubmit, reset } = useForm();

  const myHeaders = {
    authorization: localStorage.getItem("token"),
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/category`);

      setCategoryData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const activateSubCategory = async (_id) => {
    try {
      const response = await axios.patch(
        `${baseURL}/subcategory/activate/${_id}`,
        {},
        { headers: myHeaders }
      );

      toast.success(response.data.message);
      getAllCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const deActivateSubCategory = async (_id) => {
    try {
      const response = await axios.patch(
        `${baseURL}/subcategory/deactivate/${_id}`,
        {},
        { headers: myHeaders }
      );

      toast.success(response.data.message);
      getAllCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSubCategory = async (_id) => {
    try {
      const response = await axios.delete(`${baseURL}/subcategory/${_id}`, {
        headers: myHeaders,
      });

      toast.success(response.data.message);
      getAllCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const unDeleteSubCategory = async (_id) => {
    try {
      const response = await axios.patch(
        `${baseURL}/subcategory/undelete/${_id}`,
        {},
        { headers: myHeaders }
      );

      toast.success(response.data.message);
      getAllCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitAddCategory = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("categoryId", data.categoryId);
      formData.append("isActive", data.isActive);
      formData.append("file", data.file[0]);

      const response = await axios.post(
        `${baseURL}/category/${data.categoryId}/subcategory`,
        formData,
        { headers: myHeaders }
      );

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitEditCategory = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryId", data.categoryId);

      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }

      const response = await axios.put(
        `${baseURL}/category/${data.categoryId}/subcategory/${data.subcategoryId}`,
        formData,
        { headers: myHeaders }
      );

      toast.success(response.data.message);
      getAllCategories();
      setShowEdit(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (selectedSubCategory) {
      reset({
        subcategoryId: selectedSubCategory._id,
        name: selectedSubCategory.name,
        categoryId: selectedSubCategory.categoryId,
      });
    }
  }, [selectedSubCategory, reset]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const filteredSubCategories = categoryData
    .map((cat) => ({
      ...cat,
      subcategories:
        cat.subcategories?.filter((sub) => {
          if (search && !sub.name.toLowerCase().includes(search.toLowerCase()))
            return false;

          if (deleted === "notdeleted" && sub.isDeleted) return false;
          if (deleted === "deleted" && !sub.isDeleted) return false;

          if (status === "active" && !sub.isActive) return false;
          if (status === "inactive" && sub.isActive) return false;

          if (categories !== "all" && cat.name !== categories) return false;

          return true;
        }) || [],
    }))
    .filter((cat) => cat.subcategories.length > 0);

  return (
    <>
      <div className="min-h-screen bg-[#0B0F1A] pt-32 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* <!-- HEADER --> */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sub Categories</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage subcategories & visibility
              </p>
            </div>

            <button
              onClick={() => {
                setShowAdd(true);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
            >
              + Add SubCategory
            </button>
          </div>

          {/* <!-- FILTERS --> */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 flex flex-wrap gap-4">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search subcategory..."
              className="flex-1 bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />

            <select
              onChange={(e) => setCategories(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">All Categories</option>
              {categoryData.map((cat) => (
                <option value={cat.name}>{cat.name}</option>
              ))}
            </select>

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
              <option value="notdeleted">Not Deleted</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* <!-- LIST --> */}
          <div className="space-y-4">
            {/* <!-- CARD --> */}
            {filteredSubCategories.map((cat) =>
              cat.subcategories.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-500/40 transition"
                >
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {sub.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Category:{" "}
                      <span className="text-indigo-400">{cat.name}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {sub.isActive ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-red-400">
                        InActive
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setShowEdit(true);
                        setSelectedSubCategory(sub);
                      }}
                      className="px-4 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white transition"
                    >
                      Edit
                    </button>
                    {sub.isActive ? (
                      <button
                        onClick={() => {
                          deActivateSubCategory(sub._id);
                        }}
                        className="px-4 py-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white transition"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          activateSubCategory(sub._id);
                        }}
                        className="px-4 py-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white transition"
                      >
                        Activate
                      </button>
                    )}
                    {sub.isDeleted ? (
                      <button
                        onClick={() => {
                          unDeleteSubCategory(sub._id);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-green-600 hover:text-white transition"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          deleteSubCategory(sub._id);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      {/* Add-Modal */}

      {showAdd && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 ${
            showAdd ? "" : "hidden"
          }`}
        >
          <form
            onSubmit={handleSubmit(onSubmitAddCategory)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">
              Add SubCategory
            </h2>

            <div className="space-y-4">
              <input
                {...register("name", { required: "name is required" })}
                type="text"
                placeholder="SubCategory Name"
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />

              <select
                {...register("categoryId", {
                  required: "category is required",
                })}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Select Category</option>
                {categoryData.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                {...register("isActive", { required: "status is required" })}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>

              {/* حقل رفع صورة */}
              <input
                type="file"
                {...register("file")}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4"
              />
            </div>

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
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {showEdit && selectedSubCategory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmitEditCategory)}
            className="bg-[#111827] rounded-2xl w-full max-w-md p-6 border border-white/10"
          >
            <h2 className="text-white text-xl font-bold mb-4">
              Edit SubCategory
            </h2>

            <div className="space-y-4">
              {/* Hidden input for subcategoryId */}
              <input
                type="hidden"
                {...register("subcategoryId")}
                value={selectedSubCategory._id}
              />

              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="SubCategory Name"
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />

              <select
                disabled
                {...register("categoryId", {
                  required: "Category is required",
                })}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                defaultValue={selectedSubCategory.categoryId}
              >
                <option value="">Select Category</option>
                {categoryData.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Optional file input */}
              <input
                type="file"
                {...register("file")}
                className="w-full bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

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
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
