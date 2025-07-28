import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewOtp: boolean;
  toggleViewOtp: () => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

const OtpInput: React.FC<Props> = ({
  value,
  onChange,
  viewOtp,
  toggleViewOtp,
  onFocus,
  onBlur,
  focused,
}) => (
  <div className="w-[399px] md:w-full relative">
    <input
      name="otp"
      type={viewOtp ? "text" : "password"}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      required
      className="w-full rounded-[10px] border-[1.5px] p-[16px] text-[18px] text-[#232323] border-[#D9D9D9] focus:border-[#367AFF] focus:outline-none pr-12"
      placeholder="OTP"
    />
    <div
      className="absolute right-4 top-1/3 cursor-pointer"
      onClick={toggleViewOtp}
    >
      {viewOtp ? (
        <Eye className="w-6 h-6 text-[#9A9A9A]" />
      ) : (
        <EyeOff className="w-6 h-6 text-[#9A9A9A]" />
      )}
    </div>
  </div>
);

export default OtpInput;
