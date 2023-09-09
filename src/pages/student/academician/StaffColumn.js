import React, { useEffect, useState } from 'react';
import { Col, Row, Modal } from 'antd';
import { fetchSupabaseData } from '../../../supabase-client'; 
import DropdownStaff from './Dropdown';
import SearchbarStaff from './Searchbar';

const style = {
  background: '#eb4c42',
  padding: '8px 0',
};

const StaffColumnGrid = () => {
  const [data, setData] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState(''); // Step 1

  useEffect(() => {
    async function fetchData() {
      const table = 'Academician';
      const fetchData = await fetchSupabaseData(table);
      setData(fetchData);
    }

    fetchData();
  }, []);

  const handleDropdownChange = (selectedValue) => {
    setSelectedDropdownValue(selectedValue);
  };
  
  const handleSearchTextChange = (value) => {
    setSearchText(value);
  };

  const handleColumnClick = (rowData) => {
    setSelectedRow(rowData); // Step 2
  };

  const filteredData = data.filter((item) => {
    if (selectedDropdownValue && item.Position !== selectedDropdownValue) {
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
            <Col className="gutter-row" span={6} key={index} style={style}>

              <div onClick={() => handleColumnClick(item)}>
                <img src={item.CropPic} alt={`${item.Name}'s Image`} />
                <div>{item.Name}</div>
                <div>{item.Position}</div>
                <div>{item.ContactInfo}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        title="Column Details"
        open={!!selectedRow} 
        onCancel={() => setSelectedRow('')} 
        footer={null}
      >

        {selectedRow && (
          <>
            <img src={selectedRow.CropPic} alt={`${selectedRow.Name}'s Image`} />
            <div>{selectedRow.Name}</div>
            <div>{selectedRow.Position}</div>
            <div>{selectedRow.ContactInfo}</div>
          </>
        )}
      </Modal>
    </>
  );
};

export default StaffColumnGrid;
