import { DateRange } from "react-date-range";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getBookingsForARoom } from "../../../api/bookings";
import { useEffect, useState } from "react";
import Loader from "../../../components/Shared/Loader";
import { generateDateArray } from "../Utilities/RoomReservationUtilies";

const CalendarComponent = ({
  value,
  handleDateSelection,
  latestAvailableDate,
  room,
  bookedDates,
  isLoading,
}) => {
  // const { loading } = useAuth();
  // const { data: bookings = [], isLoading } = useQuery({
  //   enabled: !loading,
  //   queryKey: ["bookings"],
  //   queryFn: async () => await getBookingsForARoom(room?._id),
  // });

  // console.log("Bookings: ", bookings);

  // const [bookedDates, setBookedDates] = useState([]);

  // useEffect(() => {
  //   if (bookings.length) {
  //     const allBookedDates = bookings.flatMap((booking) =>
  //       generateDateArray(booking.from, booking.to)
  //     );
  //     setBookedDates(allBookedDates);
  //   } else {
  //     setBookedDates([]);
  //   }
  // }, [bookings]);

  // console.log("Booked Dates:", bookedDates);

  // const bookedDateSet = new Set(bookedDates.map((date) => date.getTime()));
  // console.log(bookedDateSet);

  // const roomHostedForDates = generateDateArray(latestAvailableDate, room?.to);

  // console.log("Room Hosted Dates: ", roomHostedForDates);

  // const matchedDates = roomHostedForDates.every((date) =>
  //   bookedDateSet.has(date.getTime())
  // );
  // console.log(matchedDates);

  // //console.log("Value in Calender: ", value);
  // //console.log("hostingDates in Calender: ", hostingDates);

  if (isLoading) return <Loader />;

  return (
    <DateRange
      ranges={[value]}
      rangeColors={["#d94e28"]}
      onChange={(ranges) => handleDateSelection(ranges)}
      minDate={latestAvailableDate}
      maxDate={new Date(room?.to)}
      direction="vertical"
      showDateDisplay={false}
      scroll={{ enabled: true }}
      disabledDates={bookedDates}
    />
  );
};

export default CalendarComponent;
