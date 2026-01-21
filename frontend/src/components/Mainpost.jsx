import defaultpfp from "../assets/defaultpfp.png";
import commentpng from "../assets/comment.png";
import love from "../assets/love.png";
import share from "../assets/share.png";
import bin from "../assets/bin.png";
import loved from "../assets/liked.png";
import correctpng from "../assets/correct.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Mainpost = ({
  input = "error",
  isVerified,
  useIndex = true,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { comments = [], createdAt, likes = [], data, _id } = input;
  const [islike, setisLike] = useState(false);

  const { name, username } = input?.user;
  const [likeCount, setlikeCount] = useState(likes.length ?? 0);

  //   const timeAgoShort = (date) => {
  //     const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  //     if (seconds < 60) return "now";
  //     const minutes = Math.floor(seconds / 60);
  //     if (minutes < 60) return `${minutes}m`;
  //     const hours = Math.floor(minutes / 60);
  //     if (hours < 24) return `${hours}h`;
  //     const days = Math.floor(hours / 24);
  //     if (days < 7) return `${days}d`;
  //     const weeks = Math.floor(days / 7);
  //     return `${weeks}w`;
  //   };
  const formattedTime = (createdAt) => {
    const formatted = new Date(createdAt)
      .toLocaleString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(",", "");
    return formatted;
  };

  return (
    <div className="flex flex-col h-auto w-full px-3 bg-[#191919] cursor-pointer py-2 border-b border-zinc-600 ">
      <div className="h-full flex gap-3 w-full">
        <div className="justify-center items-center   w-12">
          <img src={defaultpfp} alt="" className="rounded-full " />
        </div>
        <div className="flex w-full flex-col">
          {/* <span>{name}</span> */}
          <span className="h-full gap-1 items-center flex">
            <span className="font-semibold text-[14px]">{name}</span>
            {isVerified && (
              <span className="h-full flex items-center">
                <img src={correctpng} className="h-5 w-5" alt="verified" />
              </span>
            )}
          </span>
          <span className="text-zinc-400 text-[14px]">@{username}</span>
        </div>
      </div>
      <div className="w-full h-full tracking-widest ">
        {data} hey there what is the main aim of yuou life if you want you cann
        taell me
      </div>
      <div className="w-ful h-5  mt-3 text-[10px] text-zinc-400">
        {formattedTime(createdAt)}
      </div>
      <div className="w-full">lol</div>
      {/* <div className="w-full"> */}
      {/* <div className="h-5 px-1  flex items-center justify-between w-40">
          <div className="w-full  h-full flex flex-col gap-2 justify-center">
            <span className="h-full gap-1 items-center flex">
              <span className="font-semibold">{name}</span>
              {isVerified && (
                <span className="h-full flex items-center">
                  <img src={correctpng} className="h-5 w-5" alt="verified" />
                </span>
              )}
            </span>
            <span className="text-zinc-400">@{username}</span>
            <span className="text-zinc-400 text-xs">
              *{createdAt ? timeAgoShort(createdAt) : "now"}
            </span>
          </div>
          <div className="items-center h-full">
            <span className="h-full flex items-center">×</span>
          </div>
        </div> */}
      {/* text data */}
      {/* <div className="px-1 font-sans w-full h-auto">{data}</div> */}
      {/* <div className="w-full h-6 mt-2 flex justify-around">
          <span className="h-full flex items-center gap-1">
            <img src={commentpng} className="h-full" alt="" />
            {comments?.length || 0}
          </span>
          <span
            className="h-full flex items-center gap-1"
            onClick={() => {
              setisLike(!islike);
              if (!islike) {
                setlikeCount(1);
              } else {
                setlikeCount(0);
              }
            }}
          >
            <img src={!islike ? love : loved} className="h-full" alt="" />
            {likeCount}
          </span>
          <span
            className="h-full flex items-center cursor-pointer gap-1"
            onClick={() => {
              navigator.clipboard.writeText("https://intiger.vercel.app");
            }}
          >
            <img src={share} className="h-full" alt="" />
          </span>
          {useIndex && (
            <span
              onClick={() => {
                onDelete(_id);
              }}
              className="h-full flex items-center cursor-pointer gap-1"
            >
              <img src={bin} className="h-full" alt="" />
            </span>
          )}
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default Mainpost;
