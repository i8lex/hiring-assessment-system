import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import { GeneralLayout } from "./components/layouts/Layout";
import TestsPage from "./pages/TestsPage";
import TestPage from "./pages/TestPage";
import RegisterPage from "./pages/Registrer";

function App() {
  return (
    <>
      <GeneralLayout>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test/:id" element={<TestPage />} />
          <Route path="*" element={<Navigate to="/tests" />} />
        </Routes>
      </GeneralLayout>
    </>
  );
}

export default App;
