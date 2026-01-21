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
      <div className="w-full h-full tracking-wide ">
        {data} hey there what is the main aim of yuou life if you want you cann
        taell me
      </div>
      <div className="w-ful h-5  mt-3 text-[10px] text-zinc-400">
        {formattedTime(createdAt)}
      </div>
      <div className="w-full flex gap-2">
        <span className="flex gap-2">
          {likeCount}
          <span className="text-zinc-500">Likes</span>
        </span>
        <span className="flex gap-2">
          {comments.length}
          <span className="text-zinc-500">Comments</span>
        </span>
      </div>
      <div className="w-full h-6 mt-2 flex justify-around ">
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
            navigator.clipboard.writeText(
              `https://intiger.nishank.dev/post/${_id}`,
            );
          }}
        >
          <img src={share} className="h-full" alt="" />
        </span>
      </div>
    </div>
  );
};

export default Mainpost;
