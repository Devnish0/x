import React from "react";
import defaultpng from "../assets/defaultpfp.png";
import Footer from "../components/Footer";
import { Post } from "../components/post";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { useState, useEffect } from "react";
import Spinner from "../components/spinner";
import correctpng from "../assets/correct.png";

const Profile = () => {
  const [userData, setUserdata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const deleteHandeler = async (postid) => {
    const response = await api.delete(`/api/post/deletepost/${postid}`);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/profile");
        setUserdata(response.data.data.user);
      } catch (error) {
        setError(error.message || "error in fetching your profile");
        console.error(error);
        if (error?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const input = userData;
  const { name, createdAt, username, followers, following, bio, location } =
    userData;
  if (loading) {
    return (
      <div className="bg-black flex justify-center items-center w-full h-screen">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#191919] pb-15 z-2 text-white flex flex-col">
      {/* Header */}
      <div className="flex text-black font-mono bg-amber-100 w-full h-32 relative items-center text-[10px] lg:text-xl justify-center">
        {/* back */}
        until death every defeat is psychological...
        <div className="w-19 h-19 ml-2 absolute left-0.5 -bottom-13">
          <img
            src={defaultpng}
            alt=""
            className="rounded-full border-2 border-[#191919]"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="px-4">
        <div className="flex w-full justify-end mt-3">
          <button
            className="px-4 py-1.25 rounded-full outline-zinc-500 outline text-zinc-500 bg-red-300 font-semibold"
            onClick={() => {
              navigate("/edit");
            }}
          >
            Edit Profile
          </button>
        </div>
        <div className="pt-2 flex flex-col">
          <span className="h-10 gap-1 items-center flex">
            <span className="font-semibold">{name}</span>
            {input.isAdmin && (
              <span className="h-full flex items-center">
                <img src={correctpng} className="h-[40%]" alt="" />
              </span>
            )}
          </span>
          <span className="text-[10px] text-zinc-400 font-bold">
            @{username}
          </span>
          <span className="text-[14px] ">{bio}</span>
          <span className="text-[10px] flex gap-3 text-zinc-400 font-bold">
            <span>{location}</span>
          </span>
          <span className="text-[10px] flex gap-3 text-zinc-400 font-bold">
            joined {userData.createdAt ? createdAt.slice(0, 10) : "N/A"}
          </span>
          <span className="text-[14px] flex gap-2">
            <span>
              <span className="font-semibold">{followers?.length || 0} </span>
              <span className="text-zinc-400">Followers</span>
            </span>
            <span>
              <span className="font-semibold">{following?.length || 0} </span>
              <span className="text-zinc-400">Following</span>
            </span>
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto border-t border-zinc-600 mt-2">
        {userData?.posts && userData.posts.length > 0 ? (
          userData.posts.map((post) => {
            return (
              <Post
                onDelete={deleteHandeler}
                key={post._id}
                input={post}
                isVerified={post?.user?.isAdmin === true} // Use === true for boolean check
              />
            );
          })
        ) : (
          <div className="text-center py-10 text-zinc-500">No posts yet</div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
