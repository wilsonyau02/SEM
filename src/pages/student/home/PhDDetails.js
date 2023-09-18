import { Collapse } from "antd";
import { BiSolidBookBookmark, BiSolidUpArrowCircle, BiSolidSchool, BiSolidCheckSquare, BiTimer } from "react-icons/bi";
import './programme.css';

const PhDDetails = ({ course }) => {
    return (
        <>
            <Collapse ghost style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
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
                    <p style={{ marginLeft: '50px', textAlign: 'justify' }}>{course.overview}</p>

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

                </Collapse.Panel>


                <Collapse.Panel
                    header={<div className="custom-header">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            Programme Outline
                        </span>
                    </div>}
                    key="2">
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        <BiSolidCheckSquare style={{ marginRight: '10px' }} />
                        Compulsory
                    </span>
                    <ul style={{ marginLeft: '65px', listStyleType: 'disc' }}>
                        {course.outline.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </Collapse.Panel>

                <Collapse.Panel
                    header={<div className="custom-header">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            Career Prospects
                        </span>
                    </div>}
                    key="3">
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
                    header={<div className="custom-header">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            Minimum Entry Requirement
                        </span>
                    </div>}
                    key="4">
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '25px',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        <BiSolidCheckSquare style={{ marginRight: '10px' }} />
                        Minimum Entry Requirement
                    </span>
                    <ul style={{
                        marginLeft: '68px',
                        marginBottom: '5px',
                        listStyleType: 'disc' // this will ensure it's shown in bullet points
                    }}>
                        {course.minEntry.map((minEntry, index) => (
                            <li key={minEntry}>
                                {minEntry}
                                {index !== course.minEntry.length - 1 && <span style={{ fontWeight: 'bold' }}> OR</span>}
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
                        English Language Requirement
                    </span>
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '50px',
                        marginBottom: '5px',
                        marginTop: '15px',
                        fontWeight: 'bold',
                    }}>
                        Malaysian Students
                    </span>

                    <ul style={{
                        marginLeft: '68px',
                        marginBottom: '5px',
                        listStyleType: 'disc' // this will ensure it's shown in bullet points
                    }}>
                        {course.englishMas.map((englishMas, index) => (
                            <li key={englishMas}>
                                {englishMas}
                                {index !== course.englishMas.length - 1 && <span style={{ fontWeight: 'bold' }}> OR</span>}
                            </li>
                        ))}
                    </ul>

                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '50px',
                        marginBottom: '5px',
                        marginTop: '15px',
                        fontWeight: 'bold'
                    }}>
                        International Students
                    </span>

                    <ul style={{
                        marginLeft: '68px',
                        marginBottom: '5px',
                        listStyleType: 'disc' // this will ensure it's shown in bullet points
                    }}>
                        {course.englishInt.map((englishInt, index) => (
                            <li key={englishInt}>
                                {englishInt}
                                {index !== course.englishInt.length - 1 && <span style={{ fontWeight: 'bold' }}> OR</span>}
                            </li>
                        ))}
                    </ul>

                </Collapse.Panel>
            </Collapse>
        </>
    );
}

export default PhDDetails;
