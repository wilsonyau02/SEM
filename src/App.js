import { Route, Routes } from "react-router-dom";
import Home from "./pages/student/home/Home";
import Application from "./pages/student/application/Application";
import AcademicianDirectory from "./pages/student/academician/AcademicianDirectory";
import Help from "./pages/student/help/Help";
import PageLayout from "./pages/student/StudentLayout";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import UpdatePassword from "./pages/authentication/UpdatePassword";
import NotFound from "./pages/result/NotFound";
import { useAuth } from "./context/AuthProvider";
import ProcessApplication from "./pages/admin/ProcessApplication";


function App() {

  const { userSession, auth } = useAuth();

  console.log(userSession);
  console.log(auth);

  const userTypeRoutes = () => {
    if (userSession && auth) {
      if (userSession.user.user_metadata.userType === "student") {
        return (
          <>
            <Route path="/student/" element={<PageLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="application" element={<Application />} />
              <Route path="academician" element={<AcademicianDirectory />} />
              <Route path="help" element={<Help />} />
            </Route>
          </>
        );
      } else {
        return (
          <>
            <Route path="/admin/" element={<ProcessApplication />}/>
            {/* <Route path="/admin/" element={<PageLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="application" element={<Application />} />
              <Route path="academician" element={<AcademicianDirectory />} />
              <Route path="help" element={<Help />} />
            </Route> */}
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
        <Route path="*" element={<NotFound />} />


      </Routes>
    </>
  );
}

export default App;
