import { Button, Descriptions, Divider, Modal, Popconfirm, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";

function ApplicationModal({ isModalOpen, onChangeModal, applicationID, handleTrigger }) {

    console.log("In modal", applicationID);

    const [applicationData, setApplicationData] = useState(null);

    useEffect(() => {
        if (applicationID)
            fetchData();
    }, [applicationID]);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('Application')
            .select('*, studentID(*)')
            .eq('applicationID', applicationID)
            .single()

        if (error) console.log('error', error)

        console.log("data", data);

        setApplicationData(data);
    }

    const getUrl = (certificate) => {
        const { data, error } = supabase.storage
            .from('Application')
            .getPublicUrl(certificate)

        if (error) console.log('error', error)
        return data.publicUrl;

    }

    const descriptionLabelStyle = {
        fontWeight: "bold",
        width: "20%",
    }

    const [messageApi, contextHolder] = message.useMessage();

    const approveApplication = async () => {
        const { data, error } = await supabase
            .from('Application')
            .update({ status: true })
            .eq('applicationID', applicationID)

        if (error) {
            console.log('error', error)
            messageApi.error("Failed to approve application");
        } else {
            messageApi.success("Application approved successfully");
            onChangeModal(false);
            handleTrigger();
        }
    }

    const rejectApplication = async () => {
        const { data, error } = await supabase
            .from('Application')
            .update({ status: false })
            .eq('applicationID', applicationID)

        if (error) {
            console.log('error', error)
            messageApi.error("Failed to reject application");
        } else {
            messageApi.success("Application rejected successfully");
            onChangeModal(false);
            handleTrigger();
        }
    }

    const modalFooterBtnStyle = {
        width: "100px",
        marginRight: "10px"
    }


    return (
        <>
            {applicationData &&
                <Modal
                    open={isModalOpen}
                    onOk={() => onChangeModal(false)}
                    onCancel={() => onChangeModal(false)}
                    width={1000}
                    footer={
                        <>
                            <Button
                                style={modalFooterBtnStyle}
                                onClick={() => {
                                    onChangeModal(false)
                                }}>Cancel</Button>

                            {applicationData.status ?
                                <Popconfirm
                                    title="Are you sure you want to reject this application?"
                                    onConfirm={() => {
                                        rejectApplication();
                                    }}
                                >
                                    {contextHolder}
                                    <Button className="viewButton" style={modalFooterBtnStyle} type="primary">
                                        Reject
                                    </Button>
                                </Popconfirm>
                                :
                                <Popconfirm
                                    title="Are you sure you want to approve this application?"
                                    onConfirm={() => {
                                        approveApplication();
                                    }}
                                >
                                    {contextHolder}
                                    <Button className="viewButton" style={modalFooterBtnStyle} type="primary">
                                        Approve
                                    </Button>
                                </Popconfirm>
                            }
                        </>
                    }
                >
                    <Typography.Title level={3}>Application Details</Typography.Title>

                    <Descriptions title="Personal Information" bordered labelStyle={descriptionLabelStyle}>
                        <Descriptions.Item label="Name" span={2}>{applicationData.name}</Descriptions.Item>
                        <Descriptions.Item label="Gender" span={1}>{applicationData.gender}</Descriptions.Item>
                        <Descriptions.Item label="Identity Number" span={2}>{applicationData.identity_number}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number" span={1}>{applicationData.phone_number}</Descriptions.Item>
                        <Descriptions.Item label="Email" span={3}>{applicationData.studentID.email}</Descriptions.Item>
                        <Descriptions.Item label="Address" span={3}>{applicationData.address}</Descriptions.Item>
                    </Descriptions>


                    <Divider />

                    <Descriptions title="Programme Details" bordered labelStyle={descriptionLabelStyle}>
                        <Descriptions.Item label="Intake" span={1}>{applicationData.intake}</Descriptions.Item>
                        <Descriptions.Item label="Programme Level" span={2}>{applicationData.programme_level}</Descriptions.Item>
                        <Descriptions.Item label="Programme" span={3}>{applicationData.programme}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {applicationData.academicResult && applicationData.academicResult.map((result, index) => (
                        <Descriptions title={`Academic Details ${index + 1}`} bordered key={index} labelStyle={descriptionLabelStyle} style={{ marginBottom: 20 }} >
                            <Descriptions.Item label="Level" span={2}>
                                {result.level}
                            </Descriptions.Item>
                            <Descriptions.Item label="Certificate" span={1}>
                                <a
                                    href={getUrl(result.certificate)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "underline", color: "blue" }}
                                >
                                    View Certificate
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label="Questions & Answers" span={3}>
                                {Object.entries(result.answers).map(([question, answer]) => (
                                    <div key={question}>
                                        {question}: <strong>{answer}</strong>
                                    </div>
                                ))}
                            </Descriptions.Item>
                        </Descriptions>
                    ))}
                    <Divider />

                    <Descriptions title="Other Details" bordered labelStyle={descriptionLabelStyle} style={{ marginBottom: 20 }} >
                        <Descriptions.Item label="Application Status">
                            {applicationData.status ?
                                <Tag color="green">Pass</Tag> :
                                <Tag color="red">Fail</Tag>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Applied Date">{applicationData.appliedDate}</Descriptions.Item>
                    </Descriptions>
                </Modal>}
        </>
    )
}

export default ApplicationModal;