import { useEffect, useState } from "react";
import Button from "../../Button/Button";
import CalendarComponent from "../CalendarComponent/Calendar";
import { differenceInCalendarDays } from "date-fns";
import BookingModal from "../../Modal/BookingModal";
import useAuth from "../../../hooks/useAuth";
import {
  findMinDate,
  generateDateArray,
  isBooked,
} from "../Utilities/RoomReservationUtilies";
import { useQuery } from "@tanstack/react-query";
import { getBookingsForARoom } from "../../../api/bookings";

const RoomReservation = ({ room }) => {
  let [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  //console.log(user.email);
  const [totalDays, setTotalDays] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const latestAvailableDate = findMinDate(room?.from, room?.to);
  console.log(latestAvailableDate);

  //Fetching all the bookings for this room
  const { data: bookings = [], isLoading } = useQuery({
    enabled: !loading,
    queryKey: ["bookings"],
    queryFn: async () => await getBookingsForARoom(room?._id),
  });

  //Grabbing the available dates
  const [value, setValue] = useState({
    startDate: latestAvailableDate,
    endDate: new Date(room?.to),
    key: "selection",
  });

  const handleDateSelection = (ranges) => {
    setValue(ranges.selection);
    //console.log("Range:", ranges.selection);
    //console.log("Value in Room:", value);
    setTotalDays(
      parseInt(
        differenceInCalendarDays(
          ranges.selection.endDate,
          ranges.selection.startDate
        )
      ) + 1
    );
  };

  //console.log(totalDays);

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
    to: value?.endDate,
    from: value?.startDate,
    title: room?.title,
    roomId: room?._id,
    image: room?.image,
  });

  //console.log("Initial Booking Info: ", bookingInfo);

  //updating the bookingInfo upon date selection in the calender
  useEffect(() => {
    setBookingInfo((prevInfo) => ({
      ...prevInfo,
      price: totalPrice,
      to: value?.endDate,
      from: value?.startDate,
    }));
  }, [value, totalDays, totalPrice]);

  //setting the bookedDates array
  const today = new Date(new Date().setHours(23, 59, 0, 0));
  console.log(new Date(room?.to));
  useEffect(() => {
    if (new Date(room?.to) < today) {
      const allBookedDates = generateDateArray(room?.from, room?.to);
      setBookedDates(allBookedDates);
      return;
    } else if (bookings.length) {
      const allBookedDates = bookings.flatMap((booking) =>
        generateDateArray(booking.from, booking.to)
      );
      setBookedDates(allBookedDates);
    } else {
      setBookedDates([]);
    }
  }, [bookings]);

  console.log("Room Reservation:", bookedDates);
  console.log(bookings);

  //console.log(new Date(room?.to));

  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <p className="text-2xl font-semibold">{room?.price} €</p>
        <p className="font-light text-neutral-600">/night</p>
      </div>
      <hr />
      <div className="flex justify-center">
        <CalendarComponent
          value={value}
          handleDateSelection={handleDateSelection}
          latestAvailableDate={latestAvailableDate}
          room={room}
          bookedDates={bookedDates}
          isLoading={isLoading}
        />
      </div>
      <hr />
      <div className="p-4">
        <Button
          onClick={() => setIsOpen(true)}
          label={isBooked(user, room, totalPrice)}
          disabled={
            room?.host?.email === user?.email ||
            totalPrice === 0 ||
            room?.booked
          }
        />
      </div>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <p>Total</p>
        <p>{bookingInfo.price} €</p>
      </div>

      {/* Booking Modal  */}
      <BookingModal
        isOpen={isOpen}
        closeModal={closeModal}
        bookingInfo={bookingInfo}
        bookedDates={bookedDates}
        setBookedDates={setBookedDates}
        room={room}
        latestAvailableDate={latestAvailableDate}
      />
    </div>
  );
};

export default RoomReservation;
