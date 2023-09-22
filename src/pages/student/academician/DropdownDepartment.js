import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { fetchDropdownOptionsDepartment} from '../../../supabase-client'; // Import your Supabase client function

const { Option } = Select;

const DropdownDepartment = ({ onDepartmentChange }) => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    async function fetchData() {
        const options =  await fetchDropdownOptionsDepartment(); // Fetch department options from your database
        setDepartmentOptions(options);
    }
    fetchData();
  }, []);

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    onDepartmentChange(value); // Call the callback with the selected department
  };

  const clearDepartmentSelection = () => {
    setSelectedDepartment(null);
    onDepartmentChange(null);
  };

  const uniqueDepartmentOptions = [...new Set(departmentOptions)];

  return (
    <Select
      style={{ width: "100%"}}
      placeholder="Select a department"
      onChange={handleDepartmentChange}
      value={selectedDepartment}
    >
      {/* Add an "All Departments" option */}
      <Option onChange={clearDepartmentSelection}>
        All Departments
      </Option>
      {uniqueDepartmentOptions.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
};

export default DropdownDepartment;
