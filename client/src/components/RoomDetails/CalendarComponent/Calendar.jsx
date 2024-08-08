import { DateRange } from "react-date-range";

const CalendarComponent = ({}) => {
  return (
    <DateRange
      //ranges={[value]}
      rangeColors={["#f43f5e"]}
      direction="vertical"
      showDateDisplay={false}
    />
  );
};

export default CalendarComponent;
