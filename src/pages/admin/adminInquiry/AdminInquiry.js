import { useEffect, useState } from "react";
import InquiryModal from "../../../components/inquiryModal";
import {
  fetchInquiries,
  updateInquiryResponse,
} from "../../../supabase-client";
import { useAuth } from "../../../context/AuthProvider";
import { Divider, Radio, Typography } from "antd";
import "./adminInquiry.css"

const AdminInquiry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const { userSession } = useAuth();
  const userId = userSession.user ? userSession.user.id : null;

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry.inquiry_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRespondInquiry = async (response) => {
    try {
      await updateInquiryResponse(selectedInquiry, response, userId);
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


  //Filter status
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filterUserInquiries = (inquiries) => {
    if (statusFilter === "all") {
      return inquiries;
    } else {
      return inquiries.filter((inquiry) => inquiry.status === statusFilter);
    }
  };

  const filteredUserInquiries = filterUserInquiries(inquiries);

  return (
    <div>
      <Typography.Title level={2}>Answer Inquiries</Typography.Title>

      <div className="filter-container flex items-center justify-center mb-4">
        <div className="mr-2">Filter by Status:</div>
        <Radio.Group onChange={handleStatusChange} value={statusFilter}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="pending">In Progress</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
        </Radio.Group>
      </div>

      <Divider />
      <div
        className="inquiries-container">
        {filteredUserInquiries.length > 0 ? (
          filteredUserInquiries.map((inquiry) => (
            <div
              key={inquiry.inquiry_id}
              className="bg-white rounded-lg shadow-md border border-orange-400 relative break-words inquiry-card"
            >
              <div className="p-4 bg-orange-400 rounded-t flex flex-row items-center justify-between" style={{ backgroundColor: '#eea500' }}>
                <p className="text-white text-sm font-bold">
                  Created At: <br />{new Date(inquiry.created_at).toLocaleString()}
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
                {inquiry.response !== "N/A" && inquiry.response && (
                  <div className="mt-2">
                    <p className="text-lg text-gray-700 font-bold">Response</p>
                    <p>{inquiry.response}</p>
                    <div className="text-xxs text-gray-500">{new Date(inquiry.responded_at).toLocaleString()}</div>
                  </div>
                )}
                {inquiry.status === "pending" && (
                  <div className="mt-2 flex justify-end">
                    <button
                      className="bg-orange-300 hover:bg-orange-400 text-white p-2 rounded-md mt-2"
                      onClick={() => openModal(inquiry)}
                    >
                      Respond
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <span className="font-bold text-2xl text-red-500">No inquiries found.</span>
            </div>
        )}
        

      </div>
      <InquiryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleRespondInquiry}
        title="Respond to Inquiry"
        inquiry={selectedInquiry}
        placeholder={"Type your response here..."}
      />
    </div>
  );
};

export default AdminInquiry;
