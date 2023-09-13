import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";

const FaqChatDialog = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [greetingDisplayed, setGreetingDisplayed] = useState(false);
  const [currentStep, setCurrentStep] = useState("initial");
  const [showOptions, setShowOptions] = useState(true);
  const [currentSection, setCurrentSection] = useState(""); // Added currentSection state
  const chatContainerRef = useRef(null);

  const programmesResponses = {
    1: (
      <div>
        <p>
          The Bachelor Degree and Diploma programmes offered can be found{" "}
          <a
            href="https://www.tarc.edu.my/admissions/programmes/programme-offered-a-z/undergraduate-programme/"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
        <br />
        <p>
          The Foundation programmes offered can be found{" "}
          <a
            href="https://www.tarc.edu.my/admissions/programmes/programme-offered-a-z/pre-university-programme/"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
      </div>
    ),
    2: (
      <div>
        <p>
          Our intakes are in February, June, October, and November with June
          being the main intake.
        </p>
        <br />
        <p>
          Information on intakes, programmes offered, fees, financial aid,
          accommodation etc. can be found{" "}
          <a
            href="https://www.tarc.edu.my/admissions/a/intake-in-progress/"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
      </div>
    ),
    3: "TAR UMT has 6 campuses; Kuala Lumpur, Penang, Perak, Johor, Pahang, and Sabah.",
    4: (
      <div>
        <p>
          For details on fees, please click{" "}
          <a
            href="https://www.tarc.edu.my/bursary/content.jsp?cat_id=5AA0377F-4E7F-494A-8EB4-CEF5CE4DD7AE"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
      </div>
    ),
    5: (
      <div>
        <p>
          You may find the Academic Calendar{" "}
          <a
            href="https://www.tarc.edu.my/admissions/new-student/academic-calendar/"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
      </div>
    ),
  };

  const financialResponses = {
    1: (
      <div>
        <p>
          For information on financial aid (eg grants, scholarships, study
          loans, PTPTN etc), please click{" "}
          <a
            href="https://www.tarc.edu.my/dsa/financial-aid/financial-aid/"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
        <br />
        <p>
          New students may refer to the{" "}
          <a
            href="https://www.tarc.edu.my/files/dsa/B4B8ECE4-1FF0-44CA-8971-53838DD03B03.pdf"
            className="text-blue-500"
          >
            <i>Freshmen Guide</i>
          </a>{" "}
          for more details.
        </p>
        <br />
        <p>
          Enquiries on financial aid may also be made by emailing the Financial
          Aid Unit at{" "}
          <a href="mailto:fncaid@tarc.edu.my" className="text-blue-500">
            fncaid@tarc.edu.my
          </a>
          .
        </p>
      </div>
    ),
    2: (
      <div>
        <p>
          The Merit Scholarship is awarded to outstanding Malaysian students in
          the form of tuition fee waiver of up to 100%. Reference can be made{" "}
          <a
            href="https://www.tarc.edu.my/admissions/a/merit-scholarship/"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
        <br />
        <p>
          Candidates who meet the scholarship criteria will be automatically
          offered the Merit Scholarship{" "}
          <a
            href="https://www.tarc.edu.my/admissions/a/merit-scholarship/"
            className="text-blue-500"
          >
            (Terms & Conditions Apply)
          </a>{" "}
          at the point of admission.
        </p>
      </div>
    ),
    3: (
      <div>
        <p>
          You must be a registered student to apply for hostel accommodation.
          Please click{" "}
          <a
            href="https://www.tarc.edu.my/dsa/a/accommodation/accommodation-kl-main-campus/"
            className="text-blue-500"
          >
            here
          </a>{" "}
          for more information. For enquiries on hostel, you may also email the
          Department of Student Affairs at{" "}
          <a href="mailto: dsa@tarc.edu.my" className="text-blue-500">
            dsa@tarc.edu.my
          </a>
          .
        </p>
      </div>
    ),
  };

  const admissionResponses = {
    1: (
      <div>
        <p>
          To accept the offer of admission and register for the programme, you
          are to pay fees as stated in the Payment Details Advice. Click{" "}
          <a
            href="https://www.tarc.edu.my/bursary/content.jsp?cat_id=5AA0377F-4E7F-494A-8EB4-CEF5CE4DD7AE"
            className="text-blue-500"
          >
            fees
          </a>
          {" "}for more information. For guide on payment of fees, please refer{" "}
          <a
            href="https://www.tarc.edu.my/bursary/guidelines-on-payment-of-fees/"
            className="text-blue-500"
          >
            here
          </a>
          .
        </p>
      </div>
    ),
    2: (
      <div>
        <p>
          You need not pay fees if you do not want to accept the offer.
          <br />
          The offer of admission will automatically lapse after the payment due
          date.
        </p>
      </div>
    ),
    3: (
      <div>
        <p>
          You are to appeal for late registration and a late registration fee of
          RM 50 will be charged. For KL Campus, please email to {" "}
          <a href="mailto: admission@tarc.edu.my" className="text-blue-500">
            admission@tarc.edu.my
          </a>
          <br />
          <br />
          If you have been offered to the Branch, please email the branch. For
          the email addresses, please go{" "}
          <a
            href="https://www.tarc.edu.my/contact-us/"
            className="text-blue-500"
          >
            here
          </a> 
          .
          <br />
          <br />
          Approval is at the discretion of the university and subject to
          availability of vacancies and as long as application for the Intake is
          still open.
        </p>
      </div>
    ),
  };

  useEffect(() => {
    if (isVisible && !greetingDisplayed) {
      const greetingMessage = "Hello! What would you like to inquire about?";
      setMessages([...messages, { text: greetingMessage, isUser: false }]);
      setGreetingDisplayed(true);
    }

    // Scroll to the bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [isVisible, messages, greetingDisplayed]);

  const handleOptionClick = (option) => {
    if (currentStep === "initial") {
      if (option === "Programmes") {
        setCurrentSection("Programmes");
        setMessages([
          ...messages,
          { text: "Programmes", isUser: true },
          {
            text: (
              <div>
                <p>Here are some options for programmes:</p>
                <br />
                <p>1. What are the programmes offered?</p>
                <p>2. When are the TAR UMT intakes?</p>
                <p>3. How many TAR UMT campuses are there?</p>
                <p>4. How much are the programme fees?</p>
                <p>
                  5. How many semesters are there in a year and how long is the
                  semester break?
                </p>
              </div>
            ),
            isUser: false,
          },
        ]);
      } else if (option === "Financial") {
        setCurrentSection("Financial");
        setMessages([
          ...messages,
          { text: "Financial", isUser: true },
          {
            text: (
              <div>
                <p>Here are some options for financial:</p>
                <br />
                <p>
                  1. Are there any grants, scholarships, and loans available for
                  TAR UMT students?
                </p>
                <p>
                  2. I obtained good results in my examinations. Is there any
                  scholarship, and how do I apply?
                </p>
                <p>
                  3. How do I apply for hostel accommodation, and when can I
                  apply for it?
                </p>
              </div>
            ),
            isUser: false,
          },
        ]);
      } else if (option === "Admission") {
        setCurrentSection("Admission");
        setMessages([
          ...messages,
          { text: "Admission", isUser: true },
          {
            text: (
              <div>
                <p>Here are some options for admission:</p>
                <br />
                <p>1. What should I do to accept the offer of admission?</p>
                <p>
                  2. I am not interested in accepting the offer of admission. Do
                  I still need to pay the fees?
                </p>
                <p>
                  3. I have been offered full admission but missed the deadline
                  for the payment of fees. Can I still pay?
                </p>
              </div>
            ),
            isUser: false,
          },
        ]);
      }

      setCurrentStep("options");
    } else if (currentStep === "options") {
      // Check the current section and use the appropriate response object
      let response;
      if (currentSection === "Programmes") {
        response = programmesResponses[option];
      } else if (currentSection === "Admission") {
        response = admissionResponses[option];
      } else if (currentSection === "Financial") {
        response = financialResponses[option];
      }

      setMessages([
        ...messages,
        { text: `Option ${option}`, isUser: true },
        { text: response, isUser: false },
      ]);

      // Scroll to the bottom when a new message is added
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }

      // Hide options and show close and end buttons
      setShowOptions(false);
    }
  };

  const handleBackClick = () => {
    setCurrentStep("options");
    setShowOptions(true);
  };

  const handleEndClick = () => {
    onClose();
    setTimeout(() => {
      setMessages([]);
      setCurrentStep("initial");
      setShowOptions(true);
      setGreetingDisplayed(false);
    }, 200);
  };

  const availableOptions = {
    Programmes: 5,
    Financial: 3,
    Admission: 3,
  };
  
  const optionsCount = availableOptions[currentSection];

  return (
    <div
      className={`w-80 h-auto fixed bottom-26 right-24 rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform transition-all ${
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0"
          : "opacity-0 translate-y-10 translate-x-10 pointer-events-none"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-center items-center p-2 bg-orange-400 rounded-t-xl">
          <div className="w-9 h-9 border-2 border-green-400 rounded-full flex item-center justify-center">
            <RobotOutlined className="text-lg text-white" />
          </div>
          <h1 className="text-xl text-white ml-2">FAQ Bot</h1>
        </div>
        <div className="flex-grow pb-2 pl-2">
          <div className="overflow-y-auto max-h-80" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.isUser
                    ? "flex justify-end mr-3 ml-6"
                    : "flex justify-start mt-3"
                }`}
              >
                <div className="flex items-center">
                  {!message.isUser ? (
                    <RobotOutlined className="text-lg" />
                  ) : (
                    <UserOutlined className="text-lg" />
                  )}
                  <div
                    className={`bg-gray-200 rounded-lg p-3 ${
                      message.isUser
                        ? "bg-orange-300 text-left text-black ml-2"
                        : "bg-gray-200 text-left text-black ml-2 mr-12 max-w-14"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-2 mr-2">
            {showOptions ? (
              currentStep === "initial" ? (
                <div className="flex flex-grow flex-row gap-x-2">
                  <button
                    onClick={() => handleOptionClick("Programmes")}
                    className="flex-grow bg-orange-200 hover:bg-orange-300 p-2 rounded-md"
                  >
                    Programmes
                  </button>
                  <button
                    onClick={() => handleOptionClick("Financial")}
                    className="flex-grow bg-orange-200 hover:bg-orange-300 p-2 rounded-md "
                  >
                    Financial
                  </button>
                  <button
                    onClick={() => handleOptionClick("Admission")}
                    className="flex-grow bg-orange-200 hover:bg-orange-300 p-2 rounded-md "
                  >
                    Admission
                  </button>
                </div>
              ) : (
                Array.from({ length: optionsCount }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index + 1)}
                    className="flex-grow bg-orange-200 hover.bg-orange-300 p-2 rounded-md ml-2"
                  >
                    {index + 1}
                  </button>
                ))
              )
            ) : (
              <div className="flex flex-grow gap-x-2">
                <button
                  onClick={handleBackClick}
                  className="flex-grow bg-orange-200 hover:bg-orange-300 p-2 rounded-md"
                >
                  Back
                </button>
                <button
                  onClick={handleEndClick}
                  className="flex-grow bg-red-500 hover:bg-red-600 p-2 rounded-md"
                >
                  End
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqChatDialog;
