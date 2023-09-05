import React, { useState, useEffect } from 'react';
import { AutoComplete, Input } from 'antd';
import  { searchAcademiciansByBranch } from '../../supabase-client'; 

const SearchbarStaff = () => {
  const [options, setOptions] = useState([]);
  
  const onSelect = (value) => {
    console.log('onSelect', value);
  };

  const handleSearch = async (value) => {
    if (value) {
      const searchResults = await searchAcademiciansByBranch(value);
      setOptions(searchResults);
    } else {
      setOptions([]);
    }
  };

  
  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      style={{
        width: 300,
      }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <Input.Search size="large" placeholder="Search for a staff..." enterButton />
    </AutoComplete>
  );
};

export default SearchbarStaff;
