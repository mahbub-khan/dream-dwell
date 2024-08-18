import axios from "axios";
import axiosSecure from ".";

export const imageUpload = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_api_key}`,
    formData
  );

  return data;
};

//Admin stat data
export const getAdminStat = async () => {
  const { data } = await axiosSecure("/admin-stat");
  return data;
};

// Guest stat data
export const getGuestStat = async () => {
  const { data } = await axiosSecure.get("/guest-stat");

  return data;
};
