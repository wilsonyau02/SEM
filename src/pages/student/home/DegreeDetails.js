import { Collapse, Image } from "antd";
import { BiSolidBookBookmark, BiTimer, BiListOl, BiSolidSchool, BiSolidUpArrowCircle, BiSolidCheckSquare } from "react-icons/bi";
import { GiGraduateCap } from 'react-icons/gi'
import './programme.css';

const DegreeDetails = ({ course }) => {
    return (
        <>
            <h4 style={{ marginLeft: '20px', marginBottom: '15px', fontWeight: 'bold', fontSize: '20px', display: 'flex', alignItems: 'center' }}>
            {course.progCategory}
                <GiGraduateCap style={{marginLeft: '10px', marginTop: '5px'}}/>

            </h4>
            <Collapse ghost style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Collapse.Panel
                    header={
                        <div className="custom-header" style={{ fontWeight: 'bold' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Programme Overview
                            </span>
                        </div>
                    }
                    key="1">
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        <BiSolidBookBookmark style={{ marginRight: '10px' }} />
                        Overview
                    </span>
                    {course.overview.map((paragraph, index) => (
                        <p key={index} style={{ textAlign: 'justify', marginLeft: '50px', marginBottom: '10px' }}>
                            {paragraph}
                        </p>
                    ))}

                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        marginTop: '15px',
                        fontWeight: 'bold'
                    }}>
                        <BiTimer style={{ marginRight: '10px' }} />
                        Duration
                    </span>
                    <ul style={{
                        marginLeft: '68px',
                        marginBottom: '5px',
                        listStyleType: 'disc' // this will ensure it's shown in bullet points
                    }}>
                        {course.duration.map(durationItem => (
                            <li key={durationItem}>
                                {durationItem}
                            </li>
                        ))}
                    </ul>

                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        marginTop: '15px',
                        fontWeight: 'bold'
                    }}>
                        <BiSolidSchool style={{ marginRight: '10px' }} />
                        Campus
                    </span>
                    <ul style={{
                        marginLeft: '68px',
                        marginBottom: '5px',
                        listStyleType: 'disc' // this will ensure it's shown in bullet points
                    }}>
                        {course.campus.map(campusItem => (
                            <li key={campusItem}>
                                {campusItem}
                            </li>
                        ))}
                    </ul>

                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        marginTop: '15px',
                        fontWeight: 'bold'
                    }}>
                        <BiSolidUpArrowCircle style={{ marginRight: '10px' }} />
                        Intake
                    </span>
                    <ul style={{
                        marginLeft: '68px',
                        marginBottom: '5px',
                        listStyleType: 'disc' // this will ensure it's shown in bullet points
                    }}>
                        {course.intake.map(intakeItem => (
                            <li key={intakeItem}>
                                {intakeItem}
                            </li>
                        ))}
                    </ul>

                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        marginTop: '15px',
                        fontWeight: 'bold'
                    }}>
                        <BiSolidUpArrowCircle style={{ marginRight: '10px' }} />
                        Academic Progression
                    </span>
                    <div
                        style={{ marginLeft: '68px' }}
                    >
                        <Image
                            width={500}
                            src={course.academicProg}
                        />
                    </div>


                </Collapse.Panel>

                <Collapse.Panel
                    header={
                        <div className="custom-header" style={{ fontWeight: 'bold' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Minimum Entry Requirement
                            </span>
                        </div>
                    }
                    key="2">
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        <BiListOl style={{ marginRight: '10px' }} />
                        Minimum Requirement
                    </span>
                    <div
                        style={{ marginLeft: '68px' }}
                    >
                        <Image
                            width={600}
                            src={course.degreeEntry}
                        />
                    </div>
                </Collapse.Panel>

                <Collapse.Panel
                    header={
                        <div className="custom-header" style={{ fontWeight: 'bold' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Program Outline
                            </span>
                        </div>
                    }
                    key="3">
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        <BiSolidBookBookmark style={{ marginRight: '10px' }} />
                        Outlines
                    </span>
                    <ul style={{ marginLeft: '65px', listStyleType: 'disc' }}>
                        {course.outline.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>

                    {course.elective1 && course.elective1.length > 0 && (
                        <>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '50px',
                                marginBottom: '5px',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}>
                                Elective 1
                            </span>
                            <ul style={{ marginLeft: '65px', listStyleType: 'disc' }}>
                                {course.elective1.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {course.elective2 && course.elective2.length > 0 && (
                        <>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '50px',
                                marginBottom: '5px',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}>
                                Elective 2
                            </span>
                            <ul style={{ marginLeft: '65px', listStyleType: 'disc' }}>
                                {course.elective2.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {course.elective3 && course.elective3.length > 0 && (
                        <>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '50px',
                                marginBottom: '5px',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}>
                                Elective 3
                            </span>
                            <ul style={{ marginLeft: '65px', listStyleType: 'disc' }}>
                                {course.elective3.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {course.elective4 && course.elective4.length > 0 && (
                        <>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '50px',
                                marginBottom: '5px',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}>
                                Elective 4
                            </span>
                            <ul style={{ marginLeft: '65px', listStyleType: 'disc' }}>
                                {course.elective4.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {course.otherSub && course.otherSub.length > 0 && (
                        <>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '50px',
                                marginBottom: '5px',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}>
                                Language, Mata Pelajaran Pengajian Umum (MPU) and Co-curricular Courses
                            </span>
                            <ul style={{ marginLeft: '65px', listStyleType: 'disc' }}>
                                {course.otherSub.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </>
                    )}


                </Collapse.Panel>

                <Collapse.Panel
                    header={<div className="custom-header">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            Career Prospects
                        </span>
                    </div>}
                    key="4">
                    <ul style={{
                        marginLeft: '50px',
                        marginBottom: '5px',
                        listStyleType: 'disc' // this will ensure it's shown in bullet points
                    }}>
                        {course.careerProspects.map(careerProspect => (
                            <li key={careerProspect}>
                                {careerProspect}
                            </li>
                        ))}
                    </ul>
                </Collapse.Panel>

                <Collapse.Panel
                    header={
                        <div className="custom-header" style={{ fontWeight: 'bold' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Fees & Financial Aid
                            </span>
                        </div>
                    }
                    key="5">
                    <ul style={{
                        marginLeft: '25px',
                        marginBottom: '5px',
                    }}>
                        {course.financial.map(financial => (
                            <li key={financial} style={{ marginBottom: '10px' }}>
                                {financial}
                            </li>
                        ))}
                    </ul>
                    <p style={{ marginLeft: '25px', marginBottom: '10px' }}>
                        For more information on Fees,
                        <a href="https://www.tarc.edu.my/bursary/content.jsp?cat_id=5AA0377F-4E7F-494A-8EB4-CEF5CE4DD7AE" style={{ fontStyle: 'italic' }}> Click Here</a>.
                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px', fontWeight: 'bold' }}>
                        Merit Scholarship
                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px' }}>
                        To find out more,
                        <a href="https://www.tarc.edu.my/admissions/contentsub.jsp?cat_id=58F1E9DB-53BF-4657-8DD6-80056FEAF89F&fmenuid=" style={{ fontStyle: 'italic' }}> Click Here</a>
                        .
                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px', fontWeight: 'bold' }}>
                        Other Scholarship
                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px' }}>
                        To find out more,
                        <a href="https://www.tarc.edu.my/dsa/financial-aid/scholarships-grants/" style={{ fontStyle: 'italic' }}> Click Here</a>
                        .
                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px', fontWeight: 'bold' }}>
                        Financial Aid
                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px' }}>
                        For PTPTN,
                        <a href="https://www.tarc.edu.my/dsa/financial-aid/ptptn/" style={{ fontStyle: 'italic' }}> Click Here</a>.

                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px' }}>
                        For Study Loan,
                        <a href="https://www.tarc.edu.my/dsa/financial-aid/study-loans/"> Click Here</a>.
                    </p>
                    <p style={{ marginLeft: '25px', marginBottom: '10px' }}>
                        For more information on Financial Aid,
                        <a href="https://www.tarc.edu.my/dsa/financial-aid/financial-aid/"> Click Here</a>.
                    </p>

                </Collapse.Panel>
            </Collapse>
        </>
    );
}

export default DegreeDetails;
