import { format } from "date-fns";
import { useState } from "react";
import { cancelBooking, updateStatus } from "../../../api/bookings";
import CancelModal from "../../Modal/CancelModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TableRow = ({ booking, refetch }) => {
  const navigate = useNavigate();
  let [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const closeCancelModal = () => {
    console.log("Close modal Called");
    setIsCancelModalOpen(false);
  };

  const modalHandler = async (id) => {
    try {
      await cancelBooking(id);
      await updateStatus(booking.roomId, false);
      refetch();
      toast.success("Booking Canceled");
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeCancelModal();
    }
  };

  const handleRowClick = () => {
    navigate(`/room/${booking.roomId}`);
  };
  return (
    <tr>
      <td
        onClick={handleRowClick}
        className="px-5 py-5 border-b border-gray-200 bg-white text-sm hover:cursor-pointer hover:underline"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="block relative">
              <img
                alt="profile"
                src={booking?.image}
                className="mx-auto object-cover rounded h-10 w-15 "
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-[#3b82f5] whitespace-no-wrap ">
              {booking?.title}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="block relative">
              <img
                alt="profile"
                src={booking?.guest?.image}
                className="mx-auto object-cover rounded h-10 w-15 "
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              {booking?.guest?.name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{booking?.price}€</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(booking?.from), "P")}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(booking?.to), "P")}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          onClick={() => setIsCancelModalOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-red-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
          ></span>
          <span className="relative">Cancel</span>
        </span>

        <CancelModal
          isCancelModalOpen={isCancelModalOpen}
          modalHandler={modalHandler}
          closeCancelModal={closeCancelModal}
          id={booking._id}
        />
      </td>
    </tr>
  );
};

export default TableRow;
