/* eslint-disable react/prop-types */
import { ScaleLoader } from "react-spinners";

const Loader = ({ smallHeight }) => {
  const color = "#d94e28";
  return (
    <div
      className={` ${smallHeight ? "h-[250px]" : "h-[70vh]"}
      flex 
      flex-col 
      justify-center 
      items-center `}
    >
      <ScaleLoader size={100} color={color} />
    </div>
  );
};

export default Loader;
