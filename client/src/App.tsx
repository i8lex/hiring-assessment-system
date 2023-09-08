import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import { GeneralLayout } from "./components/layouts/Layout";
import TestsPage from "./pages/TestsPage";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <>
      <GeneralLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test/:id" element={<TestPage />} />
        </Routes>
      </GeneralLayout>
    </>
  );
}

export default App;
