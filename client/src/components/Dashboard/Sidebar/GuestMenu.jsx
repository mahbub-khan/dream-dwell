import MenuItem from "./MenuItem";
import { FaShopLock } from "react-icons/fa6";

const GuestMenu = () => {
  return (
    <>
      <MenuItem icon={FaShopLock} label="My Bookings" address="my-bookings" />
    </>
  );
};

export default GuestMenu;
