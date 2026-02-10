import React from "react";

export const ChecBox = ({ placeholder = "remember me" }) => {
  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="peer hidden" />

        <span
          className="
      h-5 w-5
      border border-gray-400
      rounded
      flex items-center justify-center
      peer-checked:bg-blue-600
      peer-checked:border-blue-600
    "
        >
          <svg
            className="
        hidden
        peer-checked:block
        w-3 h-3
        text-white
      "
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>

        {/* <span className="text-sm">
          {placeholder}
          <span className="underline text-blue-500">
            {" "}
            {"terms and condition"}
          </span>
        </span> */}
      </label>
    </div>
  );
};
