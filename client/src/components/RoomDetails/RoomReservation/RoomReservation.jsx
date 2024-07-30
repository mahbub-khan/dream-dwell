import Button from "../../Button/Button";
import CalendarComponent from "../CalendarComponent/Calendar";

const RoomReservation = ({ room }) => {
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
