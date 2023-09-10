import { Divider } from 'antd';
import React from 'react';
import './aca.css';
import StaffColumnGrid from './StaffColumn';


function AcademicianDirectory(){
    const containerStyle = {
        fontFamily: "Century Gothic",
        fontSize: '18px',
        color: '#000080',
        padding: 10,
        textAlign: 'center',
      };

      const texStyle = {
        fontWeight: "bold", 
        fontSize: '30px'
      };


    return (
        <>
        <div style={containerStyle}>
            <p style= {texStyle}>
                Our Staff Directory
            </p>
            <p>
                With over years of teaching experience, we've got a well-seasoned team at the helm here at TARUMT.
            </p>
        </div>
           
            <Divider />
            <div className = "staffColumns">

            <StaffColumnGrid/>

            </div>
        </>
        
    )
}

export default AcademicianDirectory;