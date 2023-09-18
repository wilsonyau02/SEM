import { Button, Modal, Checkbox, Tooltip } from 'antd';
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';


const ComparisonModal = ({ isVisible, onClose, selectedCourses, setselectedCourses, programmeData, onCompare }) => {

    const navigate = useNavigate();

    const maxChecked = selectedCourses.length >= 3;

    const onChange = (checkedValues) => {
        const selected = programmeData.filter(course => checkedValues.includes(course.progId));
        setselectedCourses(selected);
    };

    const renderCheckboxesForCategory = (title, filterCriteria) => (
        <div>
            <h4 style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '3px' }}>{title}</h4>
            {programmeData
                .filter(course => filterCriteria(course.progName))
                .map(course => (
                    <div key={course.id}>
                        <Checkbox
                            value={course.progId}
                            disabled={maxChecked && !selectedCourses.map(c => c.progId).includes(course.progId)}
                            style={{ marginTop: '2px', marginBottom: '1px' }}
                        >
                            {course.progName}
                        </Checkbox>
                    </div>
                ))}
        </div>
    );

    const title = (
        <span style={{ display: 'flex', alignItems: 'center' }}>
            Select courses for comparison
            <Tooltip title="You can select at most 3 program courses to compare.">
                <AiOutlineQuestionCircle style={{ marginLeft: '10px' }} />
            </Tooltip>
        </span>
    );


    return (
        <Modal
            title={title}
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => {
                        console.log("Selected courses for comparison:", selectedCourses);
                        onClose();  // Close the current modal
                        // Open the CompareResultsModal. 
                        // For this, you might need to add an extra prop to the ComparisonModal to toggle the CompareResultsModal visibility
                        // Let's call this prop "onCompare" and expect it to be a function:
                        onCompare();
                    }}
                >
                    Compare
                </Button>

            ]}
        >
            <Checkbox.Group value={selectedCourses.map(course => course.progId)} onChange={onChange}>
                {renderCheckboxesForCategory('Doctor of Phisology', progName => progName.includes('Doctor of '))}
                {renderCheckboxesForCategory('Master Degree', progName => progName.includes('Master '))}
                {renderCheckboxesForCategory('Bachelor', progName => progName.includes('Bachelor'))}
                {renderCheckboxesForCategory('Diploma', progName => progName.includes('Diploma'))}
            </Checkbox.Group>
        </Modal>
    );
}

export default ComparisonModal;
