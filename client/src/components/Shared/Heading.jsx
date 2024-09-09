import { FaMapLocationDot } from "react-icons/fa6";

const Heading = ({ title, subtitle, center }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl font-bold">{title}</div>
      <div className="flex items-center font-light text-neutral-500 mt-2 ">
        {" "}
        <FaMapLocationDot className="mr-2" /> {subtitle}
      </div>
    </div>
  );
};

export default Heading;
