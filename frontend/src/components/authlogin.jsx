export default function OAuthButtons() {
  const backendURL = "http://localhost:5000"; // change in prod

  const loginWithGoogle = () => {
    window.location.href = `${backendURL}/auth/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${backendURL}/auth/github`;
  };

  return (
    <div className="space-y-3 ">
      <button
        onClick={loginWithGoogle}
        className="
          w-full
          flex items-center justify-center gap-2
          border border-gray-300
          rounded-md
          py-2
          text-sm
          hover:bg-gray-50
        "
      >
        Continue with Google
      </button>

      <button
        onClick={loginWithGithub}
        className="
          w-full
          flex items-center justify-center gap-2
          border border-gray-300
          rounded-md
          py-2
          text-sm
          hover:bg-gray-50
        "
      >
        Continue with GitHub
      </button>
    </div>
  );
}
