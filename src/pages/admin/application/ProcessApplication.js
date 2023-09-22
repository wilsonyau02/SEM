import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Input, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { supabase } from "../../../supabase-client";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "./ApplicationModal";
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";

function ProcessApplication() {

  const [applicationData, setApplicationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    fetchData();
  }, [trigger]);

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
          status: item.status ? "Pass" : "Fail",
        })
      })
    }

    setApplicationData(tableData);
    setLoading(false);
  }


  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Input
          ref={searchInput}
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="filter-button"
          >
            Search
          </Button>

          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            className="filter-button"
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "black" : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });


  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '3%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Session Intake',
      dataIndex: 'sessionIntake',
      key: 'sessionIntake',
      ...getColumnSearchProps("sessionIntake", "Search Intake"),
      width: '8%',
    },
    {
      title: 'Programme Level',
      dataIndex: 'programmeLevel',
      key: 'programmeLevel',
      render: (text) => {
        switch (text) {
          case "alevel":
            return <span>A-Level</span>;
          case "diploma":
            return <span>Diploma</span>;
          case "degree":
            return <span>Degree</span>;
          case "foundation":
            return <span>Foundation</span>;
          default:
            return <span>{text}</span>;
        }
      },
      filters: [
        {
          text: 'A-Level',
          value: 'alevel',
        },
        {
          text: 'Diploma',
          value: 'diploma',
        },
        {
          text: 'Degree',
          value: 'degree',
        },
        {
          text: 'Foundation',
          value: 'foundation',
        },
      ],
      onFilter: (value, record) => record.programmeLevel.indexOf(value) === 0,
      width: '8%',

    },
    {
      title: 'Programme Applied',
      dataIndex: 'programmeApplied',
      key: 'programmeApplied',
      ...getColumnSearchProps("programmeApplied", "Search Programme"),
      ellipsis: {
        showTitle: false,
      },
      render: (programmeApplied) => (
        <Tooltip placement="topLeft" title={programmeApplied}>
          {programmeApplied}
        </Tooltip>
      ),
      width: '20%',
    },
    {
      title: 'Applied By',
      dataIndex: 'appliedBy',
      key: 'appliedBy',
      ...getColumnSearchProps("appliedBy", "Search Name"),
      ellipsis: {
        showTitle: false,
      },
      render: (appliedBy) => (
        <Tooltip placement="topLeft" title={appliedBy}>
          {appliedBy}
        </Tooltip>
      ),
      width: '10%',
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      sorter: (a, b) => new Date(a.applicationDate) - new Date(b.applicationDate),
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps("applicationDate", "Search Date"),
      width: '10%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Pass',
          value: 'Pass'
        },
        {
          text: 'Fail',
          value:  'Fail'
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text) => (
        <Tag key={text} color={text === "Pass" ? "green" : "red"}>
          {text}
        </Tag>
      ),
      width: '5%',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleModalChange(record)} style={{ margin: '1em 0px', border: 'none', backgroundColor: 'transparent' }}>
          <EyeOutlined style={{ fontSize: "20px", color: "#eea500" }} />
        </Button>
      ),
      width: '5%',
    },
  ];

  const handleModalChange = (record) => {
    setSelectedApplicationID(record.applicationID);
    setIsModalOpen(true);
  };

  const onChangeModal = (value) => {
    setIsModalOpen(value);
  };

  const handleTrigger = () => {
    setTrigger(!trigger);
  };

  return (
    <>
      <Typography.Title level={3}>Programme Application</Typography.Title>
      <Table
        columns={columns}
        dataSource={applicationData}
        loading={loading}
        scroll={{ x: 1500 }} 
        pagination={{ pageSize: 10 }}
        size="middle"
      />
      <ApplicationModal
        isModalOpen={isModalOpen}
        onChangeModal={onChangeModal}
        applicationID={selectedApplicationID}
        handleTrigger={handleTrigger}
      />
    </>
  )


}


export default ProcessApplication;