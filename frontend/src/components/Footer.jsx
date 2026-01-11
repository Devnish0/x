import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full fixed bottom-0 bg-black flex items-center justify-around h-12">
        <span
          className="cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          {" "}
          home
        </span>
        <span className="cursor-pointer text-zinc-600">search</span>
        <span className="cursor-pointer text-zinc-600"> notification</span>
        <span
          className="cursor-pointer"
          onClick={() => {
            navigate("/profile");
          }}
        >
          {" "}
          profile
        </span>
      </div>
    </>
  );
};

export default Footer;
