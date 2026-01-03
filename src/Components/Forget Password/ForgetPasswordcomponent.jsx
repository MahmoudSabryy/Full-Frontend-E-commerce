import axios from "axios";
import { baseURL } from "../../Context/GlobalData";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordcomponent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseURL}/auth/forgetpassword`, {
        email,
      });
      toast.success(data.message);
      setInfoMessage(
        `A confirmation code has been sent to ${email}. Please check your inbox.`
      );
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseURL}/auth/confirmotp`, {
        email,
        otp,
      });
      toast.success(data.message);
      setInfoMessage(
        "OTP confirmed successfully. Please set your new password."
      );
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return toast.error("Please enter both password fields");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const { data } = await axios.patch(`${baseURL}/auth/changepassword`, {
        email,
        password,
      });
      toast.success(data.message);
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setInfoMessage("");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] px-4">
      <div className="bg-[#1e293b] shadow-lg rounded-3xl max-w-md w-full p-10 text-gray-300">
        {infoMessage && (
          <p className="mb-6 text-center text-indigo-400 font-medium">
            {infoMessage}
          </p>
        )}

        {step === 1 && (
          <>
            <h2 className="text-4xl font-extrabold mb-6 text-white text-center">
              Forgot Password
            </h2>
            <form onSubmit={sendEmail} className="flex flex-col gap-6">
              <label className="text-sm font-semibold text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#334155] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-bold py-3 rounded-xl"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-4xl font-extrabold mb-6 text-white text-center">
              Verify OTP
            </h2>
            <form onSubmit={verifyOtp} className="flex flex-col gap-6">
              <label className="text-sm font-semibold text-gray-400">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#334155] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setInfoMessage("");
                  }}
                  className="flex-1 border border-gray-600 py-3 rounded-xl text-gray-400 hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-4xl font-extrabold mb-6 text-white text-center">
              Set New Password
            </h2>
            <form onSubmit={changePassword} className="flex flex-col gap-6">
              <label className="text-sm font-semibold text-gray-400">
                New Password
              </label>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#334155] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label className="text-sm font-semibold text-gray-400">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#334155] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setInfoMessage("");
                  }}
                  className="flex-1 border border-gray-600 py-3 rounded-xl text-gray-400 hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition"
                >
                  {loading ? "Saving..." : "Change Password"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
