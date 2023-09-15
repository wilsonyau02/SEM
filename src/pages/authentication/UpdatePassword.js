import React, { useEffect, useState } from "react";
import { Form, Input, Button, Tooltip, Typography, message, Spin } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import updatePasswordBg from "../../images/updatePasswordBg.jpg";
import { useMediaQuery } from "react-responsive";
import { storeIPAddress, supabase } from "../../supabase-client";
import { useAuth } from "../../context/AuthProvider";
import NotFound from "../result/NotFound";


const { Title } = Typography;



function UpdatePassword() {

    const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

    const [form] = Form.useForm();

    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [isSession, setIsSession] = useState(false);

    const { updatePassword } = useAuth();

    useEffect(() => {
        getEmail();
    }, []);

    async function getEmail() {
        const { data, error } = await supabase.auth.getSession();

        console.log(data);
        if (error) {
            // Handle error case
            message.error(error.error_description || error.message);
        }

        if (data.session === null) {
            setIsSession(true);
            setIsLoading(false);
        }

        if (data.session) {
            // Handle success case
            setEmail(data.session.user.email);
            setIsLoading(false);
        }
    }

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);

        const { data, error } = await updatePassword(values.password);

        if (error) {
            console.log(error);
        }
        if (data) {

            storeIPAddress("PASSWORD_UPDATED", "student");

            message.success('Password updated successfully');

            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    function FormContainer() {
        return (
            <Form
                form={form}
                name="updatePassword"
                initialValues={{
                    email: email,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{ padding: '0 20px', marginTop: '0px' }}
            >
                <Title level={2} className="text-center">
                    Update Password
                </Title>

                <Form.Item
                    name="email"
                    initialValue={email}
                    hasFeedback
                    wrapperCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message: "Please input your email!",
                        },
                        {
                            type: "email",
                            message: "Please enter a valid email address!",
                        },
                    ]}
                >
                    <Input
                        disabled
                        suffix={
                            <Tooltip title={email}>
                                <InfoCircleOutlined
                                    style={{
                                        color: "rgba(0,0,0,.45)",
                                    }}
                                />
                            </Tooltip>
                        }
                        style={{
                            background: "white",
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                        {
                            validator(_, value) {
                                if (
                                    (value.length >= 8 &&
                                        value.match(
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                                        )) ||
                                    value.length === 0
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        "The password must be at least 8 characters, one uppercase letter, one lowercase letter and one number!"
                                    )
                                );
                            },
                        },
                    ]}
                    hasFeedback
                    wrapperCol={{ span: 24 }}
                >
                    <Input.Password placeholder="Enter your new password" />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    shape="round"
                >
                    Update Password
                </Button>
            </Form>
        )

    }

    return (
        <>
            {isLoading ? (
                <Spin
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            ) : (
                <>
                    {isSession ? (
                        <NotFound backTo="login" />
                    ) : (
                        <>
                            {isTabletOrDesktop ? (
                                <div className="wrapper">
                                    <div className="container"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                        }}>
                                        <div
                                            className="bg-container forgot-password"
                                            style={{
                                                backgroundImage: `url(${updatePasswordBg})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center center',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        >
                                        </div>
                                        <div className="form-container forgot-password">
                                            <FormContainer />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="wrapper">
                                    <div className="mobile-container">
                                        <div
                                            className="form-container forgot-password-mobile"
                                            style={{
                                                width: '100%',
                                                marginTop: '30%',
                                            }}>
                                            <FormContainer
                                                mobileStyle={{
                                                    padding: '30px 50px',
                                                }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default UpdatePassword;