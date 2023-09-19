import { Modal, Table, Image, Button } from 'antd';

const CompareResultsModal = ({ isVisible, onClose, selectedCourses }) => {

    const criteriaWidth = 10; // in percentage

    const remainingWidth = 100 - criteriaWidth; // 80% if criteriaWidth is 20%
    const otherColumns = selectedCourses.length;
    const columnWidth = remainingWidth / otherColumns; // Percentage width for each of the other columns


    const columns = [
        {
            title: 'Criteria',
            dataIndex: 'criteria',
            key: 'criteria',
            width: `${criteriaWidth}%`,
            render: text => <strong>{text}</strong>,
        },
        ...selectedCourses.map(course => ({
            title: course.progName,
            dataIndex: course.progId,
            key: course.progId,
            width: `${columnWidth}%`
        }))
    ];



    const data = [
        { criteria: 'Program Level', ...generateRowData('progLvl') },
        { criteria: 'Course Title', ...generateRowData('progCategory') },
        { criteria: 'Overview', ...generateRowData('overview') },
        { criteria: 'Intake', ...generateRowData('intake') },
        { criteria: 'Duration', ...generateRowData('duration') },
        { criteria: 'Campus', ...generateRowData('campus') },
        { criteria: 'Program Outline', ...generateRowData('outline') },
        { criteria: 'Career Prospect', ...generateRowData('careerProspects') },
        { criteria: 'Minimum Entry Requirement', ...generateRowData('minEntry') },
        { criteria: 'Academic Progression', ...generateRowData('academicProg') },
        { criteria: 'Fees', ...generateRowData('financial') },
    ];

    function generateRowData(key) {
        return selectedCourses.reduce((acc, course) => {
            if (key === 'progCategory') {
                acc[course.progId] = course.progCategory || course.progName; // Use progName if progCategory is null
            } else if (key === 'academicProg') {
                if (!course.academicProg) {
                    acc[course.progId] = 'N/A';
                } else {
                    acc[course.progId] = <Image src={course.academicProg} alt="Academic Progression" style={{ maxWidth: '100%' }} />;
                }
            } else if (key === 'financial') {
                if (!course.financial) {
                    acc[course.progId] = "N/A";
                } else if (Array.isArray(course.financial)) {
                    acc[course.progId] = (
                        <ul style={{ listStyleType: 'disc' }}>
                            {course.financial.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    );
                } else {
                    acc[course.progId] = course.financial; // Display as is if it's not an array
                }
            } else if (key === 'outline') {
                let content = [<strong>Compulsory</strong>];
                if (Array.isArray(course.outline)) {
                    content.push(
                        <ul style={{ listStyleType: 'disc' }}>
                            {course.outline.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    );
                } else {
                    content.push(course.outline || 'N/A');
                }

                // Electives
                ['elective1', 'elective2', 'elective3', 'elective4', 'otherSub'].forEach(electiveKey => {
                    if (course[electiveKey]) {
                        content.push(<strong>{electiveKey.charAt(0).toUpperCase() + electiveKey.slice(1)}</strong>);  // Convert electiveKey to Title Case
                        if (Array.isArray(course[electiveKey])) {
                            content.push(
                                <ul style={{ listStyleType: 'disc' }}>
                                    {course[electiveKey].map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            );
                        } else {
                            content.push(course[electiveKey]);
                        }
                    }
                });

                acc[course.progId] = content;

            } else if (['progLvl', 'progName'].includes(key)) {
                acc[course.progId] = course[key];
            } else if (key === 'minEntry') {
                if (!course.minEntry) {
                    // If minEntry is null or undefined, use degreeEntry as an image
                    acc[course.progId] = <Image src={course.degreeEntry} alt="Degree Entry" style={{ maxWidth: '100%' }} />;
                } else if (Array.isArray(course.minEntry)) {
                    acc[course.progId] = (
                        <ul style={{ listStyleType: 'disc' }}>
                            {course.minEntry.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    );
                } else {
                    acc[course.progId] = course[key];
                }
            } else if (Array.isArray(course[key])) {
                // Convert the arrays into bullet point lists
                acc[course.progId] = (
                    <ul style={{ listStyleType: 'disc' }}>
                        {course[key].map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                );
            } else {
                acc[course.progId] = course[key]; // In case there are other non-array types
            }
            return acc;
        }, {});
    }








    return (
        <Modal
            width="90%"
            visible={isVisible}
            onCancel={onClose}
            title="Course Comparison"
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            <Table columns={columns} dataSource={data} pagination={false} />
        </Modal>
    );

}

export default CompareResultsModal;
