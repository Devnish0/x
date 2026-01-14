import React from "react";
import defaultpfp from "../assets/defaultpfp.png";
import commentpng from "../assets/comment.png";
import love from "../assets/love.png";
import share from "../assets/share.png";
import bin from "../assets/bin.png";
import loved from "../assets/liked.png";
import correctpng from "../assets/correct.png";
import api from "../services/axios";
import { useState } from "react";

export const Post = ({
  input = "error",
  isVerified,
  useIndex = true,
  onDelete,
}) => {
  const { comments = [], createdAt, likes = [], data, _id } = input;
  const [islike, setisLike] = useState(false);

  const { name, username } = input?.user;
  const [likeCount, setlikeCount] = useState(likes.length ?? 0);

  const timeAgoShort = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  };

  return (
    <div className="flex h-auto w-full px-3 bg-[#191919] py-2 border-b border-zinc-600">
      <div className="h-full w-12">
        <div className="flex justify-center items-center">
          <img src={defaultpfp} alt="" className="rounded-full" />
        </div>
      </div>
      <div className="w-full">
        <div className="h-5 px-1 flex items-center justify-between w-full">
          <div className="w-full h-full flex gap-2 items-center">
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
        </div>

        {/* text data */}
        <div className="px-1 font-sans w-full h-auto">{data}</div>

        <div className="w-full h-6 mt-2 flex justify-around">
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
        </div>
      </div>
    </div>
  );
};

export default Post;
