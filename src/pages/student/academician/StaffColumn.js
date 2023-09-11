import React, { useEffect, useState } from 'react';
import { Col, Row, Modal } from 'antd';
import { fetchSupabaseData } from '../../../supabase-client'; 
import DropdownStaff from './Dropdown';
import SearchbarStaff from './Searchbar';

const style = {
  padding: '8px',
};

const bar = {
  display: "flex"
};

const search = {
  float: "right",
  display: "flex"
};

const column = {
  padding:"10px",
  textAlign: 'center',
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
    <div style = {bar}>
      <div style = {search}>
        <div>
          <DropdownStaff
              selectedValue={selectedDropdownValue}
              onDropdownChange={handleDropdownChange}
              style = {{padding:"5px"}}
            />
        </div>
      
        <div>
          <SearchbarStaff
                searchText={searchText}

                onSearchTextChange={handleSearchTextChange}
                suffix={null} 
                style = {{padding:"5px"}}
              />
        </div>
      </div>
      <div style = {{paddingLeft: "60%"}}>
        <p>Number of Staff Displayed: {filteredData.length}</p>
      </div>
    </div>

    <div style = {column}>
        <Row gutter={[16, 24]}>
          {filteredData.map((item, index) => (
            <Col className="gutter-row" span={6} key={index} style={style}>

              <div onClick={() => handleColumnClick(item)} className="gutter-row-content"  style={{ backgroundColor: '#E9E9E9', padding:"10px", height: '50%' }}>
                <img style = {{}} src={item.CropPic} alt={`${item.Name}'s`} />
               
                <div  style = {{ fontSize: '18.5px' }}>{item.Name}</div>
                <div style = {{ fontSize: '15px', padding:"5px", fontStyle: 'italic'}}>{item.Position}</div>
                <div>
                  <a href={`mailto:${item.ContactInfo}`}>{item.ContactInfo}</a>
                </div>

              </div>
            </Col>
          ))}
        </Row>
    </div>

      <Modal
        title={selectedRow.Name}
        open={!!selectedRow} 
        onCancel={() => setSelectedRow('')} 
        footer={null}
        style={column}
      >
      {selectedRow && (
      <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={selectedRow.FullPic}
          alt={`${selectedRow.Name}'s Image`}
          style={{ padding: '20px' }}
        />
      </div>
      <div style={{ textAlign: "left", marginLeft: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <strong>Degree Earned:</strong> {selectedRow.DegreesEarned}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Position:</strong> {selectedRow.Position}
        </div>
        {selectedRow.Designation && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Designation:</strong> {selectedRow.Designation}
          </div>
        )}
        {selectedRow.ResearchArea && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Research Area:</strong> {selectedRow.ResearchArea}
          </div>
        )}
        {selectedRow.AreaOfInterest && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Area Of Interest:</strong> {selectedRow.AreaOfInterest}
          </div>
        )}
        <div style={{ marginBottom: "10px" }}>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${selectedRow.ContactInfo}`}>{selectedRow.ContactInfo}</a>
        </div>
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "500",
          }}
        >
          <div>"{selectedRow.Quote}"</div>
        </div>
      </div>

    </>
    
        
        )}
      </Modal>
    </>
  );
};

export default StaffColumnGrid;
