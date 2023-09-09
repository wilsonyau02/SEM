import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Application from "./pages/application/Application";
import AcademicianDirectory from "./pages/academician/AcademicianDirectory";
import Help from "./pages/help/Help";
import PageLayout from "./pages/Layout";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import UpdatePassword from "./pages/authentication/UpdatePassword";
import NotFound from "./pages/result/NotFound";
import { useAuth } from "./context/AuthProvider";


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
      } else if (userSession.user.user_metadata.userType === "admin") {
        return (
          <>
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
