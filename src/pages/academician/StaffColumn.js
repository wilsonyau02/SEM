import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { fetchSupabaseData } from '../../supabase-client'; 
import DropdownStaff from './Dropdown';
import SearchbarStaff from './Searchbar';

const style = {
  background: '#eb4c42',
  padding: '8px 0',
};

const StaffColumnGrid = () => {
  const [data, setData] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    async function fetchData() {
      const table = 'Academician';
      const fetchData = await fetchSupabaseData(table);
      setData(fetchData);
    }

    fetchData();
  }, []);

  const handleDropdownChange = (selectedValue) => {
    console.log('Selected value in parent component:', selectedValue);
    setSelectedDropdownValue(selectedValue);
  };
  
  const handleSearchTextChange = (value) => {
    console.log('Search value selected:', value);
    setSearchText(value);
  };

// Filter data based on selectedDropdownValue and searchText
const filteredData = data.filter((item) => {
  // Check if a dropdown option is selected and filter based on it
  if (selectedDropdownValue && item.Position !== selectedDropdownValue) {
    return false;
  }
  // Optionally, you can add a search text filter here
  if (searchText && !item.Name.toLowerCase().includes(searchText.toLowerCase())) {
    return false;
  }
  return true;
});

  
    return (
      <>
        <DropdownStaff
          selectedValue={selectedDropdownValue}
          onDropdownChange={handleDropdownChange} // Correct prop name
        />
        <SearchbarStaff
          searchText={searchText}
          onSearchTextChange={handleSearchTextChange}
        />
        <div>
        <Row gutter={[16, 24]}>
          {filteredData.map((item, index) => (
            <Col className="gutter-row" span={6} key={index} style={style}>
              <img src={item.CropPic} alt={`${item.Name}'s Image`} />
              <div >{item.Name}</div>
              <div >{item.Position}</div>
              <div >{item.ContactInfo}</div>
            </Col>
          ))}
        </Row>

        </div>
      </>
    );
  };
  
  export default StaffColumnGrid;