import { DateRange } from "react-date-range";

const CalendarComponent = ({ value }) => {
  return (
    <DateRange
      ranges={[value]}
      rangeColors={["#f43f5e"]}
      minDate={new Date()}
      direction="vertical"
      showDateDisplay={false}
    />
  );
};

export default CalendarComponent;
