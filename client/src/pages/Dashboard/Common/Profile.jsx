import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useState } from "react";
import UpdateProfileModal from "../../../components/Modal/UpdateProfileModal";
import Loader from "../../../components/Shared/Loader";
import { useQuery } from "@tanstack/react-query";
import { getHostRooms } from "../../../api/rooms";
import { getBookings } from "../../../api/bookings";

const Profile = () => {
  const { user, resetPassword, updateUserProfile, logOut } = useAuth();
  const [userProfile, role, isLoading] = useRole();
  const navigate = useNavigate();

  //For Guest Info Update in bookings Collection
  const [guestName, setGuestName] = useState();
  const [guestImage, setGuestImage] = useState();

  //console.log(user);
  //console.log(role);

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  //Get all rooms for Host to update the listed rooms Host info
  const { data: myHostedRooms = [] } = useQuery({
    queryKey: ["hostedRooms"],
    queryFn: async () => await getHostRooms(user?.email),
    enabled: role === "host",
  });

  //Get all booked rooms for Guest to update the booked rooms guest info
  const { data: myBookedRooms = [] } = useQuery({
    queryKey: ["bookedRooms"],
    queryFn: async () => await getBookings(user?.email),
    enabled: role === "host" || role === "guest",
  });

  //Password Change function
  const handlePasswordChange = async () => {
    const email = user?.email;

    if (!email) {
      toast.error("No email found");
      return;
    }

    resetPassword(email)
      .then(() => {
        logOut();

        navigate("/login");
        toast.success(
          "Please check your inbox 📩 and login with the new password"
        );
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex justify-center items-center h-screen">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="bg-white shadow-lg rounded-2xl w-full sm:w-3/5">
        <img
          alt="profile"
          src="https://wallpapercave.com/wp/wp10784415.jpg"
          className="w-full mb-4 rounded-t-lg h-36"
        />
        <div className="flex flex-col items-center justify-center p-4 -mt-16">
          <a href="#" className="relative block">
            <img
              alt="profile"
              src={user.photoURL}
              className="mx-auto object-cover rounded-full h-24 w-24  border-2 border-white "
            />
          </a>

          <p className="p-2 px-4 text-xs text-white bg-[#d94e28] rounded-full">
            {role && role.toUpperCase()}
          </p>
          <p className="mt-2 text-lg sm:text-xl font-medium text-gray-800 ">
            User Id: {userProfile?._id}
          </p>
          <div className="w-full p-2 mt-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 ">
              <p className="flex flex-col">
                Name
                <span className="font-bold text-black ">
                  {user.displayName}
                </span>
              </p>
              <p className="flex flex-col">
                Email
                <span className="font-bold text-black ">{user.email}</span>
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="bg-[#d94e28] px-10 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053] block mb-1"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="bg-[#d94e28] px-7 py-1 rounded-lg text-white cursor-pointer hover:bg-[#af4053]"
                >
                  Change Password 🔐
                </button>
              </div>
              <UpdateProfileModal
                isOpen={isOpen}
                closeModal={closeModal}
                user={user}
                updateUserProfile={updateUserProfile}
                role={role}
                myHostedRooms={myHostedRooms}
                myBookedRooms={myBookedRooms}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
