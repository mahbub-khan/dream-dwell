import { DateRange } from "react-date-range";
import Loader from "../../../components/Shared/Loader";

const CalendarComponent = ({
  value,
  handleDateSelection,
  latestAvailableDate,
  room,
  bookedDates,
  isLoading,
}) => {
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
