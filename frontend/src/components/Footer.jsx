import React from "react";

const Footer = () => {
  return (
    <>
      <div className="w-full fixed bottom-0 bg-black flex items-center justify-around h-12">
        <span>
          <a href="/">home</a>
        </span>
        <span>search</span>
        <span> notification</span>
        <span>
          {" "}
          <a href="/profile">profile</a>
        </span>
      </div>
    </>
  );
};

export default Footer;
