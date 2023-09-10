import { CommentOutlined } from "@ant-design/icons";
import { useState } from "react";
import FaqChatDialog from "./faqChatDialog";

const FaqButton = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const openDialog = () => {
    setDialogVisible(!dialogVisible);
  };

  return (
    <div>
      <button
        onClick={openDialog}
        className="w-16 h-16 bg-orange-400 rounded-full absolute bottom-10 right-10 hover:bg-orange-500 active:border-4 active:border-orange-600"
      >
        <CommentOutlined className="text-2xl text-white" />
      </button>
      <FaqChatDialog isVisible={dialogVisible} />
    </div>
  );
};

export default FaqButton;
