// import authphoto from "/images/authpagewarrior.png";
import authpagewarrior from "../images/authpagewarrior.png";
import Input from "../components/Input";
import { ChecBox } from "../components/ChecBox";
import api from "../services/axios";
import logo from "../assets/icon.png";
import Spinner from "../components/spinner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthPage = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState("form"); // "form", "otp"
  const navigate = useNavigate();

  return (
    <div className="md:bg-[#686279] flex justify-center items-center w-full h-screen fixed inset-0 overflow-hidden min-h-screen p-4">
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
            {mode == "login" ? "Login to your account" : "Create an account"}
          </h1>
          <div className="my-4 sm:my-6 lg:my-8 text-sm sm:text-base">
            {mode == "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            {"  "}
            <span
              className="underline cursor-pointer italic text-blue-400"
              onClick={() => {
                mode == "login" ? navigate("/signup") : navigate("/login");
              }}
            >
              click here
            </span>
          </div>

          <div className="flex-1 flex flex-col">
            {authStep === "form" && (
              <>
                {mode == "signup" && (
                  <SignupForm
                    loading={loading}
                    setLoading={setLoading}
                    setAuthStep={setAuthStep}
                  />
                )}
                {mode == "login" && (
                  <LoginForm loading={loading} setLoading={setLoading} />
                )}
              </>
            )}
            {authStep === "otp" && (
              <OTPForm
                loading={loading}
                setLoading={setLoading}
                setAuthStep={setAuthStep}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

// Signup Form Component
const SignupForm = ({ loading, setLoading, setAuthStep }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const response = await api.post("/api/signup", data);
      if (response.status === 201) {
        setAuthStep("otp");
      }
    } catch (err) {
      console.log("error is ", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Input
          type="text"
          placeholder="name"
          className="w-full"
          name="name"
          required
        />
        <Input
          type="text"
          placeholder="username"
          className="w-full"
          name="username"
          required
        />
      </div>
      <Input type="email" placeholder="email" name="email" required />
      <Input type="text" placeholder="bio" name="bio" />
      <Input type="text" placeholder="location" name="location" />
      <Input
        type="password"
        placeholder="Enter your password"
        name="password"
        required
      />
      <div className="flex gap-3 py-6 sm:py-8 lg:py-12">
        <ChecBox placeholder="I agree to the" />
      </div>
      {error && (
        <div className="w-full border flex items-center justify-center rounded-md h-12 text-red-600 border-red-300">
          {error.response?.data?.message || "some error occured"}
        </div>
      )}

      <button
        className="bg-[#6D54B3] hover:bg-[#5b409d] cursor-pointer px-3 py-3 rounded-md flex items-center justify-center gap-3 border-0 outline-none"
        type="submit"
      >
        submit
        {loading ? <Spinner /> : ""}
      </button>
    </form>
  );
};

// Login Form Component
const LoginForm = ({ loading, setLoading }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const response = await api.post("/api/login", data);
      if (response.status === 201) {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
      <Input type="email" placeholder="email" name="email" required />
      <Input
        type="password"
        placeholder="Enter your password"
        name="password"
        required
      />
      <button
        className="bg-[#6D54B3] hover:bg-[#5b409d] cursor-pointer px-3 py-3 rounded-md flex items-center justify-center gap-3 border-0 outline-none"
        type="submit"
      >
        submit
        {loading ? <Spinner /> : ""}
      </button>
    </form>
  );
};

// OTP Verification Component
const OTPForm = ({ loading, setLoading, setAuthStep }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const response = await api.post("/api/verify", data);
      if (response.status === 201) {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
      <p className="text-sm sm:text-base text-gray-300 mb-4">
        Enter the OTP sent to your email
      </p>
      <Input
        type="text"
        placeholder="Enter OTP"
        name="otp"
        maxLength="6"
        required
      />
      {error && (
        <div className="w-full border flex items-center justify-center rounded-md h-12 text-red-600 border-red-300">
          {error.response?.data?.message || "some error occured"}
        </div>
      )}
      <button
        className="bg-[#6D54B3] hover:bg-[#5b409d] cursor-pointer px-3 py-3 rounded-md flex items-center justify-center gap-3 border-0 outline-none"
        type="submit"
      >
        verify
        {loading ? <Spinner /> : ""}
      </button>
      <button
        type="button"
        onClick={() => setAuthStep("form")}
        className="text-sm text-gray-400 hover:text-gray-200"
      >
        Back to signup
      </button>
    </form>
  );
};
