import React, { useState } from 'react';
import { Form, Input, Select, Upload, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

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

const Testing = () => {
  const [academicSections, setAcademicSections] = useState([{ level: '', certificate: null, answers: {} }]);

  const handleAddSection = () => {
    setAcademicSections([...academicSections, { level: '', certificate: null, answers: {} }]);
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

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log(academicSections);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [form] = Form.useForm();

  return (
    <Form onFinish={onFinish} layout="vertical" onFinishFailed={onFinishFailed} form={form}>
      {academicSections.map((section, index) => (
        <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
          <Form.Item label="Academic Level">
            <Select
              value={section.level}
              onChange={(value) => handleChangeLevel(index, value)}
              style={{ width: 200 }}
            >
              {/* Populate academic levels dynamically */}
              {Object.keys(academicResultQuestions).map((level) => (
                <Option key={level} value={level}>
                  {level}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Upload Certificate">
            <Upload
              fileList={section.certificate}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={({ fileList }) => handleChangeCertificate(index, fileList)}
            >
              <Button icon={<PlusOutlined />} />
            </Upload>
          </Form.Item>

          {section.level && (
            <div>
              {academicResultQuestions[section.level].map((question, qIndex) => (
                <Form.Item
                  key={qIndex}
                  label={question.label}
                >
                  {question.type === 'select' ? (
                    <Select
                      value={section.answers[question.label]}
                      onChange={(value) => handleChangeAnswer(index, question.label, value)}
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
                      onChange={(e) => handleChangeAnswer(index, question.label, e.target.value)}
                    />
                  )}
                </Form.Item>
              ))}
            </div>
          )}

          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveSection(index)}
          />
        </Space>
      ))}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddSection}
      >
        Add Academic Section
      </Button>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Testing;
