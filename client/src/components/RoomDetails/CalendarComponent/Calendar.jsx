import { DateRange } from "react-date-range";

const CalendarComponent = ({ value }) => {
  return (
    <DateRange
      ranges={[value]}
      rangeColors={["#d94e28"]}
      minDate={new Date()}
      direction="vertical"
      showDateDisplay={false}
    />
  );
};

export default CalendarComponent;
