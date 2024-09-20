import { FaPersonHalfDress, FaHouse, FaBath } from "react-icons/fa6";

/* eslint-disable react/prop-types */
const RoomInfo = ({ room }) => {
  return (
    <div className="col-auto lg:col-span-4 md:col-span-3 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              "
        >
          <div>
            Hosted by:{" "}
            <span className="text-[#d94e28]">{room?.host?.name}</span>
          </div>

          <img
            className="rounded-full border-[1px] border-[#d94e28] h-[30px] w-[30px] object-cover"
            alt="Avatar"
            src={room?.host?.image}
          />
        </div>
        <div
          className="
                flex 
                flex-row 
                items-center 
                gap-4 
                font-light
                text-neutral-500
              "
        >
          <div className="flex items-center">
            <FaPersonHalfDress size={15} className="mr-[3px] text-[#464646]" />
            {room?.guests} {room?.guests > 1 ? "guests" : "guest"}
          </div>
          <div className="flex items-center">
            <FaHouse size={14} className="mr-[3px] text-[#464646]" />
            {room?.bedrooms} {room?.bedrooms > 1 ? "bedrooms" : "bedroom"}
          </div>
          <div className="flex items-center">
            <FaBath size={14} className="mr-[3px] text-[#464646]" />
            {room?.bathrooms} {room?.bathrooms > 1 ? "bathrooms" : "bathroom"}
          </div>
        </div>
      </div>

      <hr />
      <div
        className="
          text-lg font-light text-neutral-500"
      >
        {room?.description}
      </div>
      <hr />
    </div>
  );
};

export default RoomInfo;
