import axios from "axios";
import { useEffect, useState } from "react";
import { baseURL, getAuthHeaders } from "../../Context/GlobalData";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function Profilecomponent({ logOut }) {
  const { register, handleSubmit } = useForm();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    const { data } = await axios.get(`${baseURL}/user`, {
      headers: getAuthHeaders(),
    });
    setUserData(data.data);
  };

  const editProfileSubmit = async (formData) => {
    const finalData = {};
    if (formData.firstName) {
      finalData.firstName = formData.firstName;
    }
    if (formData.lastName) {
      finalData.lastName = formData.lastName;
    }
    if (formData.userName) {
      finalData.userName = formData.userName;
    }
    if (formData.address) {
      finalData.address = formData.address;
    }
    if (formData.phone) {
      finalData.phone = formData.phone;
    }
    if (formData.DOB) {
      finalData.DOB = formData.DOB;
    }
    try {
      const { data } = await axios.put(
        `${baseURL}/user/updateprofile`,
        finalData,
        { headers: getAuthHeaders() }
      );

      toast.success(data.message);
      console.log(data.data);
      setUserData(data.data);
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  const changePasswordSubmit = async (formData) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/user/changepassword`,
        formData,
        { headers: getAuthHeaders() }
      );
      toast.success(data.message);
      console.log(data);
      setChangePasswordOpen(false);
      logOut();
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-[#0B0F1A] pt-32 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
              M
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{userData?.email}</p>

              {userData?.confirmEmail ? (
                <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400">
                  Active Account
                </span>
              ) : (
                <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-500/10 text-red-400">
                  Verify Account
                </span>
              )}
            </div>

            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg">
                Personal Info
              </h3>

              <div className="text-sm text-gray-400 space-y-2">
                <p>
                  <span className="text-gray-500">Username:</span>{" "}
                  <span className="text-white">{userData?.userName}</span>
                </p>

                <p>
                  <span className="text-gray-500">Gender:</span>{" "}
                  <span className="text-white">{userData?.gender}</span>
                </p>

                <p>
                  <span className="text-gray-500">Age:</span>{" "}
                  <span className="text-white">{userData?.age}</span>
                </p>

                <p>
                  <span className="text-gray-500">Date of Birth:</span>{" "}
                  <span className="text-white">
                    {new Date(userData?.DOB).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg">Contact Info</h3>

              <div className="text-sm text-gray-400 space-y-2">
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="text-white">{userData?.phone}</span>
                </p>

                <p>
                  <span className="text-gray-500">Address:</span>{" "}
                  <span className="text-white">{userData?.address}</span>
                </p>

                <p>
                  <span className="text-gray-500">Role:</span>{" "}
                  <span className="text-indigo-400 font-semibold">
                    {userData?.role}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4">
              Account Settings
            </h3>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setChangePasswordOpen(true)}
                className="px-5 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
              >
                Change Password
              </button>

              <button
                onClick={logOut}
                className="px-5 py-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {editProfileOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-2xl max-w-md w-full text-white">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form
              onSubmit={handleSubmit(editProfileSubmit)}
              className="space-y-3"
            >
              <input
                {...register("firstName")}
                type="text"
                placeholder="First Name"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last Name"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />
              <input
                {...register("userName")}
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />
              <input
                {...register("DOB")}
                type="date"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />
              <input
                {...register("phone")}
                type="text"
                placeholder="Phone"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />
              <input
                {...register("address")}
                type="text"
                placeholder="Address"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="flex-1 bg-gray-600 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {changePasswordOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-2xl max-w-md w-full text-white">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form
              onSubmit={handleSubmit(changePasswordSubmit)}
              className="space-y-3"
            >
              <input
                {...register("oldPassword")}
                type="password"
                placeholder="Old Password"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />
              <input
                {...register("password")}
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 rounded-lg bg-[#1F2937] focus:outline-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(false)}
                  className="flex-1 bg-gray-600 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
