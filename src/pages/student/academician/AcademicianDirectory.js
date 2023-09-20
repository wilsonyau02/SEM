import { Divider } from 'antd';
import React from 'react';
import './aca.css';
import StaffColumnGrid from './StaffColumn';


function AcademicianDirectory() {
    const containerStyle = {
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
            <div style={containerStyle} className="academicianContainer">
                <p style={texStyle}>
                    Our Staff Directory
                </p>
                <p>
                    Explore our diverse range of programs designed to meet your educational needs. At TARUMT, we take pride in delivering high-quality educational experiences to help you achieve your goals.
                </p>
            </div>

            <Divider />
            <div>

                <StaffColumnGrid />

            </div>
        </>

    )
}

export default AcademicianDirectory;