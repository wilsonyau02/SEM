import React, { useEffect, useState } from "react";
import { Button, Divider, Table, Tag, Typography } from 'antd';
import { supabase } from "../../../supabase-client";
import { useNavigate } from "react-router-dom";

function Application() {

  const [applicationData, setApplicationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    setLoading(true);

    const userID = (await supabase.auth.getUser()).data.user.id;

    const { data, error } = await supabase
      .from('Application')
      .select('*')
      .order('appliedDate', { ascending: false })
      .eq('studentID', userID)

    if (error) console.log('error', error)

    const tableData = [];

    if (data) {
      data.forEach((item, index) => {
        tableData.push({
          key: index,
          no: index + 1,
          sessionIntake: item.intake,
          programmeLevel: item.programme_level,
          programmeApplied: item.programme,
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
    },
    {
      title: 'Programme Applied',
      dataIndex: 'programmeApplied',
      key: 'programmeApplied',
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
  ];

  const containerStyle = {
    fontFamily: "Century Gothic",
    fontSize: '18px',
    color: '#000080',
    padding: 10,
    textAlign: 'center',
    padding: '0px 5em'
  };

  const texStyle = {
    fontWeight: "bold",
    fontSize: '30px'
  };

  const handleCreateNewApplication = () => {
    navigate('/student/application/new');
  }


  return (
    <>
      <div style={containerStyle} className="academicianContainer">
        <p style={texStyle}>
          My Application
        </p>
        <p>
          Welcome to our Application Center, your gateway to joining the TARUMT community. Whether you're a prospective student looking to start a new journey or a current student tracking your progress, this is the place to manage your applications.
        </p>
        <Button type="primary" size="large" style={{ margin: '1em 0px' }} onClick={handleCreateNewApplication}>
          Create New Application
        </Button>
      </div>



      <Divider />
      <Typography.Title level={3} style={{ padding: '0px 5em' }}>My Application</Typography.Title>
      <Table
        columns={columns}
        dataSource={applicationData}
        loading={loading}
        style={{ padding: '0px 5em' }}
      />

    </>
  )


}


export default Application;