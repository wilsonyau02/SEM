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

  useEffect(() => {
    async function fetchData() {
      const table = 'Academician';

      const fetchData = await fetchSupabaseData(table);
      setData(fetchData);
    }

    fetchData();
  }, []);

  return (
    <>
      <Row gutter={[16, 24]}>
        {data.map((item, index) => (
          <Col className="gutter-row" span={6} key={index}>
            <div style={style}>{item.Name}</div>
            <div style={style}>{item.Designation}</div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default StaffColumnGrid;
