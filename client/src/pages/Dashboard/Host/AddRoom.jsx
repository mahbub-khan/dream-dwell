import { Helmet } from "react-helmet-async";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import { useState } from "react";
import { imageUpload } from "../../../api/utils";
import useAuth from "../../../hooks/useAuth";
import { addRoom } from "../../../api/rooms";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const form = event.target;

    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const description = form.description.value;
    const to = dates.endDate;
    const from = dates.startDate;
    const price = form.price.value;
    const guests = form.total_guest.value;
    const bathrooms = form.bathrooms.value;
    const bedrooms = form.bedrooms.value;
    const host = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    };

    const image = form.image.files[0];
    const imageUrl = await imageUpload(image);

    const roomData = {
      location,
      category,
      title,
      description,
      to,
      from,
      price,
      guests,
      bathrooms,
      bedrooms,
      host,
      image: imageUrl?.data?.display_url,
    };

    //Save room data in DB
    try {
      setLoading(true);
      const data = await addRoom(roomData);
      setUploadButtonText("Image Uploaded!!");
      toast.success("Room Added");
      navigate("/dashboard/my-listings");
      console.log(data);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Handle date change from react-date-range calender
  const handleDates = (items) => {
    console.log(items);
    setDates(items.selection);
  };

  //Handle Image upload button text
  const handleImageChange = (image) => {
    setUploadButtonText(image.name);
  };

  return (
    <div>
      <Helmet>
        <title>Add Room | Dashboard</title>
      </Helmet>

      {/* Form  */}
      <AddRoomForm
        handleSubmit={handleSubmit}
        handleDates={handleDates}
        dates={dates}
        handleImageChange={handleImageChange}
        uploadButtonText={uploadButtonText}
        loading={loading}
      />
    </div>
  );
};

export default AddRoom;
