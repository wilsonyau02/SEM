import { useMediaQuery } from 'react-responsive';
import './auth.css';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import loginBg from '../../images/loginBg.jpg'
import { useAuth } from '../../context/AuthProvider';

const { Title } = Typography;

function Login() {


    const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

    const [form] = Form.useForm();

    const { login, user } = useAuth();

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);

        const {
            data: { user, session },
            error
        } = await login(values.email, values.password);
        
        if (error) {
            message.error(error.error_description || error.message);
        }

        if (user && session){

            message.success('Login successful');

            if (user.user_metadata.userType === 'student'){
                setTimeout(() => {
                    window.location.href = '/student';
                }, 1000);
            } else {
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1000);
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    function FormContainer() {
        return (
            <Form
                name="signin"
                form={form}
                initialValues={{
                    remember: false,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Title level={2} className="text-center">
                    Sign in
                </Title>

                <Form.Item
                    name="email"
                    hasFeedback
                    label="Email address"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
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

                <Form.Item
                    name="password"
                    hasFeedback
                    label="Password"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
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

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="/forgot-password">
                        Forgot password?
                    </a>
                </Form.Item>

                <Button
                    // loading={auth.loading}
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    icon={<LoginOutlined />}
                    size="large"
                >
                    Sign In
                </Button>

                <div className="text-center mt-3">
                    <span>Don't have an account?</span>
                    <a href="/signup"> Sign Up</a>
                </div>
            </Form>
        )
    }


    return (
        <>
            {isTabletOrDesktop ? (
                <div className="wrapper">
                    <div className="container">
                        <div className="form-container login">
                            <FormContainer />
                        </div>

                        <div
                            className="bg-container login"
                            style={{
                                backgroundImage: `url(${loginBg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >

                        </div>
                    </div>
                </div>
            )
                : (
                    <div className="wrapper">
                        <div className="mobile-container">
                            <div className="form-container" style={{ width: '100%' }}>
                                <FormContainer />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}



export default Login;