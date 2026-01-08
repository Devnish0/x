import React from "react";
import defaultpfp from "../assets/defaultpfp.png";
import cross from "../assets/cross.png";
import { useState } from "react";

const Create = ({ oncross, onpost }) => {
  const [text, setText] = useState("");
  const submitHandler = () => {};
  return (
    <div className="w-full h-screen bg-[#191919] px-4 fixed z-2 text-white pt-3">
      <div className="flex items-center  justify-between  h-12 ">
        <button onClick={oncross} className="h-full flex items-center">
          <img src={cross} alt="" className="h-[70%]" srcset="" />
        </button>
        <span>
          <button
            disabled={!text.trim()}
            className={`
            px-6 py-1.25 font-semibold  bg-blue-400 rounded-full transition duration-150
            ${
              !text
                ? "bg-zinc-600 cursor-not-allowed"
                : "bg-blue-400 hover:bg-blue-500"
            }
                `}
            onClick={oncross}
          >
            Post
          </button>
        </span>
      </div>
      <div className="flex mt-6  items-center gap-3  ">
        <div className="w-12 flex items-center h-13  justify-between ">
          <div className="   flex items-center h-full">
            <img src={defaultpfp} alt="" className="h-[90%] rounded-full " />
          </div>
        </div>
        <div>hey</div>
      </div>
      <div className="pl-15 pt-2 w-full ">
        <textarea
          name="Textdata"
          id=""
          placeholder="What's happening?"
          className="w-full outline-0 h-60 mr-6"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default Create;
