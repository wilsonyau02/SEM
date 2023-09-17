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
// import {
//   getCities,
//   getPostcodes,
//   getStates,
//   allPostcodes,
//   findPostcode,
// } from "malaysia-postcodes";
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

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    //Insert data to supabase

    try {
      const { data, error } = await supabase.from("Application").insert([
        {
          name: values.name,
          gender: values.gender,
          phone_number: values.phone_number,
          intake: values.intake,
          programme_level: values.programme_level,
          programme: values.programme,
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
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Application submit Failed:", errorInfo);
  };

  //Validation rules
  const phoneNumberValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
      const digitRegex = /^[0-9]*$/; // Only allow numbers (0-9)
      const phoneNumberRegex = /^(?:\+?6?01)[0-46-9]-*[0-9]{7,8}$/;

      if (value) {
        if (!digitRegex.test(value)) {
          reject("Please enter digits only for the phone number.");
        } else if (!phoneNumberRegex.test(value)) {
          reject("Please enter a valid Malaysian phone number.");
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
  const [selectedAcademicResult, setSelectedAcademicResult] = useState([]); //Foundation,Degree,...

  //Onchange Method
  // const handleAcademicResultChange = (value, fieldName) => {
  //   setSelectedAcademicResult(prevLevels) =>{

  //   }
  //   setSelectedAcademicResultByIndex(prevState => ({
  //     ...prevState,
  //     [fieldName]: value
  //   }));
  // };

  // const handleAcademicResultChange = (value) => {
  //   setSelectedAcademicResult(value);
  // }

  const handleAcademicResultChange = (value, index) => {
    setSelectedAcademicResult((prevLevels) => {
      const updatedLevels = [...prevLevels];
      updatedLevels[index] = value;
      return updatedLevels;
    });
  };

  const addSelect = () => {
    setSelectedAcademicResult((prevLevels) => [...prevLevels, null]);
  };

  const removeSelect = (index) => {
    setSelectedAcademicResult((prevLevels) => {
      const updatedLevels = [...prevLevels];
      updatedLevels.splice(index, 1);
      return updatedLevels;
    });
  };

  //Get Image files
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
            defaultValue="Please select your gender"
            style={{ width: 250 }}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "not_prefer_to_say", label: "Not Prefer to say" },
            ]}
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
            defaultValue="Please select your intake"
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
            defaultValue="Please select your programme level"
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
            defaultValue={"Please select your programme."}
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
                      // onChange={(value)=> handleAcademicResultChange(value,key)}
                      value={selectedAcademicResult}
                      onChange={handleAcademicResultChange}
                      // onChange={
                      //   // setSelectedAcademicResult(value);

                      //   // handleAcademicResultChange(value,name)
                      // }
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "certificate"]}
                    label="Certificate"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra="PDF or Image are acceptable"
                    rules={[{ required: true, message: "Missing last name" }]}
                  >
                    <Upload name="logo" action="/upload.do" listType="picture">
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
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

        {selectedAcademicResult === "spm" && (
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
        )}

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
