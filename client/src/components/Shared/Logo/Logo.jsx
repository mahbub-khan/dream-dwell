import { Link } from "react-router-dom";
import logoImg from "../../../assets/images/logo.png";

const Logo = () => {
  return (
    <Link to="/">
      <img
        className="hidden md:block"
        src={logoImg}
        alt="logo"
        width="140"
        height="140"
      />
    </Link>
  );
};

export default Logo;
