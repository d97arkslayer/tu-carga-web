import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VerificationCodeEmailPage from "./pages/VerificationCodeEmailPage";
import EmailVerifiedPage from "./pages/EmailVerifiedPage";
import RecoverPasswordPage from "./pages/ResetPasswordRequestPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PasswordResetedPage from "./pages/PasswordResetedPage";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route path="/recover-account" element={<RecoverPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account-recovered" element={<PasswordResetedPage />} />
          <Route
            path="/verification-email"
            element={<VerificationCodeEmailPage />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
