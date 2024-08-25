import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../Modal/DeleteModal";
import UpdateRoomModal from "../../Modal/UpdateRoomModal";
import { deleteRoom } from "../../../api/rooms";

const RoomDataRow = ({ room, refetch }) => {
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    //console.log("Close modal Called");
    setIsOpen(false);
  }

  const modalHandler = (id) => {
    deleteRoom(id)
      .then((data) => {
        refetch();
        toast.success("Room Deleted");
      })
      .catch((err) => toast.error(err.message));
    closeModal();
  };

  const handleRowClick = () => {
    navigate(`/room/${room._id}`);
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
                src={room?.image}
                className="mx-auto object-cover rounded h-10 w-15 "
              />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-[#3b82f5] whitespace-no-wrap font-normal">
              {room?.title}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{room?.location}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{room?.price}€</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(room?.from), "P")}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {format(new Date(room?.to), "P")}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          onClick={openModal}
          className="relative cursor-pointer inline-block px-3 py-1 font-normal text-red-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
          ></span>
          <span className="relative">Delete</span>
        </span>
        <DeleteModal
          isOpen={isOpen}
          closeModal={closeModal}
          modalHandler={modalHandler}
          id={room._id}
        />
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          onClick={() => setIsEditModalOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-normal text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update</span>
        </span>
        <UpdateRoomModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          room={room}
          id={room._id}
          refetch={refetch}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      </td>
    </tr>
  );
};

export default RoomDataRow;
