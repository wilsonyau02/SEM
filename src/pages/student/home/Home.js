import React, { useState, useEffect } from 'react';
import { fetchProgramData, fetchProgrammeData } from '../../../supabase-client';
import { Button, Modal, Checkbox, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ProgramSelector from "./ProgramSelector";
import ProgramDetails from "./ProgramDetails";
import ProgramSelectList from './ProgramSelectList';
import SearchbarProgram from './SearchbarProgram';
import ComparisonModal from './ComparisonModal';
import CompareResultsModal from './CompareResultsModal';
import { useMediaQuery } from 'react-responsive';

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

const Home = () => {
    const [programmeData, setProgrammeData] = useState([]);
    const [selectedProgramCourses, setSelectedProgramCourses] = useState(null);
    const [programName, setProgramName] = useState(null);
    const [programIndex, setProgramIndex] = useState(null);
    const [selectedCourses, setselectedCourses] = useState([]);
    const [compareModalVisible, setCompareModalVisible] = useState(false); // just a placeholder, you might already have a state management for this
    const [isResultsModalVisible, setIsResultsModalVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });


    const handleProgramSelect = async (program, index) => {
        setProgramName(program);
        setProgramIndex(index ?? null);
        setIsLoading(true);

        const courses = await fetchProgramData(program);
        setSelectedProgramCourses(courses);
        setIsLoading(false);
    };

    useEffect(() => {
        async function fetchData() {
            const data = await fetchProgrammeData();
            setProgrammeData(data);
        }
        fetchData();
    }, []);



    const handleCompare = () => {
        setIsResultsModalVisible(true);  // Show CompareResultsModal
    };


    return (
        <div>
            {isLoading ? (
                // Display a loading spinner or any other loading UI
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin indicator={antIcon} />
                </div>

            ) : selectedProgramCourses ? (

                isTabletOrDesktop ? (
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: '75%', marginLeft: '50px' }}>
                            <div
                                style={{
                                    marginTop: '20px',
                                    marginBottom: '30px',
                                    marginRight: '50px',
                                }}>
                                <ProgramSelectList onProgramChange={handleProgramSelect} style={{ marginRight: '50px' }} />
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
                        <div style={{ width: '100%', maxWidth: '25rem', textAlign: 'center', marginTop: '5em', marginLeft: '2em' }}>
                            <div style={{
                                width: '100%',
                                maxWidth: '70%',
                                minWidth: '150px',
                                padding: '25px',
                                // margin: '0 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                                borderRadius: '5px',
                            }}>
                                <h1 style={{ fontWeight: 'bold', textAlign: 'justify' }}>Compare your selected programs to find the best fit for you.</h1>
                                <Button
                                    type='primary'
                                    onClick={() => setCompareModalVisible(true)}
                                    style={{
                                        marginTop: '30px',
                                        width: '100%', // Ensure button takes up 100% width on small screens
                                        whiteSpace: 'normal', // Allow text to wrap
                                        wordWrap: 'break-word', // Break text onto a new line if it overflows
                                        overflowWrap: 'break-word',
                                        height: 'auto', // Ensure button height is not fixed
                                    }}
                                >
                                    Compare Now
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: '75%', marginLeft: '50px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <ProgramSelectList onProgramChange={handleProgramSelect} style={{ marginTop: '20px', width: 350 }} />
                                <SearchbarProgram onProgramChange={handleProgramSelect} style={{ marginTop: '20px', width: 350 }} />
                                <Button
                                    type='primary'
                                    onClick={() => setCompareModalVisible(true)}
                                    style={{
                                        width: 350,
                                        marginTop: '20px',
                                    }}
                                >
                                    Compare Now
                                </Button>
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
                    </div>
                )
            ) : <ProgramSelector onProgramSelect={handleProgramSelect} />}


        </div >
    );
}

export default Home;
