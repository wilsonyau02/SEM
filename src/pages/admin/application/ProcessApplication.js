import React, { useEffect, useState } from "react";
import { Button, Divider, Table, Tag, Typography } from 'antd';
import { supabase } from "../../../supabase-client";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "./ApplicationModal";

function ProcessApplication() {

  const [applicationData, setApplicationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from('Application')
      .select('*, studentID(*)')
      .order('appliedDate', { ascending: false })

    if (error) console.log('error', error)

    const tableData = [];

    if (data) {
      data.forEach((item, index) => {
        tableData.push({
          key: index,
          no: index + 1,
          applicationID: item.applicationID,
          sessionIntake: item.intake,
          programmeLevel: item.programme_level,
          programmeApplied: item.programme,
          appliedBy: `${item.studentID.first_name} ${item.studentID.last_name}`,
          applicationDate: item.appliedDate,
          status: (item.status === true ? 
            <Tag color="green">Pass</Tag> :
            <Tag color="red">Fail</Tag>)

        })
      })
    }

    setApplicationData(tableData);
    setLoading(false);
  }


  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Session Intake',
      dataIndex: 'sessionIntake',
      key: 'sessionIntake',
    },
    {
      title: 'Programme Level',
      dataIndex: 'programmeLevel',
      key: 'programmeLevel',
      render: (text) => <span>{text.toUpperCase()}</span>,
    },
    {
      title: 'Programme Applied',
      dataIndex: 'programmeApplied',
      key: 'programmeApplied',
    },
    {
        title: 'Applied By',
        dataIndex: 'appliedBy',
        key: 'appliedBy',
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" onClick={() => handleModalChange(record)} style={{ margin: '1em 0px' }} >
                View
            </Button>
        ),
    },
  ];

  const handleModalChange = (record) => {
    console.log(record);
    setSelectedApplicationID(record.applicationID);
    setIsModalOpen(true);
  };

  const onChangeModal = (value) => {
    setIsModalOpen(value);
  };

  return (
    <>
      <Typography.Title level={3}>Application</Typography.Title>
      <Table
        columns={columns}
        dataSource={applicationData}
        loading={loading}
      />
      <ApplicationModal
        isModalOpen={isModalOpen}
        onChangeModal={onChangeModal}
        applicationID={selectedApplicationID}
        />
    </>
  )


}


export default ProcessApplication;