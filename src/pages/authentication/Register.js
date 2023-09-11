import { useMediaQuery } from 'react-responsive';
import { Form, Input, Button, Checkbox, Typography, Row, Col, message } from 'antd';
import registerBg from '../../images/registerBg.jpg'
import { UserAddOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { supabase } from '../../supabase-client';
import { getCurrentDateTime } from '../../components/timeUtils';


const { Title } = Typography;

function Register() {


    const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

    const [form] = Form.useForm();
    const [checked, setChecked] = useState(false);

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);

        let isEmailExist = false;

        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    userType: 'student',
                }
            }
        })

        if (error) {
            console.log(error);
        }

        isEmailExist = data.user && data.user.identities?.length === 0;
        if (isEmailExist) {
            message.error("Email already exist");
            return;
        } else {

            storeIPAddress("SIGNED_UP");

            message.success("Please check your email to verify your account");

            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);

        }
    };
    async function storeIPAddress(event) {
        try {
            const userID = (await supabase.auth.getUser()).data.user.id;
            const currentDateTime = getCurrentDateTime();
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            const ip = data.ip;

            const { error } = await supabase.from("activity_log").insert([
                {
                    ip_address: ip,
                    event_name: event,
                    time: currentDateTime,
                    userID: userID, // Assuming you want to associate this with a user
                },
            ]);
            if (error) {
                console.log("Error storing IP address:", error);
            }
        } catch (error) {
            console.error("Error storing IP address:", error);
        }
    }


    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const validation = (rule, value, callback) => {
        if (checked) {
            return callback();
        }
        return callback("Please agree Terms of Use & Privacy policy");
    };

    const onCheckboxChange = (e) => {
        setChecked(e.target.checked);
    };

    function FormContainer({ mobileStyle }) {
        return (
            <Form
                name="signup"
                initialValues={{}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
                style={mobileStyle}
            >
                <Title level={2} className="text-center">
                    Create Account
                </Title>

                <Row gutter={{ xs: 8, sm: 16 }}>
                    <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
                        <Form.Item
                            hasFeedback
                            name="firstName"
                            label="First name"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your first name.",
                                },
                                {
                                    min: 2,
                                    message: "Your first name must be at least 2 characters.",
                                },
                            ]}
                        >
                            <Input placeholder="First name" size="large" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
                        <Form.Item
                            hasFeedback
                            name="lastName"
                            label="Last name"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your last name.",
                                },
                                {
                                    min: 2,
                                    message: "Your last name must be at least 2 characters.",
                                },
                            ]}
                        >
                            <Input placeholder="Last name" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="email"
                    label="Email address"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please input your email.",
                        },
                        {
                            type: "email",
                            message: "Your email is invalid.",
                        },
                    ]}
                >
                    <Input placeholder="Email" size="large" />
                </Form.Item>

                <Row gutter={{ xs: 8, sm: 16 }}>
                    <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
                        <Form.Item
                            name="password"
                            label="Password"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password.",
                                },
                                { min: 6, message: "Password must be minimum 6 characters." },
                            ]}
                        >
                            <Input.Password placeholder="Password" size="large" />
                        </Form.Item>
                    </Col>

                    <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Confirm your password.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "The two passwords that you entered do not match!"
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm password" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="agree"
                    valuePropName="checked"
                    noStyle
                    rules={[{ validator: validation }]}
                >
                    <Checkbox checked={checked} onChange={onCheckboxChange}>
                        I agree to <a href="#">Terms of Use & Privacy policy</a>.
                    </Checkbox>
                </Form.Item>

                <Button
                    type="primary"
                    // loading={loading}
                    className="form-submit-btn"
                    htmlType="submit"
                    shape="round"
                    icon={<UserAddOutlined />}
                    size="large"
                    style={{ marginTop: '2rem' }}
                >
                    Sign Up
                </Button>

                <div className="text-center mt-3">
                    <span>Already have an account?</span>
                    <a href="/login"> Sign In</a>
                </div>
            </Form>
        )
    }


    return (
        <>
            {isTabletOrDesktop ? (
                <div className="wrapper">
                    <div className="container">
                        <div
                            className="bg-container register"
                            style={{
                                backgroundImage: `url(${registerBg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                        </div>
                        <div className="form-container register">
                            <FormContainer />
                        </div>
                    </div>
                </div>
            )
                : (
                    <div className="wrapper">
                        <div className="mobile-container">
                            <div
                                className="form-container register-mobile"
                                style={{
                                    width: '100%',
                                }}>
                                <FormContainer
                                    mobileStyle={{
                                        padding: '30px 50px',
                                    }} />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}



export default Register;