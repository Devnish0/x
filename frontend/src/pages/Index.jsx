import { Post } from "../components/post";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import Create from "./Create";
import Footer from "../components/Footer";
import api from "../services/axios";
import Spinner from "../components/spinner";
import { useNavigate } from "react-router";

export const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [input, setInput] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fetchposts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/index");
        const posts = response.data.posts;
        setInput(posts);
      } catch (error) {
        setError(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchposts();
  }, [navigate, refresh]);
  if (loading) {
    return (
      <div className="bg-black flex justify-center items-center w-full h-screen">
        <Spinner classname={"w-10 h-10"} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-black flex justify-center items-center w-full h-screen text-red-500">
        Error:{error.message}
      </div>
    );
  }
  return (
    <div className="h-screen w-full bg-black/90 flex flex-col text-white  ">
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
              onpost={() => {
                setRefresh((r) => r + 1);
              }}
            />
          )}
          <div className="w-full border-b flex items-center justify-around text-zinc-500  border-zinc-300 pb-2">
            <span> For you</span>
            <span> Following</span>
            <span> Build in public</span>
          </div>
          <div className="h-full w-full">
            {input.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                no posts yet
              </div>
            ) : (
              input.map((post) => {
                return (
                  <Post
                    key={post._id}
                    input={post}
                    isVerified={post?.user?.isAdmin === true}
                    useIndex={false} // Use === true for boolean check
                  />
                );
              })
            )}
          </div>
          {/* plus icon */}
          <button
            className="p-7 bg-blue-400  rounded-full w-8 h-8 flex justify-center items-center text-3xl bottom-15 right-2 fixed "
            onClick={() => {
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
