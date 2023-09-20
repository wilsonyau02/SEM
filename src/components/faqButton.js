import { CommentOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import FaqChatDialog from "./faqChatDialog";

const FaqButton = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const openDialog = () => {
    setDialogVisible(!dialogVisible);
  };

  const onClose = () => {
    setDialogVisible(false);
  };

  return (
    <div>
      <button
        onClick={openDialog}
        className="w-16 h-16 bg-orange-400 rounded-full fixed bottom-10 right-10 hover:bg-orange-500 active:border-4 active:border-orange-600 z-50"
      >
        <CommentOutlined className="text-2xl text-white" />
      </button>
      <FaqChatDialog className="z-40" isVisible={dialogVisible} onClose={onClose} />
    </div>
  );
};

export default FaqButton;
