import { useState } from "react";
import Button from "../../Button/Button";
import CalendarComponent from "../CalendarComponent/Calendar";
import { formatDistance } from "date-fns";
import BookingModal from "../../Modal/BookingModal";
import useAuth from "../../../hooks/useAuth";

const RoomReservation = ({ room }) => {
  let [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  //console.log(user.email);

  const isBooked = () => {
    if (user?.email === room?.host?.email) return "You are the Host 🏠";
    if (room?.booked === true) return "Already Booked";

    return "Reserve";
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //Grabbing the available dates
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

  const [bookingInfo, setBookingInfo] = useState({
    guest: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    host: room?.host?.email,
    location: room?.location,
    price: totalPrice,
    to: value.endDate,
    from: value.startDate,
    title: room?.title,
    roomId: room?._id,
    image: room?.image,
  });

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
        <Button
          onClick={() => setIsOpen(true)}
          label={isBooked()}
          disabled={room.host.email === user.email || room.booked}
        />
      </div>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <p>Total</p>
        <p>{totalPrice} €</p>
      </div>

      {/* Booking Modal  */}
      <BookingModal
        isOpen={isOpen}
        closeModal={closeModal}
        bookingInfo={bookingInfo}
      />
    </div>
  );
};

export default RoomReservation;
