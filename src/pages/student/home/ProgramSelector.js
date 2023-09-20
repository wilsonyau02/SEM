import React, { useState } from 'react';
import { Card, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchProgramData } from '../../../supabase-client';
import background1 from '../../../images/ProgBackground.jpg';
import background2 from '../../../images/ProgBackground2.jpeg';

const ProgramSelector = ({ onProgramSelect }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleProgramCardClick = (program) => {
        setIsLoading(true);
        onProgramSelect(program); // Just call the callback now, fetching is moved to parent
        setIsLoading(false);
    };

    const showCourses = (program) => {
        onProgramSelect(program);
    };


    const parentContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Use the full viewport width
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${background1}), url(${background2})`,
        backgroundSize: '50% 100%, 50% 100%', // Each image takes up 50% of the width and 100% of the height
        backgroundPosition: 'left center, right center',
        backgroundRepeat: 'no-repeat, no-repeat', // Ensure the images don't repeat
        height: '350px',
        width: '80%',
        margin: '20px 0'
    };

    const cardContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap', // This ensures that if there's not enough space, the cards will wrap to the next line.
    };

    const cardStyle = {
        width: 240,
        height: '125px',  // This will adjust based on the content
        maxHeight: '300px',  // Adjust this based on your requirement
        margin: '10px'
    };

    const ProgramCard = ({ title, description, onClick }) => (
        <Card onClick={onClick} hoverable style={cardStyle}>
            <Card.Meta title={title} description={description} />
        </Card>
    );

    const titleContainerStyle = {
        fontFamily: "Century Gothic",
        fontSize: '18px',
        color: '#000080',
        textAlign: 'center',
        padding: '10px 5em'
    };

    const texStyle = {
        fontWeight: "bold",
        fontSize: '30px'
    };

    return (
        <>
            <div style={titleContainerStyle} className="academicianContainer">
                <p style={texStyle}>
                    Our Programmes
                </p>
                <p>
                    Explore our diverse range of programs designed to meet your educational needs. At TARUMT,
                    we take pride in delivering high-quality educational experiences to help you achieve your goals.
                </p>
            </div>
            <div style={parentContainerStyle}>
                <div style={containerStyle}></div>
            </div>
            <div style={cardContainerStyle}>
                <ProgramCard title="Doctor of Philosophy" description="Learn about our PhD programs" onClick={() => showCourses("Doctor of Philosophy")} />
                <ProgramCard title="Master Degree" description="Explore our Master's programs" onClick={() => showCourses("Master Degree")} />
                <ProgramCard title="Bachelor" description="Discover our Bachelor's degrees" onClick={() => showCourses("Bachelor")} />
                <ProgramCard title="Diploma" description="Check out our Diploma courses" onClick={() => showCourses("Diploma")} />
            </div>
            {isLoading && <div>Loading courses...</div>}
        </>
    );
}

export default ProgramSelector;