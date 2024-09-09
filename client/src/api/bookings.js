import axiosSecure from ".";

//create payment intent
export const createPaymentIntent = async (price) => {
  const { data } = await axiosSecure.post("/create-payment-intent", price);

  return data;
};

//save booking info in db
export const saveBookingInfo = async (paymentInfo) => {
  const { data } = await axiosSecure.post("/bookings", paymentInfo);

  return data;
};

//update room status after booking in DB
export const updateStatus = async (id, status) => {
  const { data } = await axiosSecure.patch(`/rooms/status/${id}`, { status });

  return data;
};

//get all bookings for a guest by email
export const getBookings = async (email) => {
  const { data } = await axiosSecure(`/bookings?email=${email}`);
  return data;
};

//update guest info when profile is updated
export const updateGuestInfo = async (guestData, id) => {
  const { data } = await axiosSecure.put(`/booking/${id}`, guestData);

  return data;
};

//update title and image when host changes info of his room
export const updateTitleImage = async (updatedData, id) => {
  const { data } = await axiosSecure.put(`/booking-update/${id}`, updatedData);

  return data;
};

//get all host bookings by email
export const getHostBookings = async (email) => {
  const { data } = await axiosSecure(`/bookings/host/?email=${email}`);
  return data;
};

//get all bookings for a room
export const getBookingsForARoom = async (roomId) => {
  const { data } = await axiosSecure(`/bookings/${roomId}`);
  return data;
};

//Cancel Booking for a host
export const cancelBooking = async (id) => {
  const { data } = await axiosSecure.delete(`/bookings/${id}`);

  return data;
};
