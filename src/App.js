import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/student/home/Home";
import Application from "./pages/student/application/Application";
import AcademicianDirectory from "./pages/student/academician/AcademicianDirectory";
import PageLayout from "./pages/student/StudentLayout";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import UpdatePassword from "./pages/authentication/UpdatePassword";
import NotFound from "./pages/result/NotFound";
import { useAuth } from "./context/AuthProvider";
import ProcessApplication from "./pages/admin/application/ProcessApplication";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminInquiry from "./pages/admin/adminInquiry/AdminInquiry";
import ActivityLog from "./pages/admin/activityLog/ActivityLog";
import StudentInquiry from "./pages/student/inquiry/StudentInquiry";
import CreateApplication from "./pages/student/application/CreateApplication";
import ProgramDetails from "./pages/student/home/ProgramDetails";
import Testing from "./pages/student/application/Testing";

function App() {

  const { userSession, auth } = useAuth();

  console.log(userSession);
  console.log(auth);

  const userTypeRoutes = () => {
    if (userSession && auth) {
      if (userSession.user.user_metadata.userType === "student") {
        return (
          <>

            <Route path="/" element={<Navigate to="/student" />} />
            <Route path="/login" element={<Navigate to="/student" />} />
            <Route path="/signup" element={<Navigate to="/student" />} />
            <Route path="/forgot-password" element={<Navigate to="/student" />} />
            <Route path="/update-password" element={<Navigate to="/student" />} />

            <Route path="/student/" element={<PageLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="programDetails" element={<ProgramDetails />} />
              <Route path="application" element={<Application />} />
              <Route path="application/new" element={<CreateApplication />} />
              <Route path="application/testing" element={<Testing />} />
              <Route path="academician" element={<AcademicianDirectory />} />
              <Route path="studentInquiry" element={<StudentInquiry />} />
              <Route path="*" element={<NotFound backTo="student"/>} />
            </Route>
            <Route path="*" element={<NotFound backTo="student"/>} />

          </>
        );
      } else {
        return (
          <>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/login" element={<Navigate to="/admin" />} />
            <Route path="/signup" element={<Navigate to="/admin" />} />
            <Route path="/forgot-password" element={<Navigate to="/admin" />} />
            <Route path="/update-password" element={<Navigate to="/admin" />} />

            <Route path="/admin/" element={<AdminLayout />}>
              <Route index element={<ProcessApplication />} />
              <Route path="application" element={<ProcessApplication />} />
              <Route path="adminInquiry" element={<AdminInquiry />} />
              <Route path="activityLog" element={<ActivityLog />} />
              <Route path="*" element={<NotFound backTo="admin"/>} />
            </Route>
          </>
        );
      }
    }
  };



  return (
    <>
      <Routes>

        {userTypeRoutes()}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="*" element={<NotFound backTo="login"/>} />
      </Routes>
    </>
  );
}

export default App;
