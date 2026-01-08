import React from "react";
import defaultpng from "../assets/defaultpfp.png";
import Footer from "../components/Footer";
import { Post } from "../components/post";
import { Link } from "react-router-dom";

<Link to="/dashboard">
  <button>Go</button>
</Link>;

const input = [
  {
    name: "nishank",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this for real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
  {
    name: "nishank",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this for real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
  {
    name: "woohoo",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this for real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
  {
    name: "woohoo",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this for real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
  {
    name: "woohoo",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this for real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
  {
    name: "woohoo",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this are you sure about what you think about this life you migt think it can be real but trust me this is all fake for real             yes this i real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
  {
    name: "woohoo",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this are you sure about what you think about this life you migt think it can be real but trust me this is all fake for real             yes this i real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
  {
    name: "woohoo",
    username: "nishank@006",
    isverified: true,
    time: "1h",
    data: "hey lol is this are you sure about what you think about this life you migt think it can be real but trust me this is all fake for real             yes this i real",
    likes: ["la;ksjfd;lksajdf;lkjsad", "ksajdf;lkj"],
    comments: [{ id: 1, text: "nice post", userID: "jlksjafdlkj" }],
  },
];

const Profile = () => {
  return (
    <div className="w-full h-full bg-[#191919]  z-2 text-white ">
      <div className="flex bg-pink-500 w-full h-32 relative items-center justify-center">
        {" "}
        back
        <div className=" w-19 h-19 ml-2 absolute left-0.5 -bottom-13 ">
          <img
            src={defaultpng}
            alt=""
            className="rounded-full border-2 border-[#191919]"
          />
        </div>
      </div>
      <div className="px-4">
        <div className="flex w-full justify-end mt-3 ">
          <Link to="/signup">
            <button className="px-4 py-1.25 rounded-full outline-zinc-500 outline text-zinc-500 bg-red-300 font-semibold">
              logOut
            </button>
          </Link>
        </div>
        <div className="pt-2  flex flex-col">
          <span className="text-[17px] font-bold">nishank</span>
          <span className="text-[10px] text-zinc-400 font-bold">
            @nishank__
          </span>
          <span className="text-[14px] ">wanna be fullstack dev | CS29</span>
          <span className="text-[10px] flex gap-3 text-zinc-400 font-bold">
            <span> Deutschland </span> <span> Born 30 December 2007</span>
          </span>
          <span className="text-[10px] flex gap-3 text-zinc-400 font-bold">
            joined March 2025
          </span>
          <span className="text-[14px]">
            <span>
              <span className="font-semibold">487 </span>
              <span className="text-zinc-400">Following </span>
            </span>
            <span>
              <span className="font-semibold">487 </span>
              <span className="text-zinc-400">Following </span>
            </span>
          </span>
        </div>
      </div>
      <div className="border-t pb-17 border-zinc-600 mt-2 h-full">
        {input.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
