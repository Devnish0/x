import { Post } from "../components/post";
import Header from "../components/Header";
import { useState } from "react";
import Create from "./Create";
import Footer from "../components/Footer";

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
export const Index = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="h-auto w-full bg-black/90 flex flex-col text-white  ">
      {show ? (
        <Create
          oncross={() => {
            setShow(false);
          }}
        />
      ) : (
        <>
          <div className="h-20"></div>
          <Header className="fixed bg-[#191919]  w-full top-0 " />
          {show && (
            <Create
              oncross={() => {
                setShow(false);
              }}
            />
          )}
          <div className="w-full border-b flex items-center justify-around text-zinc-500  border-zinc-300 pb-2">
            <span> For you</span>
            <span> Following</span>
            <span> Build in public</span>
          </div>

          <div>
            {input.map((post, index) => (
              <Post key={index} {...post} />
            ))}
          </div>
          {/* plus icon */}
          <button
            className="p-7 bg-blue-400  rounded-full w-8 h-8 flex justify-center items-center text-3xl bottom-15 right-2 fixed "
            onClick={() => {
              console.log("wojo");
              setShow(true);
            }}
          >
            +
          </button>
          <div>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};
