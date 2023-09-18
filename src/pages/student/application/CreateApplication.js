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
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { supabase } from "../../../supabase-client";

const { Title } = Typography;

const formItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

function CreateApplication() {


    const determinePassOrFail = (value) => {
        let passed = false;

        if (value === "Yes") {
            passed = true;
        }

        return passed;
    };

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);

        // Check if all academic questions have "Yes" answers
        const allQuestionsPass = selectedAcademicResults.every((result) => {
            return academicResultQuestions[result].every((question, index) => {
                const name = `qna-${result}-${index}`;
                const value = values[name];
                return value === "Yes";
            });
        });

        // Check if the CGPA for diploma and other is higher than 2.5
        const diplomaCGPA = parseFloat(values.diplomaInput0);
        const otherCGPA = parseFloat(values.otherInput0);
        const cgpaPass = !isNaN(diplomaCGPA) && !isNaN(otherCGPA) && diplomaCGPA > 2.5 && otherCGPA > 2.5;

        // Determine the status based on conditions
        const status1 = allQuestionsPass && cgpaPass;

        console.log("STATUS:", status1);



        var status = null;
        var spmStatus = null;
        var stpmStatus = null;
        var alevelStatus = null;
        var uecStatus = null;
        var diplomaStatus = null;
        var otherStatus = null;


        if (values.spmInput0 != null) {
            spmStatus = determinePassOrFail(values.spmInput0);
        }

        if (values.stpmInput0 != null) {
            stpmStatus = determinePassOrFail(values.stpmInput0);
        }

        if (values.alevelInput0 != null) {
            alevelStatus = determinePassOrFail(values.alevelInput0);
        }

        if (values.uecInput0 != null) {
            uecStatus = determinePassOrFail(values.uecInput0);
        }

        if (values.diplomaInput0 != null) {
            const floatValue = parseFloat(values.diplomaInput0);
            if (floatValue > 2.5) {
                diplomaStatus = true;
            } else {
                diplomaStatus = false;
            }
        }

        if (values.otherInput0 != null) {
            const floatValue = parseFloat(values.otherInput0);
            if (floatValue > 2.5) {
                otherStatus = true;
            } else {
                otherStatus = false;
            }
        }

        console.log("SPM: " + spmStatus);
        console.log("STPM: " + stpmStatus);
        console.log("A-Level: " + alevelStatus);
        console.log("UEC: " + uecStatus);
        console.log("Diploma: " + diplomaStatus);
        console.log("Other: " + otherStatus);

        if (
            spmStatus === false ||
            stpmStatus === false ||
            alevelStatus === false ||
            uecStatus === false ||
            diplomaStatus === false ||
            otherStatus === false
        ) {
            status = false;
        } else {
            status = true;
        }
        console.log("STATUS" + status);

        //Insert data to supabase

        // try {
        //     const { data, error } = await supabase.from("Application").insert([
        //         {
        //             name: values.name,
        //             identity_number: values.identity_number,
        //             gender: values.gender,
        //             phone_number: values.phone_number,
        //             intake: values.intake,
        //             programme_level: values.programme_level,
        //             programme: values.programme,
        //             status: status
        //             // ic_photo_front: values.photo_ic_front,
        //             // ic_photo_back: values.photo_ic_back,
        //         },
        //     ]);
        //     if (error) {
        //         // Handle any error that occurred during the insert operation
        //         console.error("Error inserting data:", error);
        //         // You can also throw the error to be caught by an outer try-catch block
        //         throw error;
        //     }
        // } catch (error) {
        //     // Handle any error that occurred during the try block
        //     console.error("An error occurred:", error);
        //     // Handle error-specific actions or show user-friendly messages
        // }
        // alert("You have submit an application form.")

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
    const [postcodeValue, setPostcodeValue] = useState("");

    // Function to handle input changes
    const handlePostcodeChange = (e) => {
        const value = e.target.value;

        // if(value.length === 5){
        setPostcodeValue(value);
        // }
    };


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






    //Prompt out questions
    const [selectedAcademicResults, setSelectedAcademicResults] = useState([]);

    const handleAcademicResultChange = (value, key) => {
        const updatedResults = [...selectedAcademicResults];
        updatedResults[key] = value; // Store the selected academic result at the specified index
        setSelectedAcademicResults(updatedResults);
    };

    const academicResultQuestions = {
        spm: [
            { label: 'Did you achieve a grade of C or higher in Addmath?', type: 'select', options: ['Yes', 'No'] },
            { label: 'Did you achieve a grade of C or higher in English?', type: 'select', options: ['Yes', 'No'] },
        ],
        stpm: [
            { label: 'Did you achieve a grade of C or higher in your Mathematics subject?', type: 'select', options: ['Yes', 'No'] },
        ],
        alevel: [
            {
                label: 'Have you received a grade of D in at least two relevant subjects?',
                type: 'select',
                options: ['Yes', 'No'],
                additionalLabel: 'Relevant Subjects: Mathematic and ICT, English, etc',
            },
        ],
        uec: [
            {
                label: 'Have you obtained a grade of B or higher in at least five relevant subjects?',
                type: 'select',
                options: ['Yes', 'No'],
                additionalLabel: 'Relevant Subjects: Mathematic and ICT, English, etc',
            },
        ],
        diploma: [
            { label: 'What is your CGPA for the TARUMT Diploma program', type: 'input' },
        ],
        other: [
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

    const [uploadedDocuments, setUploadedDocuments] = useState([]);

    const handleDocumentsUpload = (info, key) => {

        console.log(info);
        // First, make a copy of the current state
        let newUploads = [...uploadedDocuments];

        // Check if file is being uploaded or removed and take appropriate action
        if (info.file.status === 'done') {
            newUploads[key] = info.file; // Save the uploaded file info
        } else if (info.file.status === 'removed') {
            newUploads[key] = null; // Remove the file info
        }

        // Update the state
        setUploadedDocuments(newUploads);
    };

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
                        <Col span={7}>
                            <Form.Item name="postcode" label="Postcode" hasFeedback>
                                <Input
                                    placeholder="Postcode"
                                    size="large"
                                    type="text"
                                    allowClear="true"
                                    prefix={<HomeOutlined />}
                                    maxLength="5"
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
                                />
                            </Form.Item>
                        </Col>

                        <Col span={7} offset={1}>
                            <Form.Item name="state" label="State" hasFeedback>
                                <Input
                                    placeholder="State"
                                    size="large"
                                    type="text"
                                    allowClear="true"
                                    prefix={<HomeOutlined />}
                                    maxLength="100"
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

                    <Form.List name="support_document">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key}>
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "academicLevel"]}
                                                    label="Academic Level"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please select an option from the dropdown.",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        size="large"
                                                        defaultValue="Please select your academic level."
                                                        style={{ width: 300 }}
                                                        showSearch
                                                        filterOption={
                                                            (inputValue, option) =>
                                                                option.label
                                                                    .toLowerCase()
                                                                    .indexOf(inputValue.toLowerCase()) >= 0 //-1 is not found
                                                        }
                                                        {...restField}
                                                        options={[
                                                            { value: "spm", label: "SPM" },
                                                            { value: "stpm", label: "STPM" },
                                                            { value: "alevel", label: "A Level" },
                                                            { value: "uec", label: "UEC" },
                                                            { value: "foundation", label: "TARUMT Foundation" },
                                                            { value: "diploma", label: "TARUMT DIPLOMA" },
                                                            {
                                                                value: "other",
                                                                label: "Other Institutes of Higher Learning",
                                                            },
                                                        ]}
                                                        value={selectedAcademicResults[key]}
                                                        onChange={(value) =>
                                                            handleAcademicResultChange(value, key)
                                                        } // Call the handler to update selectedAcademicResult
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={7} offset={1}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "certificate"]}
                                                    label="Certificate"
                                                    extra="Only PDF files are allowed. Maximum file size is 10MB."
                                                    rules={[{ required: true, message: "Missing Document" }]}
                                                >
                                                    <Upload
                                                        name="logo"
                                                        listType="text"
                                                        onChange={(info) => handleDocumentsUpload(info, key)}
                                                        customRequest={dummyRequest}
                                                        beforeUpload={beforeDocumentUpload}

                                                    >
                                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                            <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                                                <MinusCircleOutlined
                                                    style={{ margin: '0 8px', fontSize: '1.0rem' }}
                                                    onClick={() => {
                                                        remove(name);
                                                        const updatedResults = [...selectedAcademicResults];
                                                        updatedResults.splice(key, 1);
                                                        setSelectedAcademicResults(updatedResults);

                                                        // Also remove from uploaded documents
                                                        const newUploads = [...uploadedDocuments];
                                                        newUploads.splice(key, 1);
                                                        setUploadedDocuments(newUploads);
                                                    }}
                                                />
                                            </Col>
                                            <Divider />
                                        </Row>

                                        {/* QNA Section */}
                                        <Row>
                                            <Col span={24}>
                                                {selectedAcademicResults[key] && academicResultQuestions[selectedAcademicResults[key]].map((question, index) => {
                                                    const { label, type, options } = question;
                                                    return (
                                                        <Form.Item
                                                            key={index}
                                                            name={`qna-${name}-${index}`}
                                                            label={label}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: `Please provide an answer to ${label}`,
                                                                },
                                                            ]}
                                                        >
                                                            {type === 'select' && (
                                                                <Select placeholder={`Select for ${label}`}>
                                                                    {options.map((option, optionIndex) => (
                                                                        <Select.Option key={optionIndex} value={option}>
                                                                            {option}
                                                                        </Select.Option>
                                                                    ))}
                                                                </Select>
                                                            )}

                                                            {type === 'input' &&
                                                                <InputNumber
                                                                    placeholder={`Enter for ${label}`}
                                                                    min={0} max={4}
                                                                    style={{ width: '20%' }}
                                                                    stringMode step={0.01} />}
                                                        </Form.Item>
                                                    );
                                                })}
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Add field
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>


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
