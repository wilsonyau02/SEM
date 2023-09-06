import React, { useState} from 'react';
import { AutoComplete, Input } from 'antd';

const SearchbarStaff = ({ onSearchTextChange }) => {
  const [options, setOptions] = useState('');

  const onSelect = (value) => {
    console.log('onSelect', value);
  };

  const handleSearch = async (value) => {
    setOptions(value);
    onSearchTextChange(value); // Send the search text to the parent component
  };

  return (
    <AutoComplete
      popupMatchSelectWidth={200}
      style={{
        width: 300,
      }}
      value={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <Input.Search size="large" placeholder="Search for a staff..." enterButton />
    </AutoComplete>
  );
};

export default SearchbarStaff;
