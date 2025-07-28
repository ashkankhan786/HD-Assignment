import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, sendOtp, verifyOtp } from "../services/api";
import { setToken } from "../utils/auth";

function Login() {
  const [focused, setFocused] = useState<"email" | "otp" | null>(null);
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [viewOtp, setViewOtp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getOTP = async () => {
    try {
      await sendOtp(formData.email);
      toast.success("OTP sent successfully");
      setOtpSent(true);
    } catch (error) {
      toast.error("OTP not sent");
      console.error("Error sending OTP:", error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otpSent) return;

    try {
      const res = await verifyOtp(formData.email, formData.otp, checkBox);
      const token = res.data.token;
      if (token) {
        setToken(token, checkBox);
        toast.success("Login successful. Redirecting to dashboard");
        navigate("/");
      } else {
        toast.error(res.data.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Login Failed");
      console.error("Error verifying OTP:", error);
    } finally {
      setOtpSent(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      const res = await loginWithGoogle(token);
      setToken(res.data.token, true);
      toast.success("Google login successful");
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed");
    }
  };

  return (
    <div>
      {/* Desktop */}
      <div className="hidden w-screen h-screen md:flex md:flex-row overflow-hidden">
        <div className="flex-1/3 flex flex-col md:p-[32px] overflow-y-auto max-h-screen">
          <div className="w-full h-[32px] flex items-center justify-start gap-[10px]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.1424 0.843087L16.9853 0L14.3248 9.89565L11.9228 0.961791L8.76555 1.80488L11.3608 11.4573L4.8967 5.01518L2.58549 7.31854L9.67576 14.3848L0.845959 12.0269L0 15.1733L9.64767 17.7496C9.53721 17.2748 9.47877 16.7801 9.47877 16.2717C9.47877 12.6737 12.4055 9.75685 16.0159 9.75685C19.6262 9.75685 22.5529 12.6737 22.5529 16.2717C22.5529 16.7768 22.4952 17.2685 22.3861 17.7405L31.1541 20.0818L32 16.9354L22.314 14.3489L31.1444 11.9908L30.2984 8.84437L20.6128 11.4308L27.0768 4.98873L24.7656 2.68538L17.7737 9.65357L20.1424 0.843087Z"
                fill="#367AFF"
              />
              <path
                d="M22.3776 17.7771C22.1069 18.9176 21.5354 19.9421 20.7513 20.763L27.1033 27.0935L29.4145 24.7901L22.3776 17.7771Z"
                fill="#367AFF"
              />
              <path
                d="M20.6871 20.8292C19.8936 21.637 18.8907 22.2398 17.7661 22.5504L20.0775 31.1472L23.2346 30.3041L20.6871 20.8292Z"
                fill="#367AFF"
              />
              <path
                d="M17.6481 22.5819C17.1264 22.7156 16.5795 22.7866 16.0159 22.7866C15.4121 22.7866 14.8273 22.705 14.2723 22.5523L11.9588 31.1569L15.1159 32L17.6481 22.5819Z"
                fill="#367AFF"
              />
              <path
                d="M14.1607 22.5205C13.0533 22.1945 12.0683 21.584 11.2909 20.7739L4.92328 27.1199L7.23448 29.4233L14.1607 22.5205Z"
                fill="#367AFF"
              />
              <path
                d="M11.2378 20.7178C10.4737 19.9026 9.91721 18.8917 9.65231 17.7688L0.855743 20.1179L1.7017 23.2643L11.2378 20.7178Z"
                fill="#367AFF"
              />
            </svg>
            <h1 className="font-semibold text-2xl">HD</h1>
          </div>

          <div className="flex flex-col px-4 md:px-[32px] justify-center gap-[32px] w-full max-w-[450px] mx-auto flex-grow py-8">
            <div className="h-fit flex flex-col gap-[12px]">
              <h1 className="font-bold text-[40px] text-[#232323]">Sign In</h1>
              <p className="text-lg text-[#969696]">
                Please login to continue to your account
              </p>
            </div>
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-[20px]"
            >
              {/* Email Field */}
              <div className="w-full relative">
                <label
                  htmlFor="email"
                  className={`bg-white px-[4px] font-medium text-[14px] absolute -top-3 left-3 ${
                    focused === "email" ? "text-[#367AFF]" : "text-[#9A9A9A]"
                  }`}
                >
                  Email
                </label>
                <input
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  required
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full rounded-[10px] border-[1.5px] p-[16px] text-[18px] text-[#232323] border-[#D9D9D9] focus:border-[#367AFF] focus:outline-none"
                  placeholder="jonas_kahnwald@gmail.com"
                />
              </div>

              {/* OTP Field */}
              <div className="w-full relative">
                <input
                  value={formData.otp}
                  onChange={handleChange}
                  name="otp"
                  type={viewOtp ? "text" : "password"}
                  required
                  onFocus={() => setFocused("otp")}
                  onBlur={() => setFocused(null)}
                  className="relative w-full rounded-[10px] border-[1.5px] p-[16px] text-[18px] text-[#232323] border-[#D9D9D9] focus:border-[#367AFF] focus:outline-none pr-12"
                  placeholder="OTP"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setViewOtp(!viewOtp)}
                >
                  {viewOtp ? (
                    <Eye className="w-6 h-6 text-[#9A9A9A]" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-[#9A9A9A]" />
                  )}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="text-[#367AFF] underline text-[16px] font-medium"
                  onClick={getOTP}
                >
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              <div className="flex items-center gap-[10px]">
                <input
                  name="login"
                  type="checkbox"
                  className="w-[24px] h-[24px]"
                  onChange={() => setCheckBox(!checkBox)}
                />
                <label htmlFor="login" className="font-medium text-base">
                  Keep me logged in
                </label>
              </div>

              <button
                type="submit"
                className="bg-[#367AFF] text-white text-[18px] font-semibold py-[16px] px-[8px] rounded-[10px] cursor-pointer hover:bg-[#3679ffcf]"
              >
                Sign In
              </button>
            </form>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Login failed")}
            />
            <div className="h-[27px] flex justify-center items-center text-[18px]">
              <p className="text-[#6C6C6C]">
                Need an account{" "}
                <span
                  className="font-semibold underline text-[#367AFF] cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Create one
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Image */}
        <div className="flex-2/3 hidden md:flex p-[12px] h-full max-h-screen overflow-hidden">
          <img
            src="/login-bg.jpg"
            alt="BG Image Here"
            className="rounded-[24px] object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="w-full h-screen flex flex-col items-center px-4 md:hidden overflow-y-auto">
        <div className="w-full max-w-[375px] flex flex-col gap-6 py-6">
          {/* Brand */}
          <div className="flex items-center justify-center gap-[12px] mt-[55px]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.1424 0.843087L16.9853 0L14.3248 9.89565L11.9228 0.961791L8.76555 1.80488L11.3608 11.4573L4.8967 5.01518L2.58549 7.31854L9.67576 14.3848L0.845959 12.0269L0 15.1733L9.64767 17.7496C9.53721 17.2748 9.47877 16.7801 9.47877 16.2717C9.47877 12.6737 12.4055 9.75685 16.0159 9.75685C19.6262 9.75685 22.5529 12.6737 22.5529 16.2717C22.5529 16.7768 22.4952 17.2685 22.3861 17.7405L31.1541 20.0818L32 16.9354L22.314 14.3489L31.1444 11.9908L30.2984 8.84437L20.6128 11.4308L27.0768 4.98873L24.7656 2.68538L17.7737 9.65357L20.1424 0.843087Z"
                fill="#367AFF"
              />
              <path
                d="M22.3776 17.7771C22.1069 18.9176 21.5354 19.9421 20.7513 20.763L27.1033 27.0935L29.4145 24.7901L22.3776 17.7771Z"
                fill="#367AFF"
              />
              <path
                d="M20.6871 20.8292C19.8936 21.637 18.8907 22.2398 17.7661 22.5504L20.0775 31.1472L23.2346 30.3041L20.6871 20.8292Z"
                fill="#367AFF"
              />
              <path
                d="M17.6481 22.5819C17.1264 22.7156 16.5795 22.7866 16.0159 22.7866C15.4121 22.7866 14.8273 22.705 14.2723 22.5523L11.9588 31.1569L15.1159 32L17.6481 22.5819Z"
                fill="#367AFF"
              />
              <path
                d="M14.1607 22.5205C13.0533 22.1945 12.0683 21.584 11.2909 20.7739L4.92328 27.1199L7.23448 29.4233L14.1607 22.5205Z"
                fill="#367AFF"
              />
              <path
                d="M11.2378 20.7178C10.4737 19.9026 9.91721 18.8917 9.65231 17.7688L0.855743 20.1179L1.7017 23.2643L11.2378 20.7178Z"
                fill="#367AFF"
              />
            </svg>
            <h1 className="text-[24px] font-semibold text-[#232323]">HD</h1>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-[32px] font-bold text-[#232323]">Sign In</h1>
            <p className="text-[#969696] text-[16px]">
              Please login to continue to your account
            </p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-[25px] mt-[20px]"
            onSubmit={handleFormSubmit}
          >
            <div className="relative">
              <label
                htmlFor="email"
                className={`absolute -top-2 left-3 bg-white px-1 text-sm ${
                  focused === "email" ? "text-[#367AFF]" : "text-[#9A9A9A]"
                }`}
              >
                Email
              </label>
              <input
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                name="email"
                type="email"
                required
                placeholder="jonas_kahnwald@gmail.com"
                className="w-full border rounded-xl p-4 text-[18px] border-[#D9D9D9] focus:border-[#367AFF] focus:outline-none"
              />
            </div>

            <div className="relative">
              <input
                value={formData.otp}
                onChange={handleChange}
                onFocus={() => setFocused("otp")}
                onBlur={() => setFocused(null)}
                name="otp"
                required
                type={viewOtp ? "text" : "password"}
                placeholder="OTP"
                className="w-full border rounded-xl p-4 text-[18px] border-[#D9D9D9] focus:border-[#367AFF] focus:outline-none pr-12"
              />
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setViewOtp(!viewOtp)}
              >
                {viewOtp ? (
                  <Eye className="w-6 h-6 text-[#9A9A9A]" />
                ) : (
                  <EyeOff className="w-6 h-6 text-[#9A9A9A]" />
                )}
              </div>
            </div>

            <button
              type="button"
              className="text-[#367AFF] underline font-medium text-sm"
              onClick={getOTP}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                name="login"
                className="w-6 h-6"
                onChange={() => setCheckBox(!checkBox)}
              />
              <label htmlFor="login">Keep me logged in</label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#367AFF] text-white rounded-xl p-4 font-semibold hover:bg-[#3679ffcf]"
            >
              Sign In
            </button>
          </form>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login failed")}
          />

          <p className="text-center text-[#6C6C6C] text-[14px]">
            Need an account?{" "}
            <span
              className="font-semibold text-[#367AFF] underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
