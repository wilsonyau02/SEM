import { useEffect, useState } from "react";
import InquiryModal from "../../../components/inquiryModal";
import { postInquiry, fetchInquiries } from "../../../supabase-client";
import { useAuth } from "../../../context/AuthProvider";

const StudentInquiry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const { userSession } = useAuth();
  const userId = userSession.user ? userSession.user.id : null;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitInquiry = async (inquiry) => {
    try {
      await postInquiry(inquiry, userId);
      closeModal();
      fetchInquiriesFromSupabase();
    } catch (error) {
      console.error("Error submitting inquiry:", error.message);
    }
  };

  const fetchInquiriesFromSupabase = async () => {
    const inquiries = await fetchInquiries();
    setInquiries(inquiries);
  };

  useEffect(() => {
    fetchInquiriesFromSupabase();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center mt-3 border-b-2 pb-2">
        <h1 className="font-bold text-4xl">Inquiries</h1>
        <p className="mt-2">
          Please leave an inquiry, and it will be answered as soon as possible
        </p>
        <button
          className="mt-4 px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 font-bold"
          onClick={openModal}
        >
          Post Inquiry
        </button>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4`}
      >
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="bg-white rounded-lg shadow-md border border-orange-400 relative h-fit break-words"
          >
            <div className="p-4 bg-orange-400 rounded-t flex flex-row items-center justify-between">
              <p className="text-white text-sm font-bold">
                Created At: {inquiry.created_at.toLocaleString()}
              </p>
              <div className="flex items-center">
                <span className="ml-2 text-white font-bold mr-2">
                  {inquiry.status === "pending" ? "In Progress" : "Completed"}
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${
                    inquiry.status === "pending" ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
              </div>
            </div>

            <div className="pt-1 p-4">
              <p className="text-lg mt-2 font-bold">Inquiry</p>
              <p>{inquiry.content}</p>
              {inquiry.response && (
                <div className="mt-2">
                  <p className="text-lg text-gray-700 font-bold">Response</p>
                  <p>{inquiry.response}</p>
                  {inquiry.responded_at && (
                    <div className="text-xxs text-gray-500">
                      Responded at {new Date(inquiry.responded_at).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <InquiryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitInquiry}
        title={"Make an Inquiry"}
        placeholder={"Type your inquiry here..."}
      />
    </div>
  );
};

export default StudentInquiry;
