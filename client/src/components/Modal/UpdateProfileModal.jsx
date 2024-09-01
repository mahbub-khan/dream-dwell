import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { imageUpload } from "../../api/utils";
import toast from "react-hot-toast";
import UpdateProfileForm from "../Form/UpdateProfileForm";

const UpdateProfileModal = ({
  isOpen,
  user,
  closeModal,
  updateUserProfile,
}) => {
  const [loading, setLoading] = useState(false);

  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
  const [userName, setUserName] = useState(user.displayName);
  const [userImage, setUserImage] = useState(user.photoURL);

  const handleImageUpdate = (image) => {
    setUploadButtonText(image.name);
    //setLoading(true);
    imageUpload(image)
      .then((res) => {
        setUserImage(res.data.display_url);
        setLoading(false);
      })
      .catch((err) => {
        //console.log(err);
        setLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    //Updating in the firebase
    updateUserProfile(userName, userImage)
      .then(() => {
        toast.success("Profile updated");
        closeModal();
      })
      .catch((err) => {
        toast.error(err.message);
        closeModal();
      });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium text-center leading-6 text-gray-900 pb-3"
                >
                  Update Profile
                </Dialog.Title>

                <hr />
                <div className="w-full">
                  <UpdateProfileForm
                    handleSubmit={handleSubmit}
                    handleImageUpdate={handleImageUpdate}
                    loading={loading}
                    userName={userName}
                    setUserName={setUserName}
                    uploadButtonText={uploadButtonText}
                  />
                </div>
                <hr className="mt-0 " />
                <div className="mt-2 ">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateProfileModal;
