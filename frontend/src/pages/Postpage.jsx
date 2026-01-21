import { data, useParams } from "react-router-dom";
import api from "../services/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/spinner";
import Mainpost from "../components/Mainpost";

const Postpage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchpost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/post/${id}`);
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
    <div className="min-h-full h-m-screen text-white bg-[#191919]">
      <div
        className=" fixed top-0 text-white gap-6 outline-b outline h-10 flex items-center px-3 bg-[#191919] w-full"
        onClick={() => {
          navigate("/");
        }}
      >
        <span>backs</span>
        <span className="">Post</span>
      </div>
      <div className="h-10"></div>
      <div className="pt-6">
        <Mainpost
          input={post}
          isVerified={post?.user?.isAdmin === true}
          useIndex={false}
        />
      </div>
      {post.comments.length <= 0 ? (
        <div className="w-full h-130 flex items-center justify-center text-3xl text-zinc-600">
          no comments yet
        </div>
      ) : (
        <div className="w-full h-130 flex  text-3xl text-white"></div>
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
