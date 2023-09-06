import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import { GeneralLayout } from "./components/layouts/Layout";
import TestsPage from "./pages/TestsPage";

function App() {
  return (
    <>
      <GeneralLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tests" element={<TestsPage />} />
        </Routes>
      </GeneralLayout>
    </>
  );
}

export default App;
