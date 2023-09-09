import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';


function NotFound({ backTo }) {

    const navigate = useNavigate();

    const handleBackHome = () => {
        if (backTo === "login") {
            navigate("/login");
        } else if (backTo === "admin") {
            navigate("/admin");
        } else {
            navigate("/student");
        }
    }

    const extraButton = <Button type="primary" onClick={handleBackHome} style={{ width: "15%" }}>
        Back to {backTo === "login" ? " Login" : " Home"} 
    </Button>;

    return <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        style={{ height: "100vh", background: "white" }}
        extra={extraButton}
    />;
}

export default NotFound;