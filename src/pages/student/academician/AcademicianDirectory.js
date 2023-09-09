import { Divider } from 'antd';
import React from 'react';
import StaffColumnGrid from './StaffColumn';


function AcademicianDirectory(){
    return (
        <>
            <p>
                Our Staff Directory
            </p>
            <p>
                With over years of teaching experience, we've got a well-seasoned team at the helm here at TARUMT.
            </p>
            <Divider />
            <div className = "staffColumns">

                {/* <div>
                    number of staff shown
                    Staff Shown
                </div> */}

                <br></br>
                <StaffColumnGrid/>

            </div>
        </>
        
    )
}

export default AcademicianDirectory;