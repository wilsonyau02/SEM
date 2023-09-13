import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { fetchDropdownOptions } from '../../../supabase-client'; // Import your Supabase client function

const { Option } = Select;

const DropdownStaff = ({ onDropdownChange }) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const options = await fetchDropdownOptions(); // Fetch options from your database
      setDropdownOptions(options);
    }
    fetchData();
  }, []);

  const handleDropdownChange = (value) => {
    setSelectedValue(value);
    onDropdownChange(value); // Call the callback with the selected value
  };

  const clearSelection = () => {
    setSelectedValue(null);
    onDropdownChange(null);
  };

  const uniqueOptions = [...new Set(dropdownOptions)];

  return (

    <Select
      style={{ width: "18em" }}
      placeholder="Select a position"
      onChange={handleDropdownChange}
      value={selectedValue}
    >
      {/* Add an "All Positions" option */}
      <Option  onChange={ clearSelection}>
        All Positions
      </Option>
      {uniqueOptions.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
};

export default DropdownStaff;
