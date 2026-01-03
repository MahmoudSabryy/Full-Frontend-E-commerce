import axios from "axios";
import { useContext, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { baseURL, globalDataContext } from "../../../Context/GlobalData";

export default function ProductComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteFilter, setDeleteFilter] = useState("all");

  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      colors: [""],
      size: [""],
      isActive: true,
      isDeleted: false,
    },
  });

  const {
    fields: fieldsColors,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: "colors",
  });

  const {
    fields: fieldsSizes,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: "size",
  });

  const myHeaders = {
    authorization: localStorage.getItem("token"),
  };

  const { productsData, categoriesData, brandsData, getAllProducts } =
    useContext(globalDataContext);

  const categoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);

    const selectedCategory = categoriesData.find(
      (cat) => cat._id === categoryId
    );
    setSubCategories(selectedCategory?.subcategories || []);

    setValue("subcategoryId", "");
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("stock", data.stock);
    formData.append("categoryId", data.categoryId);
    formData.append("subcategoryId", data.subcategoryId);
    formData.append("brandId", data.brandId);
    formData.append("description", data.description);
    formData.append("isActive", data.isActive);
    formData.append("isDeleted", data.isDeleted);

    data.colors.forEach((color) => {
      if (color.trim() !== "") formData.append("colors", color);
    });

    data.size.forEach((size) => {
      if (size.trim() !== "") formData.append("size", size);
    });

    formData.append("mainImage", data.mainImage[0]);

    if (data.subImages && data.subImages.length > 0) {
      for (let i = 0; i < data.subImages.length; i++) {
        formData.append("subImages", data.subImages[i]);
      }
    }

    try {
      const response = await axios.post(`${baseURL}/product`, formData, {
        headers: myHeaders,
      });

      if (response.data.success === true) {
        toast.success(response.data.message);
        getAllProducts();
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding product");
    }
  };

  const deleteProduct = async (_id) => {
    const response = await axios.delete(`${baseURL}/product/delete/${_id}`, {
      headers: myHeaders,
    });
    getAllProducts();
    toast.success(response.data.message);
  };

  const UnDeleteProduct = async (_id) => {
    const response = await axios.patch(
      `${baseURL}/product/enable/${_id}`,
      {},
      {
        headers: myHeaders,
      }
    );
    getAllProducts();
    toast.success(response.data.message);
  };

  const filteredProducts = productsData.filter((product) => {
    if (search && !product.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    if (stockFilter === "inStock" && product.stock <= 0) return false;
    if (stockFilter === "outStock" && product.stock > 0) return false;
    if (stockFilter === "lowStock" && product.stock > 5) return false;

    if (statusFilter === "active" && !product.isActive) return false;
    if (statusFilter === "notActive" && product.isActive) return false;

    if (deleteFilter === "onlyDeleted" && !product.isDeleted) return false;
    if (deleteFilter === "notDeleted" && product.isDeleted) return false;

    return true;
  });

  return (
    <>
      <div className="pt-[130px] bg-[#0B0F1A] min-h-screen px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Products</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage products, stock and availability
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
            >
              + Add Product
            </button>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or brand..."
              className="md:col-span-2 bg-[#0B0F1A] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
            <select
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outStock">Out of Stock</option>
            </select>
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="notActive">Not Active</option>
            </select>

            <select
              onChange={(e) => setDeleteFilter(e.target.value)}
              className="bg-[#0B0F1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">All</option>
              <option value="notDeleted">Not Deleted</option>
              <option value="onlyDeleted">Only Deleted</option>
            </select>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_2fr] text-sm text-gray-400 px-4">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-[#111827] border border-white/10 rounded-xl px-4 py-4 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_2fr] items-center transition hover:border-indigo-500/50 hover:bg-[#0f172a]"
            >
              <div>
                <p className="text-white font-medium">{product.name}</p>
                <p className="text-xs text-gray-400">{product.brandId.name}</p>
              </div>
              <p className="text-gray-300">{product.categoryId.name}</p>
              <p className="text-indigo-400 font-semibold">
                EGP {product.finalPrice}
              </p>
              <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 w-fit">
                {product.stock}
              </span>
              <span
                className={`px-3 py-1 text-xs rounded-full w-fit ${
                  product.isActive
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {product.isActive ? "active" : "inactive"}
              </span>

              <div className="flex justify-end gap-3 text-sm">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-indigo-400 hover:text-indigo-500 transition"
                >
                  Edit
                </button>

                <button className="text-yellow-400 hover:text-yellow-500 transition">
                  Stock
                </button>

                {product.isDeleted && (
                  <button
                    onClick={() => UnDeleteProduct(product._id)}
                    className="text-green-400 hover:text-red-500 transition"
                  >
                    Enable
                  </button>
                )}
                {!product.isDeleted && (
                  <button
                    key={product.isDeleted}
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    Disable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-6">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0B0F1A] border border-white/10 rounded-2xl shadow-2xl p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* NAME */}
              <div>
                <label className="text-sm text-gray-400">Product Name</label>
                <input
                  type="text"
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                  {...register("name")}
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="text-sm text-gray-400">Price (EGP)</label>
                <input
                  type="number"
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                  {...register("price")}
                />
              </div>

              {/* DISCOUNT */}
              <div>
                <label className="text-sm text-gray-400">Discount (%)</label>
                <input
                  type="number"
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                  {...register("discount")}
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="text-sm text-gray-400">Stock</label>
                <input
                  type="number"
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                  {...register("stock")}
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm text-gray-400">Category</label>
                <select
                  {...register("categoryId", {
                    required: "category is required",
                  })}
                  value={selectedCategoryId}
                  onChange={categoryChange}
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Select Category</option>
                  {categoriesData.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBCATEGORY */}
              <div>
                <label className="text-sm text-gray-400">Subcategory</label>
                <select
                  {...register("subcategoryId", {
                    required: "sub category is required",
                  })}
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BRAND */}
              <div>
                <label className="text-sm text-gray-400">Brand</label>
                <select
                  {...register("brandId", { required: "brand is required" })}
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Select Brand</option>
                  {brandsData.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" {...register("isActive")} />
                  Active
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" {...register("isDeleted")} />
                  Deleted
                </label>
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  rows="3"
                  className="w-full mt-1 bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                  {...register("description")}
                />
              </div>

              {/* COLORS */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">
                  Colors
                </label>
                {fieldsColors.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      {...register(`colors.${index}`)}
                      placeholder="Color"
                      className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendColor("")}
                  className="mt-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                >
                  Add Color
                </button>
              </div>

              {/* SIZES */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">
                  Sizes
                </label>
                {fieldsSizes.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      {...register(`size.${index}`)}
                      placeholder="Size (e.g., S, M, L)"
                      className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendSize("")}
                  className="mt-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                >
                  Add Size
                </button>
              </div>

              {/* MAIN IMAGE */}
              <div>
                <label className="text-sm text-gray-400">Main Image</label>
                <input
                  type="file"
                  {...register("mainImage")}
                  className="w-full mt-1 text-gray-300"
                />
              </div>

              {/* SUB IMAGES */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">
                  Additional Images
                </label>
                <input
                  type="file"
                  multiple
                  {...register("subImages")}
                  className="w-full mt-1 text-gray-300"
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 mt-4 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
