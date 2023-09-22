import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import { AiOutlineSearch } from 'react-icons'

const SearchbarProgram = ({ onProgramChange, style }) => {

  const options = [
    { value: 'Doctor of Philosophy (Computer Science)', index: 0 },
    { value: 'Doctor of Philosophy (Information Technology)', index: 1 },
    { value: 'Doctor of Philosophy (Mathematical Sciences)', index: 2 },
    { value: 'Master of Computer Science', index: 0 },
    { value: 'Master of Information Technology', index: 1 },
    { value: 'Master of Science in Mathematical Sciences', index: 2 },
    { value: 'Bachelor of Information Systems', index: 0 },
    { value: 'Bachelor of Software Engineering', index: 1 },
    { value: 'Bachelor of Computer Science (IST)', index: 2 },
    { value: 'Bachelor of Science (Mathematics)', index: 3 },
    { value: 'Bachelor of Information Technology (SSD)', index: 4 },
    { value: 'Bachelor of Information Technology (IT)', index: 5 },
    { value: 'Bachelor of Information Technology (IS)', index: 7 },
    { value: 'Bachelor of Computer Science (DS)', index: 6},
    { value: 'Diploma in Computer Science', index: 0 },
    { value: 'Diploma in Information Systems', index: 1 },
    { value: 'Diploma in Software Engineering', index: 2 },
    { value: 'Diploma in Software Technology', index: 3 },
  ];

  const onSelect = (value) => {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      let { value, index } = selectedOption; // Destructure both value and index from the selected option

      // Check if the value starts with "Doctor of" and adjust the value accordingly
      if (value.startsWith("Doctor of")) {
        value = "Doctor of Philosophy";
      }

      if (value.startsWith("Master")) {
        value = "Master Degree";
      }
      if (value.startsWith("Diploma")) {
        value = "Diploma";
      }

      if (value.startsWith("Bachelor")) {
        value = "Bachelor";
      }

      console.log('value: ', value, 'index: ', index);
      onProgramChange(value, index); // Pass both value and index to the callback
    }
  };



  return (
    <AutoComplete
      style={{
        width: 200, ...style
      }}
      options={options.map(option => ({ value: option.value }))}
      onSelect={onSelect}
      placeholder="Search for a program..."
      filterOption={(inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    />
  );
};

export default SearchbarProgram;