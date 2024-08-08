import { Helmet } from "react-helmet-async";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import { useState } from "react";
import { imageUpload } from "../../../api/utils";
import useAuth from "../../../hooks/useAuth";

const AddRoom = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
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
      to,
      from,
      price,
      guests,
      bathrooms,
      bedrooms,
      host,
      image: imageUrl?.data?.display_url,
    };

    console.table(roomData);
  };

  //Handle date change from react-date-range calender
  const handleDates = (ranges) => {
    setDates(ranges.selection);
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
