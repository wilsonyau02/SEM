import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Select,
  Space,
  Upload,
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
  DownloadOutlined,
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import {
  getCities,
  getPostcodes,
  getStates,
  allPostcodes,
  findPostcode,
} from "malaysia-postcodes";
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

function Application() {
  const [form] = Form.useForm();

  const determinePassOrFail = (value) => {
    let passed = false;

    if (value === "Y" || value === "y") {
      passed = true;
    }

    return passed;
  };

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    //Valid whether it is approve or reject

    // if(values.stpmInput0 == null){
    //   console.log("THIS IS NULL")
    // }

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

    try {
      const { data, error } = await supabase.from("Application").insert([
        {
          name: values.name,
          identity_number: values.identity_number,
          gender: values.gender,
          phone_number: values.phone_number,
          intake: values.intake,
          programme_level: values.programme_level,
          programme: values.programme,
          status: status
          // ic_photo_front: values.photo_ic_front,
          // ic_photo_back: values.photo_ic_back,
        },
      ]);
      if (error) {
        // Handle any error that occurred during the insert operation
        console.error("Error inserting data:", error);
        // You can also throw the error to be caught by an outer try-catch block
        throw error;
      }
    } catch (error) {
      // Handle any error that occurred during the try block
      console.error("An error occurred:", error);
      // Handle error-specific actions or show user-friendly messages
    }
    alert("You have submit an application form.")

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Application submit Failed:", errorInfo);
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

  const locationExact = findPostcode(postcodeValue);

  console.log(locationExact);

  //Validation rules
  const icValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
      const icRegex = /^\d{6}-\d{2}-\d{4}$/;

      if (value) {
        if (!icRegex.test(value)) {
          reject("Please enter a valid Ic number. Format: 021205-10-0612");
        }
      } else {
        reject();
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
  
  const cgpaValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
      if(value){
        const cgpa = parseFloat(value);
        if (!isNaN(cgpa) && cgpa >= 0 && cgpa <= 4) {
          resolve(); // Valid CGPA within the range 0-4
        } else {
          reject('Please enter a valid CGPA between 0.0 and 4.0');
        }
      }
    });
  };

  const ynValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
      if(value){
        if (value === 'Y' || value === 'N' || value === 'y' || value === 'n' ) {
          resolve(); // Valid input, either 'Y' or 'N'
        } else {
          reject('Please enter either "Y" or "N"');
        }
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
    // form.setFieldsValue({
    //     programme: null
    // });
    // setSelectedProgramme(null);
    setSelectedAcademicLevel(value);
  };

  const [selectedProgramme, setSelectedProgramme] = useState(null);
  //Onchange Method
  const handleProgramme = (value) => {
    // if(form.getFieldValue.programme == null) {
    //     setSelectedProgramme("Please select")
    // }
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
  const [selectedAcademicResult, setSelectedAcademicResult] = useState([]);

  //Onchange Method
  // const handleAcademicResultChange = (value, fieldName) => {
  //   setSelectedAcademicResult(prevLevels) =>{

  //   }
  //   setSelectedAcademicResultByIndex(prevState => ({
  //     ...prevState,
  //     [fieldName]: value
  //   }));
  // };

  const handleAcademicResultChange = (value, key) => {
    const updatedResults = [...selectedAcademicResult];
    updatedResults[key] = value; // Store the selected academic result at the specified index
    setSelectedAcademicResult(updatedResults);
  };

  // const handleAcademicResultChange = (value, index) => {
  //   setSelectedAcademicResult((prevLevels) => {
  //     const updatedLevels = [...prevLevels];
  //     updatedLevels[index] = value;
  //     return updatedLevels;
  //   });
  // };

  // const addSelect = () => {
  //   setSelectedAcademicResult((prevLevels) => [...prevLevels, null]);
  // };

  // const removeSelect = (index) => {
  //   setSelectedAcademicResult((prevLevels) => {
  //     const updatedLevels = [...prevLevels];
  //     updatedLevels.splice(index, 1);
  //     return updatedLevels;
  //   });
  // };

  //Get Image files
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const additionalQuestions = {
    spm: [
      {
        label:
          "Q)  Did you receive a grade of C for Additional Mathematics and English in your SPM examination? ",
        placeholder: "Y or N",
        validationMessage:
          "Please complete the question related to SPM; Don't leave it blank",
          maxLength: 1,
          type: "text",
          validator: ynValidator
      },
      // Add more questions for SPM here
    ],
    stpm: [
      {
        label:
          "Q) Did you receive a grade of C for Mathematics in your STPM examination? ",
        placeholder: "Y or N",
        validationMessage:
          "Please complete the question related to STPM; Don't leave it blank",
          maxLength: 1,
          type: "text",
          validator: ynValidator
      },
      // Add more questions for STPM here
    ],
    // Add more selected results and their corresponding questions here
    alevel: [
      {
        label:
          "Q) Did you receive a grade of D for 2 relevant subjects, such as Mathematics, ICT, English, etc., at A-levels?",
        placeholder: "Y or N",
        validationMessage:
          "Please complete the question related to A Level; Don't leave it blank",
          maxLength: 1,
          type: "text",
          validator: ynValidator
      },
    ],
    uec: [
      {
        label:
          "Q) Did you receive a grade of B for 5 Relevant subjects,such as Mathematic and ICT, English, etc., at UEC?",
        placeholder: "Y or N",
        validationMessage:
          "Please complete the question related to UEC; Don't leave it blanks",
          maxLength: 1,
          type: "text",
          validator: ynValidator
      },
    ],
    foundation: [
      {
        label: "Q) What is your CGPA for your TARUMT Foundation? ",
        placeholder: "Please provide your response. (Sample Format: 3.5)",
        validationMessage:
          "Please complete the question related to TARUMT Foundation; Don't leave it blanks",
          maxLength: 3,
          type: "number",
          validator: cgpaValidator
      },
    ],
    diploma: [
      {
        label: "Q) What is your CGPA for your TARUMT diploma? ",
        placeholder: "Please provide your response. (Sample Format: 3.5)",
        validationMessage:
          "Please complete the question related to TARUMT Diploma; Don't leave it blanks",
          maxLength: 3,
          type: "number",
          validator: cgpaValidator
      },
    ],
    other: [
      {
        label: "Q) What is your CGPA for other Institutes of Higher Learning? ",
        placeholder: "Please provide your response. (Sample Format: 3.5)",
        validationMessage:
          "Please complete the question related to other institutes of Higher Learning; Don't leave it blanks",
          maxLength: 3,
          type: "number",
          validator: cgpaValidator
      },
    ],
  };

  function FormContainer() {
    return (
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
        <Title level={1}>Application Form </Title>
        <Title level={2}>Personal Information </Title>

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
            placeholder="Name"
            size="large"
            type="text"
            allowClear="true"
            maxLength="100"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item name="malaysian" valuePropName="checked" noStyle>
          <Checkbox onChange={handleCheckMalaysian}>not a malaysian? </Checkbox>
        </Form.Item>

        {isMalaysian ? (
          <Form.Item
            name="identity_number"
            label="Identity Number"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please don't leave blank on identity number field.",
              },
              {
                validator: icValidator,
              },
            ]}
          >
            <Input
              placeholder="020228-10-1234"
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
          <Select
            size="large"
            style={{ width: 250 }}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "not_prefer_to_say", label: "Not Prefer to say" },
            ]}
            placeholder="Please select your gender"
          />
        </Form.Item>

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

        <Form.Item
          name={["address", "line1"]}
          label="Address (No need include city,State,postcode)"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please don't leave blank on address Line 1.",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter the full address"
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear={true}
            prefix={<HomeOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Input
            placeholder="Postcode"
            size="large"
            type="text"
            allowClear="true"
            style={{ width: 250 }}
            prefix={<HomeOutlined />}
            maxLength="5"
            // value={postcodeValue}
            // onChange={handlePostcodeChange}
          />
        </Form.Item>

        {/*
          <br></br>

           */}

        {/* Selangor->Kajang-> 43000 */}

        <Title level={2}>Academic Programme </Title>
        <Form.Item
          name="intake"
          label="Intake"
          hasFeedback
          showSearch
          filterOption={
            (inputValue, option) =>
              option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 //-1 is not found
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
            placeholder="Please select your intake"
            style={{ width: 250 }}
            showSearch
            filterOption={
              (inputValue, option) =>
                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                0 //-1 is not found
            }
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
          showSearch
          extra={
            !selectedIntake
              ? "Please select an intake before making this selection."
              : null
          }
          filterOption={
            (inputValue, option) =>
              option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 //-1 is not found
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
            showSearch
            filterOption={
              (inputValue, option) =>
                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                0 //-1 is not found
            }
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

        <Title level={2}>Attach Supported Document </Title>
        <Title level={3}>Verification</Title>

        <Form.Item label="IC Photo (Front)">
          <Form.Item
            name="photo_ic_front"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 10,
            }}
            rules={[
              {
                required: true,
                message: "Please upload your photo.",
              },
            ]}
            hasFeedback
          >
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        <Form.Item label="IC Photo (Back)">
          <Form.Item
            name="photo_ic_back"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 10,
            }}
            rules={[
              {
                required: true,
                message: "Please upload your photo.",
              },
            ]}
            hasFeedback
          >
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        {/* CHECK */}
        <Title level={3}>Academic Result</Title>

        <Form.List name="support_document">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "academicLevel"]}
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
                      style={{ width: 700 }}
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
                      value={selectedAcademicResult[key]}
                      onChange={(value) =>
                        handleAcademicResultChange(value, key)
                      } // Call the handler to update selectedAcademicResult
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "certificate"]}
                    label="Certificate"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra="PDF or Image are acceptable"
                    rules={[{ required: true, message: "Missing Document" }]}
                  >
                    <Upload name="logo" action="/upload.do" listType="picture">
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => {
                      remove(name);
                      handleAcademicResultChange(null, key);
                      // setSelectedAcademicResult([])
                    }}
                  />
                </Space>
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

        <Title level={2}>QNA</Title>

        {selectedAcademicResult.map(
          (selectedResult, index) =>
            additionalQuestions[selectedResult] &&
            additionalQuestions[selectedResult].map((question, subIndex) => (
              <Form.Item
                key={index * 100 + subIndex} // Ensure a unique key
                name={`${selectedResult.toLowerCase()}Input${subIndex}`}
                label={question.label}
                rules={[
                  {
                    required: true,
                    message: question.validationMessage,
                  },
                  {
                    validator: question.validator
                  }
                ]}
              >
                <Input placeholder={question.placeholder} maxLength={question.maxLength} type={question.type}/>
              </Form.Item>
            ))
        )}

        {/* {selectedAcademicResult === "spm" && (
          <Form.Item
            name="spmInput"
            label="Additional Input for SPM"
            rules={[
              {
                required: true,
                message: "Please enter additional information for STPM",
              },
            ]}
          >
            <Input placeholder="Additional information for SPM" />
          </Form.Item>
        )}


        {selectedAcademicResult === "stpm" && (
          <Form.Item
            name="stpmInput"
            label="Additional Input for STPM"
            rules={[
              {
                required: true,
                message: "Please enter additional information for STPM",
              },
            ]}
          >
            <Input placeholder="Additional information for STPM" />
          </Form.Item>
        )} */}

        <Button
          type="primary"
          shape="oval"
          icon={<DownloadOutlined />}
          size="large"
          htmlType="submit"
        />
      </Form>
    );
  }

  return (
    <div>
      <FormContainer />
    </div>
  );
}

export default Application;
