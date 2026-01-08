import React from "react";
import defaultpfp from "../assets/defaultpfp.png";
import { Post } from "../components/post";
import correctpng from "../assets/correct.png";
import commentpng from "../assets/comment.png";
import love from "../assets/love.png";
import liked from "../assets/liked.png";

const Header = ({ className }) => {
  return (
    <div className={className}>
      <div className="w-full flex items-center h-13 justify-between px-3 mt-2 ">
        <div className="   flex items-center h-full">
          <img src={defaultpfp} alt="" className="h-[90%] rounded-full " />
        </div>
        <div className="   flex items-center h-full">lOGO</div>
        <div className="   flex items-center h-full">
          <span>upgrade</span>
          <span>...</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
