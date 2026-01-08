// import authphoto from "/images/authpagewarrior.png";
import authpagewarrior from "../images/authpagewarrior.png";
import Input from "../components/Input";
import { ChecBox } from "../components/ChecBox";
import api from "../services/axios";

const AuthPage = ({ mode }) => {
  const isLogin = mode === "login";
  return (
    <div className="bg-[#686279] flex justify-center items-center w-full h-screen">
      <div className="w-[70%] h-[80%] bg-[#2C2638] text-white flex rounded-xl ">
        <div className="w-1/2 border-r-red-400 rounded-xl  h-full p-3">
          <div className="w-full h-full overflow-hidden  rounded-xl">
            <img src={authpagewarrior} alt="" className="object-fill" />
          </div>
        </div>
        <div className="w-1/2  h-full p-20">
          <h1 className="text-4xl font-[helvatica]">
            {isLogin ? "login to your account" : "Create an account"}
          </h1>
          <div className="my-8 ">
            {isLogin ? "Dont have an account?" : "Already have an account?"}
            {"  "}
            <a
              className="underline italic text-blue-400"
              href={isLogin ? "/signup" : "/login"}
            >
              click here
            </a>
          </div>
          <div className="  h-full">
            <div className="mt-6 h-[66%] ">
              <form
                className="flex h-full flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();

                  const data = Object.fromEntries(new FormData(e.target));
                  console.log(data);
                  api.post("/signup", data);
                }}
              >
                {!isLogin && (
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      placeholder="first name"
                      className="w-1/2"
                      name="firstname"
                    />
                    <Input
                      type="text"
                      placeholder="last name"
                      className="w-1/2"
                      name="lastname"
                    />
                  </div>
                )}

                <Input type="email" placeholder="email " name="email" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                />
                <div className="flex gap-3 py-12">
                  <ChecBox placeholder="I agree to the " />
                </div>

                <Input
                  type="submit"
                  className="bg-[#6D54B3] inline-block hover:bg-[#5b409d]  cursor-pointer"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
