//Checking if all the dates are booked or not
export const isAllDatesBooked = (bookedDates, latestAvailableDate, room) => {
  const bookedDateSet = new Set(bookedDates.map((date) => date.getTime()));

  const roomHostedForDates = generateDateArray(latestAvailableDate, room?.to);

  //console.log("Room Hosted Dates: ", roomHostedForDates);

  const isAllBooked = roomHostedForDates.every((date) =>
    bookedDateSet.has(date.getTime())
  );

  return isAllBooked;
};

//Seeting the Book/reserve button text
export const isBooked = (user, room, totalPrice) => {
  const today = new Date(new Date().setHours(23, 59, 0, 0));
  const formattedEndDate = new Date(room?.to);
  //console.log(formattedEndDate);
  if (user?.email === room?.host?.email) return "You are the Host 🏠";
  if (formattedEndDate < today) return "Not Available Now 🚫";
  if (room?.booked === true) return "Already Booked 🚫";
  if (totalPrice === 0) return "Select Dates 🗓️";

  return "Reserve";
};

//finding out the latest available date
export const findMinDate = (startDate, endDate) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0)); //setting the hours to midnight(12 AM)
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  if (formattedEndDate < today) return formattedStartDate;
  if (formattedStartDate >= today) return formattedStartDate;

  return today;
};

//Generating a date array from a range
export const generateDateArray = (startDate, endDate) => {
  const myStartDate = new Date(startDate);
  const myEndDate = new Date(endDate);
  const tempDateArray = [];

  let currentDate = myStartDate;

  while (currentDate <= myEndDate) {
    tempDateArray.push(new Date(currentDate));

    // Increment current date by 1 day
    new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return tempDateArray;
};

export const isBookingPeriodEnded = (startDate, endDate) => {
  const today = new Date(new Date().setHours(23, 59, 0, 0));
  const formattedEndDate = new Date(endDate);

  return generateDateArray(startDate, endDate);
};
