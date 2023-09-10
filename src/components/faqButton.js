import { FloatButton } from "antd";
import { CommentOutlined } from "@ant-design/icons";

const FaqButton = () => {
  const statusColor = "red";

  return (
    <button className="w-16 h-16 border-2 border-orange-200 rounded-full">
      <CommentOutlined className="text-2xl" />
    </button>
  );
};

export default FaqButton;
