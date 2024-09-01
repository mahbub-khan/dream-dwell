import { TbFidgetSpinner } from "react-icons/tb";
const UpdateProfileForm = ({
  handleSubmit,
  loading,
  handleImageUpdate,
  userName,
  setUserName,
  uploadButtonText,
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-60vh)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-1 text-sm">
            <label htmlFor="name" className="block text-gray-600">
              Name
            </label>
            <input
              className="w-full px-4 py-3 text-gray-800 border border-[#d94e2885] focus:outline-[#d94e28] rounded-md "
              name="name"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              id="name"
              type="text"
              placeholder="Your Name"
              required
            />
          </div>

          <p className="block text-sm text-gray-600 -mb-3">Profile Photo</p>
          <div className=" bg-white w-full  m-auto rounded-lg">
            <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
              <div className="flex flex-col w-max mx-auto text-center">
                <label>
                  <input
                    onChange={(event) => {
                      handleImageUpdate(event.target.files[0]);
                    }}
                    className="text-sm cursor-pointer w-36 hidden"
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    hidden
                  />
                  <div className="bg-[#d94e28] text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 transition duration-200 hover:bg-[#9b2707]">
                    {uploadButtonText}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-[#d94e28]"
        >
          {loading ? (
            <TbFidgetSpinner className="m-auto animate-spin" size={24} />
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
