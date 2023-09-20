import {
    Form,
    Input,
    Button,
    Checkbox,
    Typography,
    Select,
    Upload,
    Breadcrumb,
    Radio,
    Row,
    Col,
    Divider,
    InputNumber,
    Modal,
    message,
    Space
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    VerifiedOutlined,
    HomeOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    UploadOutlined,
    InboxOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { supabase } from "../../../supabase-client";
import { useNavigate } from "react-router-dom";
import { getCurrentDateTime } from "../../../components/timeUtils";


const { Title } = Typography;
const { Option } = Select;

const formItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

function CreateApplication() {

    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);

        console.log(academicSections)

        let isFormValid = true;
        let status = false;

        // Iterate through academicSections to check each section's validation
        academicSections.forEach((section) => {
            const { level, answers } = section;
            const questions = academicResultQuestions[level];

            if (!questions) {
                // If questions for this section are not defined, skip validation
                return;
            }

            // Check if all answers are "Yes"
            const allYes = questions.every((question) =>
                question.type === 'select' ? answers[question.label] === 'Yes' : true
            );

            // Check if CGPA is higher than 2.5 (if applicable)
            const cgpaQuestion = questions.find(
                (question) => question.label && question.label.startsWith('What is your CGPA')
            );

            if (cgpaQuestion) {
                const cgpa = parseFloat(answers[cgpaQuestion.label]);

                if (isNaN(cgpa) || cgpa <= 2.5) {
                    // If CGPA is not a valid number or lower than 2.5, set formStatus to "Fail"
                    isFormValid = false;
                }
            }

            if (!allYes) {
                // If any section fails the validation, set formStatus to "Fail"
                isFormValid = false;
            }
        });

        // Set formStatus based on the validation result
        if (isFormValid) {
            status = true;
        } else {
            status = false;
        }

        const userID = (await supabase.auth.getUser()).data.user.id;

        const currentDate = getCurrentDateTime();

        const fullAddress = `${values.address}, ${values.postcode} ${values.city}, ${values.state}`;


        //Insert data to supabase
        const { data, error } = await supabase.from("Application")
            .insert([
                {
                    name: values.name,
                    identity_number: values.identity_number,
                    gender: values.gender,
                    phone_number: values.phone_number,
                    intake: values.intake,
                    programme_level: values.programme_level,
                    programme: values.programme,
                    status: status,
                    appliedDate: currentDate,
                    studentID: userID,
                    address: fullAddress,
                }
            ])
            .select('applicationID');

        let applicationID;


        if (error) {
            console.error("Error inserting data:", error);
        } else if (data && data.length > 0) {
            // Check if data is not empty and contains the applicationID
            applicationID = data[0].applicationID;
            console.log("Application ID:", applicationID);
        } else {
            // Handle the case where data is empty or missing applicationID
            console.error("No application ID found in the response data.");
        }

        //Upload image to supabase storage
        const { data: data1, error: error1 } = await supabase.storage
            .from("Application")
            .upload(`${applicationID}/ic_photo_front`, icFront[0].originFileObj, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/png',
            });

        if (error1) {
            console.error("Error uploading data:", error1);
        }

        const { data: data2, error: error2 } = await supabase.storage
            .from("Application")
            .upload(`${applicationID}/ic_photo_back`, icBack[0].originFileObj, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/png',
            });

        if (error2) {
            console.error("Error uploading data:", error2);
        }

        //Update data to supabase
        const { data: data3, error: error3 } = await supabase.from("Application")
            .update({
                ic_photo_front: `${applicationID}/ic_photo_front`,
                ic_photo_back: `${applicationID}/ic_photo_back`,
            })
            .eq('applicationID', applicationID);

        if (error3) {
            console.error("Error updating data:", error3);
        }

        // Store certificate to supabase storage
        for (const index in academicSections) {
            if (Object.hasOwnProperty.call(academicSections, index)) {
                const { certificate } = academicSections[index];

                console.log(certificate);

                const { data: data4, error: error4 } = await supabase.storage
                    .from("Application")
                    .upload(`${applicationID}/${index}/certificate`, certificate[0].originFileObj, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: 'application/pdf',
                    });

                if (error4) {
                    console.error("Error uploading data:", error4);
                }

                // Change the url to the academicSections
                academicSections[index].certificate = `${applicationID}/${index}/certificate`;

                console.log(academicSections[index].certificate);
            }
        }

        console.log(academicSections);

        //Insert academic section to supabase
        const { data: data5, error: error5 } = await supabase.from("Application")
            .update({
                academicResult: academicSections,
            })
            .eq('applicationID', applicationID);

        if (error5) {
            console.error("Error updating data:", error5);
        }

        console.log(data5);

        message.loading('Creating application...', 1);

        setTimeout(() => {
            message.success('Application created successfully!', 2);
        }, 1000);

        setTimeout(() => {
            navigate("/student/application");
        }, 3000);
    };

    const onFinishFailed = (e) => {
        console.log("Application submit Failed:", e);
    };

    //Handle Malaysian and non Malaysian
    const [isMalaysian, setIsMalaysian] = useState(true); //variable,Function //useState(Initial value)

    const handleCheckMalaysian = () => {
        setIsMalaysian(!isMalaysian);
    };

    //Handle Address
    const [postCode, setPostCode] = useState({
        value: '',
    });

    const validatePostcode = (value) => {
        if (value.length == 0) {
            clearPropertyStateAndCity();
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter valid postcode!',
            }
        }
        else {
            form.setFieldValue('state', value[0].state.state_name);
            form.setFieldValue('city', value[0].post_office);
            return {
                validateStatus: 'success',
                errorMsg: null,
            }
        }
    }

    
    const handlePostCode = async (e) => {
        const value = e.target.value;
        const POSTCODE_REGEX = /^\d{5}$/;

        //Check if the postcode is empty
        if (value.length === 0) {
            setPostCode({
                validateStatus: 'error',
                errorMsg: 'Please enter the property postcode!',
            });
            clearPropertyStateAndCity();
            return;
        }
        //Check if the postcode is in correct format
        if (!POSTCODE_REGEX.test(value)) {
            setPostCode({
                validateStatus: 'error',
                errorMsg: 'Incorrect format!',
            });
            clearPropertyStateAndCity();
            return;
        } 
        //Check if the postcode is valid
        try {
            const { data, error } = await supabase
                .from('malaysia_postcode')
                .select('postcode, post_office, state_code, state(state_name)')
                .eq('postcode', e.target.value);
            if (error) {
                console.log(error)
                return;
            }
            const validationResult = validatePostcode(data);
            setPostCode({
                ...validationResult,
                value,
            });

            //If the postcode is valid, set the property state and city
            if (validationResult.validateStatus === 'success') {
                form.setFieldValue('state', data[0].state.state_name);
                form.setFieldValue('city', data[0].post_office);
            } else {
                clearPropertyStateAndCity();
            }
        } catch (error) {
            console.log(error)
        }
    };

    const clearPropertyStateAndCity = () => {
        form.setFieldValue('state', '');
        form.setFieldValue('city', '');
      }

    //Validation rules
    const icValidator = (rule, value) => {
        return new Promise((resolve, reject) => {
            const icRegex = /^\d{6}-\d{2}-\d{4}$/;

            if (value && !icRegex.test(value)) {
                reject("Please enter a valid IC number. Format: 021205-10-0612");
            } else {
                resolve(); // Resolve for valid or empty value
            }
        });
    };


    const phoneNumberValidator = (rule, value) => {
        return new Promise((resolve, reject) => {
            const digitRegex = /^[0-9]*$/; // Only allow numbers (0-9)
            const phoneNumberRegex = /^(?:\+?6?01)[0-46-9]-*[0-9]{7,8}$/;

            if (value) {
                if (!digitRegex.test(value)) {
                    reject("Please enter digits only for the phone number.");
                } else if (!phoneNumberRegex.test(value)) {
                    reject(
                        "Please enter a valid Malaysian phone number. Format: 011-2822 7757"
                    );
                } else {
                    resolve();
                }
            } else {
                reject();
            }
        });
    };



    //Dynamic option for course based on academic level
    const [selectedIntake, setSelectedIntake] = useState(null);
    const handleIntake = (value) => {
        setSelectedIntake(value);
    };

    const [selectedAcademicLevel, setSelectedAcademicLevel] = useState(null); //Foundation,Degree,...
    //Onchange Method
    const handleAcademicLevelChange = (value) => {
        setSelectedAcademicLevel(value);
    };

    const [selectedProgramme, setSelectedProgramme] = useState(null);

    const handleProgramme = (value) => {
        setSelectedProgramme(value);
    };

    const filteredProgrammeOptions = useMemo(() => {
        // Filter options based on the selected academic level
        if (selectedAcademicLevel === "foundation") {
            return [
                {
                    value: "Foundation in Computing (Track A)",
                    label: "Foundation in Computing (Track A)",
                },
                {
                    value: "Foundation in Computing (Track B)",
                    label: "Foundation in Computing (Track B)",
                },
            ];
        } else if (selectedAcademicLevel === "alevel") {
            return [
                { value: "A Level Science", label: "A Level Science" },
                { value: "A Level Art", label: "A Level Art" },
            ];
        } else if (selectedAcademicLevel === "diploma") {
            return [
                {
                    value: "Diploma in Computer Science",
                    label: "Diploma in Computer Science",
                },
                {
                    value: "Diploma in Information Technology",
                    label: "Diploma in Information Technology",
                },
                {
                    value: "Diploma in Information Systems",
                    label: "Diploma in Information Systems",
                },
                {
                    value: "Diploma in Software Engineering",
                    label: "Diploma in Software Engineering",
                },
            ];
        } else if (selectedAcademicLevel === "degree") {
            return [
                {
                    value:
                        "Bachelor of Science (Honours) in Management Mathematics with Computing",
                    label:
                        "Bachelor of Science (Honours) in Management Mathematics with Computing",
                },
                {
                    value:
                        "Bachelor of Computer Science (Honours) in Interactive Software Technology",
                    label:
                        "Bachelor of Computer Science (Honours) in Interactive Software Technology",
                },
                {
                    value: "Bachelor of Computer Science (Honours) in Data Science",
                    label: "Bachelor of Computer Science (Honours) in Data Science",
                },
                {
                    value:
                        "Bachelor of Information Systems (Honours) in Enterprise Information Systems",
                    label:
                        "Bachelor of Information Systems (Honours) in Enterprise Information Systems",
                },
                {
                    value:
                        "Bachelor of Information Technology (Honours) in Information Security",
                    label:
                        "Bachelor of Information Technology (Honours) in Information Security",
                },
                {
                    value:
                        "Bachelor of Information Technology (Honours) in Internet Technology",
                    label:
                        "Bachelor of Information Technology (Honours) in Internet Technology",
                },
                {
                    value:
                        "Bachelor of Information Technology (Honours) in Software Systems Development",
                    label:
                        "Bachelor of Information Technology (Honours) in Software Systems Development",
                },
                {
                    value: "Bachelor of Software Engineering (Honours)",
                    label: "Bachelor of Software Engineering (Honours)",
                },
            ];
        }

        return [];
    }, [selectedAcademicLevel]);



    const [academicSections, setAcademicSections] = useState([{ level: undefined, certificate: null, answers: {} }]);

    const handleAddSection = () => {
        setAcademicSections([...academicSections, { level: undefined, certificate: null, answers: {} }]);
    };

    const handleRemoveSection = (index) => {
        const updatedSections = [...academicSections];
        updatedSections.splice(index, 1);
        setAcademicSections(updatedSections);
    };

    const handleChangeLevel = (index, value) => {
        const updatedSections = [...academicSections];
        updatedSections[index].level = value;
        setAcademicSections(updatedSections);
    };

    const handleChangeCertificate = (index, fileList) => {
        const updatedSections = [...academicSections];
        updatedSections[index].certificate = fileList;
        setAcademicSections(updatedSections);
    };

    const handleChangeAnswer = (index, question, answer) => {
        const updatedSections = [...academicSections];
        updatedSections[index].answers[question] = answer;
        setAcademicSections(updatedSections);
    };

    const academicResultQuestions = {
        "SPM": [
            { label: 'Did you achieve a grade of C or higher in Addmath?', type: 'select', options: ['Yes', 'No'] },
            { label: 'Did you achieve a grade of C or higher in English?', type: 'select', options: ['Yes', 'No'] },
        ],
        "STPM": [
            { label: 'Did you achieve a grade of C or higher in your Mathematics subject?', type: 'select', options: ['Yes', 'No'] },
        ],
        "A-Level": [
            {
                label: 'Have you received a grade of D in at least two relevant subjects?',
                type: 'select',
                options: ['Yes', 'No'],
                additionalLabel: 'Relevant Subjects: Mathematic and ICT, English, etc',
            },
        ],
        "UEC": [
            {
                label: 'Have you obtained a grade of B or higher in at least five relevant subjects?',
                type: 'select',
                options: ['Yes', 'No'],
                additionalLabel: 'Relevant Subjects: Mathematic and ICT, English, etc',
            },
        ],
        "Foundation": [
            { label: 'What is your CGPA for the TARUMT Foundation program', type: 'input' },
        ],
        "Diploma": [
            { label: 'What is your CGPA for the TARUMT Diploma program', type: 'input' },
        ],

        "Other": [
            { label: 'What is your CGPA for other institute of higher learning?', type: 'input' },
        ],
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancel = () => setPreviewOpen(false);


    const formContainerStyle = {
        maxWidth: '800px', // Adjust the width as needed
        margin: '0 auto',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
        backgroundColor: '#fff',
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
    };

    const [form] = Form.useForm();

    const [icFront, setIcFront] = useState([]);
    const [icBack, setIcBack] = useState([]);



    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }

        const value = isJpgOrPng && isLt2M;
        return value || Upload.LIST_IGNORE;
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );


    const beforeDocumentUpload = (file) => {
        const isPdf = file.type === 'application/pdf';

        if (!isPdf) {
            message.error('You can only upload PDF files!');
        }

        const isLt10M = file.size / 1024 / 1024 < 10; // Limiting to 10MB
        if (!isLt10M) {
            message.error('Document must be smaller than 10MB!');
        }

        return isPdf && isLt10M || Upload.LIST_IGNORE;
    };



    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh', // Ensure the content takes up at least the viewport height
        }}>
            <Breadcrumb style={{ fontWeight: '500', fontSize: '1.2rem', marginBottom: '1rem', marginTop: '1rem' }}
                items={[
                    { href: '/student/application', title: 'Application' },
                    { title: 'Create Application' },
                ]}
            />

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt=""
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>

            <div style={formContainerStyle}>
                <Form
                    name="application"
                    {...formItemLayout}
                    form={form}
                    initialValues={{
                        remember: false,
                    }}
                    autoComplete="off"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Title level={2}>Application Form </Title>
                    <Title level={3}>Personal Information </Title>

                    <Form.Item
                        name="name"
                        hasFeedback
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please don't leave blank on name field.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Full Name as per IC/Passport"
                            size="large"
                            type="text"
                            allowClear="true"
                            maxLength="100"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>

                    <Form.Item name="malaysian" valuePropName="checked" noStyle>
                        <Checkbox onChange={handleCheckMalaysian}>Not a Malaysian? </Checkbox>
                    </Form.Item>

                    {isMalaysian ? (
                        <Form.Item
                            name="identity_number"
                            label="MyKad Number"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please don't leave blank on IC field.",
                                },
                                {
                                    validator: icValidator,
                                },
                            ]}
                        >
                            <Input
                                placeholder="e.g. 021205-10-0612"
                                size="large"
                                type="text"
                                allowClear="true"
                                maxLength="14"
                                prefix={<VerifiedOutlined />}
                            />
                        </Form.Item>
                    ) : (
                        <Form.Item
                            name="identity_number"
                            label="Passport Number"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please don't leave blank on passport field.",
                                },
                            ]}
                        >
                            <Input
                                placeholder=""
                                size="large"
                                type="text"
                                allowClear="true"
                                maxLength="100"
                                prefix={<VerifiedOutlined />}
                            />
                        </Form.Item>
                    )}

                    <Row>
                        <Col span={12}>


                            <Form.Item
                                name="gender"
                                label="Gender"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select an option from the dropdown.",
                                    },
                                ]}
                            >
                                <Radio.Group size="large"
                                    options={[
                                        {
                                            label: 'Male',
                                            value: 'male'
                                        },
                                        {
                                            label: 'Female',
                                            value: 'female'
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                name="phone_number"
                                label="Phone Number"
                                hasFeedback
                                labelCol={{
                                    span: 24,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please don't leave blank on phone field.",
                                    },
                                    {
                                        validator: phoneNumberValidator,
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Phone Number"
                                    size="large"
                                    type="tel"
                                    allowClear="true"
                                    prefix={<PhoneOutlined />}
                                />
                            </Form.Item>

                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Address"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Please don't leave blank on address field.",
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Address"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            allowClear={true}
                            prefix={<HomeOutlined />}
                        />
                    </Form.Item>

                    <Row>
                        <Col span={5}>
                            <Form.Item 
                                name="postcode" 
                                label="Postcode" 
                                rules={[
                                    {
                                        required: true,
                                        message: "Please don't leave blank on postcode field.",
                                    },
                                ]}
                                hasFeedback>
                                <Input
                                    placeholder="Postcode"
                                    size="large"
                                    type="text"
                                    allowClear="true"
                                    prefix={<HomeOutlined />}
                                    maxLength="5"
                                    onChange={handlePostCode}
                                    value={postCode.value}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={7} offset={1}>
                            <Form.Item name="city" label="City" hasFeedback>
                                <Input
                                    placeholder="City"
                                    size="large"
                                    type="text"
                                    allowClear="true"
                                    prefix={<HomeOutlined />}
                                    maxLength="100"
                                    disabled
                                />
                            </Form.Item>
                        </Col>

                        <Col span={10} offset={1}>
                            <Form.Item name="state" label="State" hasFeedback>
                                <Input
                                    placeholder="State"
                                    size="large"
                                    type="text"
                                    allowClear="true"
                                    prefix={<HomeOutlined />}
                                    maxLength="100"
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={3}>Academic Programme </Title>
                    <Form.Item
                        name="intake"
                        label="Intake"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Please select an option from the dropdown.",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Please select your intake"
                            style={{ width: 250 }}
                            options={[
                                { value: "OCT/NOV 2023", label: "OCT/NOV 2023" },
                                { value: "FEB 2024", label: "FEB 2024" },
                            ]}
                            onChange={handleIntake}
                        />
                    </Form.Item>

                    <Form.Item
                        name="programme_level"
                        label="Programme level"
                        hasFeedback
                        extra={
                            !selectedIntake
                                ? "Please select an intake before making this selection."
                                : null
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please select an option from the dropdown.",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Please select your programme level"
                            style={{ width: 300 }}
                            options={[
                                { value: "foundation", label: "Foundation" },
                                { value: "alevel", label: "A-Level" },
                                { value: "diploma", label: "Diploma" },
                                { value: "degree", label: "Degree" },
                            ]}
                            onChange={handleAcademicLevelChange}
                            disabled={!selectedIntake}
                        />
                    </Form.Item>

                    <Form.Item
                        name="programme"
                        label="Programme"
                        hasFeedback
                        extra={
                            !selectedAcademicLevel
                                ? "Please select an academic level before making this selection."
                                : null
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please select an option from the dropdown.",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder={"Please select your programme."}
                            style={{ width: 700 }}
                            showSearch
                            filterOption={
                                (inputValue, option) =>
                                    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                                    0 //-1 is not found
                            }
                            options={filteredProgrammeOptions} //Generate option based on the selected item
                            onChange={handleProgramme}
                            disabled={!selectedAcademicLevel}
                        />
                    </Form.Item>

                    <Title level={3}>Attach Supported Document </Title>
                    <Title level={4}>Verification</Title>

                    <Row>
                        <Col span={12}>
                            <Form.Item label="IC Photo (Front)">
                                <Form.Item
                                    name="photo_ic_front"
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 18,
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please upload your photo.",
                                        },
                                    ]}
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={icFront}
                                        onPreview={handlePreview}
                                        onChange={(e) => {
                                            setIcFront(e.fileList);
                                        }}

                                        multiple={false}
                                        beforeUpload={beforeUpload}
                                        customRequest={dummyRequest}
                                    >
                                        {icFront[0] ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item label="IC Photo (Back)">
                                <Form.Item
                                    name="photo_ic_back"
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 18,
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please upload your photo.",
                                        },
                                    ]}
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={icBack}
                                        onPreview={handlePreview}
                                        onChange={(e) => {
                                            setIcBack(e.fileList);
                                        }}
                                        multiple={false}
                                        beforeUpload={beforeUpload}
                                        customRequest={dummyRequest}
                                    >
                                        {icBack[0] ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* CHECK */}
                    <Title level={4}>Academic Result</Title>

                    {academicSections.map((section, index) => (
                        <div key={index}>
                            <Row>
                                <Col span={8}>
                                    <Form.Item label="Academic Level"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please don't leave blank on this field.",
                                            }
                                        ]}>
                                        <Select
                                            value={section.level}
                                            onChange={(value) => handleChangeLevel(index, value)}
                                            style={{ width: '100%' }}
                                            placeholder="Please select your academic level"
                                            allowClear
                                        >
                                            {/* Populate academic levels dynamically */}
                                            {Object.keys(academicResultQuestions).map((level) => (
                                                <Option key={level} value={level}>
                                                    {level}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={7} offset={2}>
                                    <Form.Item label="Upload Certificate"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please don't leave blank on this field.",
                                            }
                                        ]}
                                    >
                                        <Upload
                                            fileList={section.certificate}
                                            onChange={({ fileList }) => handleChangeCertificate(index, fileList)}
                                            beforeUpload={beforeDocumentUpload}
                                            customRequest={dummyRequest}
                                            type="text"
                                        >
                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        type="danger"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveSection(index)}
                                    />
                                </Col>
                            </Row>
                            {section.level && (
                                <div>
                                    {academicResultQuestions[section.level].map((question, qIndex) => (
                                        <Row>
                                            <Form.Item key={qIndex * 100} label={question.label}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please don't leave blank on this field.",
                                                    }
                                                ]}
                                            >
                                                {question.type === 'select' ? (
                                                    <Select
                                                        value={section.answers[question.label]}
                                                        onChange={(value) =>
                                                            handleChangeAnswer(index, question.label, value)
                                                        }
                                                    >
                                                        {question.options.map((option) => (
                                                            <Option key={option} value={option}>
                                                                {option}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        value={section.answers[question.label]}
                                                        onChange={(e) =>
                                                            handleChangeAnswer(index, question.label, e.target.value)
                                                        }
                                                    />
                                                )}
                                            </Form.Item>
                                        </Row>
                                    ))}
                                </div>
                            )}

                            <Divider />
                        </div>
                    ))}

                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAddSection}
                    >
                        Add Academic Section
                    </Button>

                    <div style={buttonContainerStyle}>
                        {/* Add the "Create New Application" button */}
                        <Button
                            type="primary"
                            shape="round"
                            icon={<PlusOutlined />}
                            size="large"
                            htmlType="submit"
                        // onClick={handleCreateNewApplication}
                        >
                            Create New Application
                        </Button>
                    </div>
                </Form>
            </div>
        </div>


    );
}

export default CreateApplication;
