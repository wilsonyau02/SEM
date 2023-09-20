import React, { useState } from 'react';
import { Tabs, Collapse, Divider } from 'antd';
import ProgramSelectList from './ProgramSelectList';
import PhDDetails from './PhDDetails';
import DegreeDetails from './DegreeDetails';

const { TabPane } = Tabs;

function ProgramDetails({ courses, programName, programIndex }) {

    // console.log('courses selected: ', { courses });
    // console.log('prog selected: ', { programName });
    // console.log('prog Index: ', { programIndex });

    const [selectedProgram, setSelectedProgram] = useState(null);

    const handleProgramChange = (value) => {
        setSelectedProgram(value);
    };

    const filteredCourses = selectedProgram
        ? courses.filter(course => course.progName === selectedProgram)
        : courses;
        
        const defaultActiveKey = programIndex !== null ? filteredCourses[programIndex]?.progName : filteredCourses[0]?.progName;
    return (
        <div>
            {/* Use the first course's index as defaultActiveKey */}
            <Tabs defaultActiveKey={defaultActiveKey}>
                {filteredCourses.map((course, index) => (
                    <TabPane tab={course.progName} key={course.progName}>

                        {programName === "Doctor of Philosophy" || programName === "Master Degree" ?
                            <PhDDetails course={course} /> :
                            <DegreeDetails course={course} />
                        }

                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
}

export default ProgramDetails;
