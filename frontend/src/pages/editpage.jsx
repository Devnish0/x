// import authphoto from "/images/authpagewarrior.png";
import authpagewarrior from "../images/authpagewarrior.png";
import Input from "../components/Input";
import { ChecBox } from "../components/ChecBox";
import api from "../services/axios";
import logo from "../assets/icon.png";
import Spinner from "../components/spinner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ mode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState({});
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/edit");
        setData(response.data?.data?.user || {});
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const navigate = useNavigate();
  const isLogin = mode === "login";
  if (loading) {
    <>loading....</>;
  }
  if (error) {
    <>error....</>;
  }
  return (
    <div className="md:bg-[#686279] flex justify-center over items-center w-full h-screen fixed inset-0 overflow-hidden min-h-screen p-4">
      <div className="-z-1 h-full w-full md-hidden absolute backdrop-blur-xs"></div>
      <div className=" h-full w-full flex items-center md:hidden justify-center scale-120 absolute -z-2">
        <img
          src={authpagewarrior}
          alt=""
          className=" object-cover h-full w-full "
        />
      </div>

      {/* main div */}
      <div className="w-full  max-w-6xl h-auto md:h-[80vh] bg-[#2C2638] text-white flex flex-col md:flex-row rounded-xl overflow-hidden">
        {/* Image section - hidden on mobile */}
        <div className="hidden md:block md:w-1/2 h-64 md:h-full p-3">
          <div className="w-full h-full overflow-hidden rounded-xl">
            <img
              src={authpagewarrior}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form section */}
        <div className="w-full  md:w-1/2 h-full p-6 sm:p-10 lg:p-20 flex flex-col">
          <h1 className="text-2xl flex sm:text-3xl lg:text-4xl font-[helvatica]">
            <img src={logo} alt="" className="w-8 rotate-17 mr-4" />
            Edit your profile
          </h1>
          <div className="my-4 sm:my-6 lg:my-8 text-sm sm:text-base"></div>

          <div className="flex-1 flex flex-col">
            <form
              className="flex flex-col gap-3 sm:gap-4"
              onSubmit={async (e) => {
                setLoading(true);
                e.preventDefault();
                const payload = {
                  name: data.name || "",
                  username: data.username || "",
                  bio: data.bio || "",
                  location: data.location || "",
                };
                try {
                  const response = await api.post("/api/user/edit", payload);
                  if (response.status === 200) {
                    setTimeout(() => {
                      navigate("/profile");
                    }, 1000);
                  }
                } finally {
                  setLoading(false);
                }
              }}
            >
              {!isLogin && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Input
                    type="text"
                    placeholder="name"
                    value={data.name || ""}
                    className="w-full "
                    name="name"
                    onChange={(e) => {
                      setData((prev) => {
                        return { ...prev, name: e.target.value };
                      });
                    }}
                  />
                  <Input
                    type="text"
                    placeholder="username"
                    value={data.username || ""}
                    className="w-full "
                    name="username"
                    onChange={(e) => {
                      setData((prev) => {
                        return { ...prev, username: e.target.value };
                      });
                    }}
                  />
                </div>
              )}
              <Input
                type="text"
                placeholder="bio"
                name="bio"
                value={data.bio || ""}
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, bio: e.target.value };
                  });
                }}
              />
              <Input
                type="text"
                placeholder="location"
                name="location"
                value={data.location || ""}
                onChange={(e) => {
                  setData((prev) => {
                    return { ...prev, location: e.target.value };
                  });
                }}
              />
              <div className="flex gap-3 py-6 sm:py-8 lg:py-12 ">
                {/* <ChecBox placeholder="I agree to the" /> */}
              </div>
              <button
                className={`
                  bg-[#6D54B3]  hover:bg-[#5b409d] cursor-pointer
                  px-3 py-3 rounded-md flex items-center justify-center gap-3 border-0 outline-none focus:outline focus:ring-0 focus:border-0 outline-[#b3acc7] ring-0 focus-visible:outline `}
                type="submit"
                // disabled={loading}
              >
                submit
                {loading ? <Spinner /> : ""}
              </button>
              <button
                className={`
                  bg-red-500  hover:bg-red-600 cursor-pointer
                  px-3 py-3 rounded-md flex items-center justify-center gap-3 border-0 outline-none focus:outline focus:ring-0 focus:border-0 outline-[#b3acc7] ring-0 focus-visible:outline `}
                type="button"
                onClick={async () => {
                  try {
                    const response = await api.get("/api/auth/logout");
                    navigate("/");
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                logOut?
                {loading ? <Spinner /> : ""}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
