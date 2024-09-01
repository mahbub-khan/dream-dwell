import { GrUserAdmin } from "react-icons/gr";
import useRole from "../../../hooks/useRole";
import MenuItem from "./MenuItem";
import { FaShopLock } from "react-icons/fa6";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import HostRequestModal from "../../Modal/HostRequestModal";
import toast from "react-hot-toast";
import { becomeHost } from "../../../api/auth";

const GuestMenu = () => {
  const { user } = useAuth();
  const [, role] = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const modalHandler = async () => {
    try {
      const data = await becomeHost(user?.email);
      if (data.modifiedCount > 0) {
        toast.success("Request Submitted ✅! Wait for the Admin's approval");
      } else {
        toast.success("Please, Wait for the Admin's approval ⛔");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <MenuItem icon={FaShopLock} label="My Bookings" address="my-bookings" />

      {role === "guest" && (
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center px-4 py-2 mt-5 transition-colors duration-300 transform text-gray-600 hover:bg-gray-300 hover:text-gray-700 cursor-pointer"
        >
          <GrUserAdmin className="w-5 h-5" />

          <span className="mx-4 font-medium">Become A Host</span>
        </div>
      )}
      <HostRequestModal
        modalHandler={modalHandler}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
};

export default GuestMenu;
