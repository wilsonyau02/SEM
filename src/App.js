import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Application from "./pages/application/Application";
import AcademicianDirectory from "./pages/academician/AcademicianDirectory";
import Help from "./pages/help/Help";
import PageLayout from "./pages/Layout";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="application" element={<Application />} />
          <Route path="academician" element={<AcademicianDirectory />} />
          <Route path="help" element={<Help />} />        
        </Route>

      </Routes>
    </>
  );
}

export default App;
