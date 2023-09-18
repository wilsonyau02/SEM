import { useState } from "react";

const InquiryModal = ({ isOpen, onClose, onSubmit, title, placeholder }) => {
  const [inquiry, setInquiry] = useState("");

  const handleInquiryChange = (e) => {
    setInquiry(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inquiry);
    setInquiry("");
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="w-96 bg-white p-4 rounded relative">
        <h2 className="text-2xl font-semibold text-orange-500 mb-2">
          {title}
        </h2>
        <textarea
          className="w-full h-32 resize-none p-2 border rounded focus:outline-none focus:ring focus:border-orange-300"
          placeholder={placeholder}
          value={inquiry}
          onChange={handleInquiryChange}
        />
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
