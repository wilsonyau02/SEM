import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { fetchDropdownOptions } from '../../supabase-client'; 

const DropdownStaff = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const options = await fetchDropdownOptions();
      setDropdownOptions(options);
    }
    fetchData();
  }, []);

  const handleMenuClick = () => {
    setOpen(false);
  };

  const handleOpenChange = (flag) => {
    setOpen(flag);
  };

  return (
    <Dropdown
      menu={{
        items: dropdownOptions.map((option) => ({
          label: option,
          key: option,
        })),
        onClick: handleMenuClick,
      }}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Campus Branch
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropdownStaff;