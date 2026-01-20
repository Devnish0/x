import React from "react";
import { useParams } from "react-router-dom";
import api from "../services/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../components/post";
import Spinner from "../components/spinner";

const Postpage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchpost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/post/${id}`);
        console.log(response);
        // const post = response.data;
        setPost(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchpost();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-black flex justify-center items-center w-full h-screen">
        <Spinner classname={"w-10 h-10"} />
      </div>
    );
  }
  return (
    <div className="min-h-full h-screen text-white bg-[#191919]">
      <div
        className=" fixed top-0 text-white gap-6 outline-b outline h-17 flex items-center px-3 w-full"
        onClick={() => {
          navigate("/");
        }}
      >
        <span>backs</span>
        <span className="text-xl">Post</span>
      </div>
      <div className="h-17"></div>
      <div className="">
        {console.log(post)}
        <Post
          input={post}
          isVerified={post?.user?.isAdmin === true}
          useIndex={false}
        />
      </div>
      {2 > 0 ? (
        <div className="w-full h-130 flex items-center justify-center text-3xl text-zinc-600">
          no comments yet
        </div>
      ) : (
        <div className="w-full h-130 flex  text-3xl text-white">
          <Post
            input={{
              _id: new ObjectId("696f2c7c2b026599f09f8ccc"),
              user: {
                _id: new ObjectId("696f2c722b026599f09f8cc5"),
                name: "nishank",
                username: "nishank@nishank.com",
                isAdmin: false,
              },
              data: "yoo lol",
              likes: [],
              comments: [],
              createdAt: "2026-01-20T07:19:24.276Z",
              updatedAt: "2026-01-20T07:19:24.276Z",
              __v: 0,
            }}
            isVerified={false}
            onDelete={() => {
              console.log("lol");
            }}
          />
        </div>
      )}
      <div className=" w-full justify-center fixed bottom-0 flex items-center">
        <form action="" method="get">
          <input type="text" />
        </form>
      </div>
    </div>
  );
};

export default Postpage;
