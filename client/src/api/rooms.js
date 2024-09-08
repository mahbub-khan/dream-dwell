import axiosSecure from ".";

//Get all rooms
export const getAllRooms = async () => {
  const { data } = await axiosSecure("/rooms");
  return data;
};

//Got all rooms for host
export const getHostRooms = async (email) => {
  const { data } = await axiosSecure(`/rooms/${email}`);
  return data;
};

//Get a single room
export const getSingleRoom = async (id) => {
  const { data } = await axiosSecure(`/room/${id}`);
  return data;
};

//Save a room data in DB
export const addRoom = async (roomData) => {
  const { data } = await axiosSecure.post(`/room`, roomData);

  return data;
};

//delete a room - for host
export const deleteRoom = async (id) => {
  const { data } = await axiosSecure.delete(`/rooms/${id}`);
  return data;
};

//update a room - for host
export const updateRoom = async (roomData, id) => {
  const { data } = await axiosSecure.put(`/rooms/${id}`, roomData);

  return data;
};

//update host info for a room when host profile is updated
export const updateHostInfo = async (roomData, id) => {
  const { data } = await axiosSecure.put(`/my-hosted-rooms/${id}`, roomData);

  return data;
};
