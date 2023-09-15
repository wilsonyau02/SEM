import React, { useState, useRef } from "react";
import { Table, Button, Input, Space, Tooltip, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import { supabase } from "../../../supabase-client";
import Typography from "antd/es/typography/Typography";
import { getDateTime } from "../../../components/timeUtils";

function ActivityLog() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(true);
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

  const fetchData = async () => {
    const { data, error } = await supabase.from("activity_log")
        .select("*")
        .order("time", { ascending: false })
        .eq("userType", "student");
    if (error) console.log("error", error);

    console.log(data);

    const tableData = await Promise.all(data.map(async (item) => {
      const studentName = await getStudentName(item.userID);
  
      return {
        key: item.id,
        student_id: item.userID,
        student_name: studentName,
        ip_address: item.ip_address,
        event: item.event_name,
        date: item.time,
      };
    }));
  

    setData(tableData); 
    setLoading(false);
  };

  const getStudentName = async (studentID) => {
    const { data, error } = await supabase
      .from("student")
      .select("*")
      .eq("student_id", studentID)
      .single();

    if (error) console.log("error", error);

    return `${data.first_name} ${data.last_name}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
        title: "Studnet ID",
        dataIndex: "student_id",
        key: "student_id",
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
    },
    {
        title: "Student Name",
        dataIndex: "student_name",
        key: "student_name",
        ...getColumnSearchProps(
          "student_name",
          "Search by Student Name"
          ),
    },
    {
        title: "IP Address",
        dataIndex: "ip_address",
        key: "ip_address",
        ...getColumnSearchProps(
          "ip_address",
          "Search by IP Address"
          ),
    },
    {
        title: "Event",
        dataIndex: "event",
        key: "event",
        filters: [
          {
            text: "SIGNED_IN",
            value: "SIGNED_IN",
          },
          {
            text: "SIGNED_OUT",
            value: "SIGNED_OUT",
          },
          {
            text: "PASSWORD_UPDATED",
            value: "PASSWORD_UPDATED",
          },
          {
            text: "SIGNED_UP",
            value: "SIGNED_UP",
          },
        ],
        onFilter: (value, record) => record.event.indexOf(value) === 0,
        render: (text) => (
          <Tag key={text}>
            {text}
          </Tag>
        ),
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
        render: (date) => <p>{getDateTime(date)}</p>,
      },
  ];

  return (
    <div>
      <Typography.Title level={3}>Activity Log</Typography.Title>
      <Table 
        columns={columns} 
        dataSource={data} 
        bordered 
        pagination={{ pageSize: 10 }}
        tableLayout="fixed"
        loading={loading} />
    </div>
  );
}
export default ActivityLog;
