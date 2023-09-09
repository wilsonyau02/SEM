import React, { useState } from "react";
import { Form, Input, Button, Tooltip, Typography, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import forgotPasswordBg from "../../images/forgotPasswordBg.jpg";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../context/AuthProvider";

const { Title } = Typography;



function ForgotPassword() {

    const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

    const [form] = Form.useForm();

    const {passwordReset} = useAuth();

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);

        const {data, error} = await passwordReset(values.email);

        if (error){
            console.log(error);
        }

        if (data){
            message.success('Password reset link sent successfully');

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
                name="forgotPassword"
                initialValues={{}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{ padding: '0 20px', marginTop: '0px' }}
            >
                <Title level={2} className="text-center">
                    Forgot Password
                </Title>
                <p className="text-center">
                    Enter your email address and we'll send you a link to reset your
                    password.
                </p>

                <Form.Item
                    name="email"
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
                        placeholder="Enter your email"
                        suffix={
                            <Tooltip title="email@domain.com">
                                <InfoCircleOutlined
                                    style={{
                                        color: "rgba(0,0,0,.45)",
                                    }}
                                />
                            </Tooltip>
                        }
                    />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    shape="round"

                >
                    Send Reset Link
                </Button>

                <div className="text-center mt-3">
                    <a href="/login">Back to login</a>
                </div>

            </Form >
        )

    }
    return (
        <>
            {isTabletOrDesktop ?
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
                                backgroundImage: `url(${forgotPasswordBg})`,
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
                :
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

            }
        </>
    )
}

export default ForgotPassword;