import React, { useEffect, useState } from 'react';
import { Col, Row, Modal, Pagination, Empty } from 'antd';
import { fetchSupabaseData } from '../../../supabase-client';
import DropdownStaff from './DropdownStaff';
import DropdownDepartment from './DropdownDepartment';
import SearchbarStaff from './Searchbar';

const style = {
  padding: '8px',
};

const bar = {
  display: "flex",
  flexDirection: "row",
};

const search = {
  float: "right",
  display: "flex",
  marginLeft: "5%",
  width: "100%",
};

const column = {
  padding: "40px",
  textAlign: 'center',
};

const resultResponsive = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 8 },
  xl: { span: 6 },
};

const filterResponsive = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 8 },
  xl: { span: 6 },
};


const StaffColumnGrid = () => {
  const [data, setData] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const table = 'Academician';
      const fetchData = await fetchSupabaseData(table);
      setData(fetchData);
    }

    fetchData();
  }, []);

  const handleDepartmentChange = (selectedValue) => {
    setSelectedDepartment(selectedValue);
  };

  const handleDropdownChange = (selectedValue) => {
    setSelectedDropdownValue(selectedValue);
  };

  const handleSearchTextChange = (value) => {
    setSearchText(value);
  };

  const handleColumnClick = (rowData) => {
    setSelectedRow(rowData); // Step 2
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = data.filter((item) => {
    if (selectedDropdownValue && item.Position !== selectedDropdownValue) {
      return false;
    }
    if (selectedDepartment && item.Department !== selectedDepartment) {
      return false;
    }
    if (searchText && !item.Name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    return true;
  });


  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = filteredData.slice(startIndex, endIndex);


  return (
    <>
      <div style={{ padding: '20px' }}>
        <div style={bar} className='bar'>
          <Row style={search}>
            <Col {...filterResponsive} style={{ paddingBottom: "2%" }}>
              <DropdownStaff
                selectedValue={selectedDropdownValue}
                onDropdownChange={handleDropdownChange}
              />
            </Col>
            <Col {...filterResponsive} style={{ paddingBottom: "2%" }}>
              <DropdownDepartment
                selectedValue={selectedDepartment}
                onDepartmentChange={handleDepartmentChange}
              />
            </Col>
            <Col {...filterResponsive} style={{ paddingBottom: "2%" }}>
              <SearchbarStaff
                searchText={searchText}
                onSearchTextChange={handleSearchTextChange}
                suffix={null}
              />
            </Col>

            <Col style={{ fontSize: "1.2em" }} {...filterResponsive}>

              <p>Number of Staff Displayed: {filteredData.length}</p>
            </Col>
          </Row>
        </div>

        <div style={column}>
          <Row gutter={[20, 24]}>
            {itemsToDisplay.length > 0 ? (
              <>
                {itemsToDisplay.map((item, index) => (
                  <Col className="gutter-row" span={6} key={index} style={style} {...resultResponsive}>
                    <div onClick={() => handleColumnClick(item)} className="gutter-row-content">
                      <img style={{}} src={item.CropPic} alt={`${item.Name}'s`} />

                      <div style={{ fontSize: '18.5px' }}>{item.Name}</div>
                      <div style={{ fontSize: '15px', padding: "5px", fontStyle: 'italic' }}>{item.Position}</div>
                      <div>
                        <a href={`mailto:${item.ContactInfo}`}>{item.ContactInfo}</a>
                      </div>

                    </div>
                  </Col>
                ))}
              </>
            ) : (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <Empty description={<span style={{fontSize: '1.2em'}}>No staffs found</span>} />
              </div>
            )}
          </Row>
        </div>

        <Pagination
          style={{ textAlign: "center" }}
          current={currentPage}
          total={filteredData.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />

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
      </div>
    </>
  );
};

export default StaffColumnGrid;
