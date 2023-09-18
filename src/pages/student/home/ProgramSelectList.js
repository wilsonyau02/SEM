import { Select } from 'antd';

const ProgramSelectList = ({ onProgramChange }) => {

    const { Option } = Select;

    const handleClick = (value) => {
        onProgramChange(value);
    };

    return ( 
        <Select
            placeholder="Select a program"
            style={{ width: 200 }}
            onChange={handleClick}  // Use the passed function here
        >
            <Option value="Doctor of Philosophy">Doctor of Philosophy</Option>
            <Option value="Master Degree">Master Degree</Option>
            <Option value="Bachelor">Bachelor</Option>
            <Option value="Diploma">Diploma</Option>
        </Select>
    );
}

export default ProgramSelectList;
