import React from "react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

const EmailInput: React.FC<Props> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
}) => (
  <div className="w-[399px] md:w-full relative">
    <label
      htmlFor="email"
      className={`bg-white px-[4px] font-medium text-[14px] absolute -top-3 left-3 ${
        focused ? "text-[#367AFF]" : "text-[#9A9A9A]"
      }`}
    >
      Email
    </label>
    <input
      name="email"
      type="email"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      required
      className="w-full rounded-[10px] border-[1.5px] p-[16px] text-[18px] text-[#232323] border-[#D9D9D9] focus:border-[#367AFF] focus:outline-none"
      placeholder="jonas_kahnwald@gmail.com"
    />
  </div>
);

export default EmailInput;
