import React from "react";
import defaultpfp from "../assets/defaultpfp.png";
import correctpng from "../assets/correct.png";
import commentpng from "../assets/comment.png";
import love from "../assets/love.png";
import share from "../assets/share.png";
import bin from "../assets/bin.png";

import liked from "../assets/liked.png";

export const Post = (input = "error") => {
  return (
    <div className="flex  h-auto w-full px-3 bg-[#191919] py-2 border-b border-zinc-600">
      <div className=" h-full w-12 ">
        <div className="  flex justify-center items-center">
          <img src={defaultpfp} alt="" className=" rounded-full" />
        </div>
      </div>
      <div className="w-full">
        <div className="h-5 px-1 flex items-center  justify-between  w-full">
          <div className="w-full h-full flex gap-2 items-center  ">
            <span className="h-full gap-1 flex">
              <span className="font-semibold">{input.name}</span>
              <span className="h-full flex items-center">
                <img src={correctpng} className=" h-[60%]  " alt="" />
              </span>
            </span>
            <span className="text-zinc-400">{input.username}</span>

            <span className="text-zinc-400">{input.time}</span>
          </div>
          <div className=" items-center h-full ">
            <span className="h-full flex items-center">.k</span>
          </div>
        </div>

        {/* text data */}
        <div className="px-1 font-sans w-full h-auto ">{input.data}</div>
        <div className="w-full h-6 mt-2   flex justify-around">
          <span className="h-full flex items-center gap-1">
            <img src={commentpng} className="h-full" alt="" />
            {input.comments.length}
          </span>
          <span className="h-full flex items-center gap-1">
            <img src={love} className="h-full" alt="" />
            {/* <img src={liked} className="h-full" alt="" /> */}

            {input.likes.length}
          </span>
          <span className="h-full flex items-center gap-1">
            <img src={share} className="h-full" alt="" />
          </span>
          <span className="h-full flex items-center gap-1">
            <img src={bin} className="h-full" alt="" />
          </span>
        </div>
      </div>
    </div>
  );
};
