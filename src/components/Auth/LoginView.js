import React from "react";
import LoginForm from "./LoginForm";
import AuthLayout from "./AuthLayout";

export default function LoginView() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
