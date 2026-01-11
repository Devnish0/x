import defaultpfp from "../assets/defaultpfp.png";
import logo from "../assets/icon.png";
import { Link } from "react-router";
const Header = ({ className }) => {
  return (
    <div className={className}>
      <div className="w-full  flex items-center h-13 justify-between px-3 mt-2 ">
        <Link className="flex items-center h-full" to={"/profile"}>
          <img src={defaultpfp} alt="" className="h-[90%] rounded-full " />
        </Link>

        <div className="   flex items-center h-full">
          <img src={logo} alt="" className="h-[50%] rotate-15 rounded-full " />
        </div>
        <div className="   flex items-center h-full">
          <span>......</span>
          <span>...</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
