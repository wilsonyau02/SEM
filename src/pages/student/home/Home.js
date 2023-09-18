import React, { useState, useEffect } from 'react';
import { fetchProgramData, fetchProgrammeData } from '../../../supabase-client';
import { Button, Modal, Checkbox } from 'antd';

import ProgramSelector from "./ProgramSelector";
import ProgramDetails from "./ProgramDetails";
import ProgramSelectList from './ProgramSelectList';
import SearchbarProgram from './SearchbarProgram';
import ComparisonModal from './ComparisonModal';
import CompareResultsModal from './CompareResultsModal';

const Home = () => {
    const [programmeData, setProgrammeData] = useState([]);
    const [selectedProgramCourses, setSelectedProgramCourses] = useState(null);
    const [programName, setProgramName] = useState(null);
    const [programIndex, setProgramIndex] = useState(null);
    const [selectedCourses, setselectedCourses] = useState([]);
    const [compareModalVisible, setCompareModalVisible] = useState(false); // just a placeholder, you might already have a state management for this
    const [isResultsModalVisible, setIsResultsModalVisible] = useState(false);

    const onChange = (checkedValues) => {
        setselectedCourses(checkedValues);
    };

    const maxChecked = selectedCourses.length >= 3;

    useEffect(() => {
        async function fetchData() {
            const data = await fetchProgrammeData();
            setProgrammeData(data);
        }
        fetchData();
    }, []);


    const handleProgramSelect = async (program, index) => {
        setProgramName(program);
        setProgramIndex(index ?? null);
        setSelectedProgramCourses(null);

        const courses = await fetchProgramData(program);
        setSelectedProgramCourses(courses);
    };

    const handleCompare = () => {
        setIsResultsModalVisible(true);  // Show CompareResultsModal
    };


    return (
        <div>
            {selectedProgramCourses ? (
                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ width: '75%', marginLeft: '50px' }}>
                        <div
                        style={{
                            marginTop: '20px',
                            marginBottom: '30px',
                            marginRight: '50px',
                            display: 'flex',
                            // Make the items seperate
                            justifyContent: 'space-between',
                        }}>
                            <ProgramSelectList onProgramChange={handleProgramSelect} />
                            <SearchbarProgram onProgramChange={handleProgramSelect} />
                        </div>
                        <ProgramDetails courses={selectedProgramCourses} programName={programName} programIndex={programIndex} />
                        <ComparisonModal
                            isVisible={compareModalVisible}
                            onClose={() => setCompareModalVisible(false)}
                            selectedCourses={selectedCourses}
                            setselectedCourses={setselectedCourses}
                            programmeData={programmeData}
                            onCompare={handleCompare}
                        />
                        <CompareResultsModal
                            isVisible={isResultsModalVisible}
                            onClose={() => setIsResultsModalVisible(false)}
                            selectedCourses={selectedCourses}
                            programmeData={programmeData}
                        />
                    </div>
                    <div style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'start', marginTop: '10%' }}>
                        <div style={{ width: '70%', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', borderRadius: '5px' }}>
                            <h1 style={{ fontWeight: 'bold', textAlign: 'justify' }}>Compare your selected programs to find the best fit for you.</h1>
                            <Button type='primary' onClick={() => setCompareModalVisible(true)} style={{ marginTop: '50px' }}>Compare Now</Button>
                        </div>
                    </div>
                </div>
            ) : <ProgramSelector onProgramSelect={handleProgramSelect} />}


        </div>
    );
}

export default Home;
