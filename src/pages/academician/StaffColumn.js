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


  const handleDropdownChange = (value) => {
    setSelectedDropdownValue(value);
  };

  const handleSearchTextChange = (value) => {
    setSearchText(value);
  };

    // Filter data based on selectedDropdownValue and searchText
  const filteredData = data.filter((item) => {
      if (selectedDropdownValue && item.Designation !== selectedDropdownValue) {
        return false;
      }
      if (searchText && !item.Name.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      return true;
  });
  
    return (
      <>
        <DropdownStaff
          selectedValue={selectedDropdownValue}
          onDropdownChange={handleDropdownChange}
        />
        <SearchbarStaff
          searchText={searchText}
          onSearchTextChange={handleSearchTextChange}
        />
        <div>
          <Row gutter={[16, 24]}>
            {filteredData.map((item, index) => (
              <Col className="gutter-row" span={6} key={index}>
                <div style={style}>{item.Name}</div>
                <div style={style}>{item.Designation}</div>
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
  };
  
  export default StaffColumnGrid;