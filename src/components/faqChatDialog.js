import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";

const FaqChatDialog = ({ isVisible }) => {
  const [messages, setMessages] = useState([]);

  const handleOptionClick = (option) => {
    const responses = {
      "Option 1": "You selected Option 1. Here's the response for Option 1.",
      "Option 2": "You selected Option 2. Here's the response for Option 2.",
      "Option 3": "You selected Option 3. Here's the response for Option 3.",
    };

    setMessages([
      ...messages,
      { text: option, isUser: true },
      { text: responses[option], isUser: false },
    ]);
  };

  return (
    <div
      className={`w-1/5 h-2/4 absolute bottom-20 right-20 mb-10 rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform transition-all ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-center items-center p-2 bg-orange-300 rounded-t-xl">
          <div className="w-9 h-9 border-2 border-green-400 rounded-full flex item-center justify-center">
            <RobotOutlined className="text-lg text-white" />
          </div>
          <h1 className="text-xl text-white ml-2">FAQ Bot</h1>
        </div>
        <div className="flex-grow p-4">
          <div className="overflow-y-auto max-h-80 mt-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.isUser ? "flex justify-end" : "flex justify-start mt-3"
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
                        ? "bg-blue-200 text-right ml-2"
                        : "bg-gray-200 text-left mr-2"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-start mt-2">
            <button
              onClick={() => handleOptionClick("Option 1")}
              className="bg-blue-200 hover:bg-blue-300 p-2 rounded-md"
            >
              Option 1
            </button>
            <button
              onClick={() => handleOptionClick("Option 2")}
              className="bg-blue-200 hover:bg-blue-300 p-2 rounded-md ml-2"
            >
              Option 2
            </button>
            <button
              onClick={() => handleOptionClick("Option 3")}
              className="bg-blue-200 hover:bg-blue-300 p-2 rounded-md ml-2"
            >
              Option 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqChatDialog;
