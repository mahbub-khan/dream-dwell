import { useState } from "react";
import Button from "../../Button/Button";
import CalendarComponent from "../CalendarComponent/Calendar";
import { formatDistance } from "date-fns";

const RoomReservation = ({ room }) => {
  const [value, setValue] = useState({
    startDate: new Date(room?.from),
    endDate: new Date(room?.to),
    key: "selection",
  });

  //Total days
  const totalDays = parseInt(
    formatDistance(new Date(room?.to), new Date(room?.from)).split(" ")[0]
  );

  //Price calculation
  const totalPrice = totalDays * room?.price;

  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <p className="text-2xl font-semibold">{room?.price} €</p>
        <p className="font-light text-neutral-600">/night</p>
      </div>
      <hr />
      <div className="flex justify-center">
        <CalendarComponent value={value} />
      </div>
      <hr />
      <div className="p-4">
        <Button label={"Reserve"} />
      </div>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <p>Total</p>
        <p>{totalPrice} €</p>
      </div>
    </div>
  );
};

export default RoomReservation;
