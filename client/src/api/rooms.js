import axiosSecure from ".";

//Get all rooms
export const getAllRooms = async () => {
  const { data } = await axiosSecure("/rooms");
  return data;
};

//Get a single room
export const getSingleRoom = async (id) => {
  const { data } = await axiosSecure(`/room/${id}`);
  return data;
};
