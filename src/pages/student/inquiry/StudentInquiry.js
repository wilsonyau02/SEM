import { useEffect, useState } from "react";
import InquiryModal from "../../../components/inquiryModal";
import { postInquiry, fetchInquiries } from "../../../supabase-client";
import { useAuth } from "../../../context/AuthProvider";
import FaqButton from "../../../components/faqButton";
import { Button, Divider } from "antd";

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

  const containerStyle = {
    fontFamily: "Century Gothic",
    fontSize: '18px',
    color: '#000080',
    textAlign: 'center',
    padding: '10px 5em'
  };

  const texStyle = {
    fontWeight: "bold",
    fontSize: '30px'
  };


  return (
    <div>
       <div style={containerStyle} className="academicianContainer">
        <p style={texStyle}>
        Inquiries
        </p>
        <p>
        Have questions or need more information? Don't hesitate to reach out to us. 
          We're here to assist you and provide the answers you need. 
          Feel free to contact our dedicated team for inquiries and assistance.        </p>
        <Button type="primary" size="large" style={{ margin: '1em 0px' }} onClick={openModal}>
          Post Inquiries
        </Button>
      </div>
      <Divider />
  
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
                  className={`w-3 h-3 rounded-full ${inquiry.status === "pending" ? "bg-red-500" : "bg-green-500"
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
                      Responded at{" "}
                      {new Date(inquiry.responded_at).toLocaleString()}
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
      <FaqButton />
    </div>
  );
};

export default StudentInquiry;
