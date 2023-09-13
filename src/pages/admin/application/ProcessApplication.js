import { Button } from "antd"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

function ProcessApplication () {

    const navigate = useNavigate();
    const { signOut } = useAuth();


    const  handleLogout = async () => {
        await signOut();
        navigate('/login');
    }

    return (
        <div>
            <h1>Process Application</h1>

            <Button type="primary" onClick={handleLogout}>Logout</Button>
        </div>
    )

}

export default ProcessApplication