import { useState } from "react";
import Button from "../../Button/Button";
import CalendarComponent from "../CalendarComponent/Calendar";
import { formatDistance, formatDistanceStrict } from "date-fns";

const RoomReservation = ({ room }) => {
  // Ensure the dates are valid and set the initial state
  // const startDate = room?.from ? new Date(room.from) : null;
  // const endDate = room?.to ? new Date(room.to) : null;

  // const [value, setValue] = useState({
  //   startDate: startDate,
  //   endDate: endDate,
  //   key: "selection",
  // });

  // const totalDays =
  //   startDate && endDate
  //     ? parseInt(
  //         formatDistanceStrict(endDate, startDate, { unit: "day" }).split(
  //           " "
  //         )[0]
  //       )
  //     : 0;

  // const totalPrice = totalDays * (room?.price || 0);

  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <p className="text-2xl font-semibold">{room?.price} €</p>
        <p className="font-light text-neutral-600">/night</p>
      </div>
      <hr />
      <div className="flex justify-center">
        <CalendarComponent />
      </div>
      <hr />
      <div className="p-4">
        <Button label={"Reserve"} />
      </div>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <p>Total</p>
        <p>{room?.price} €</p>
      </div>
    </div>
  );
};

export default RoomReservation;
