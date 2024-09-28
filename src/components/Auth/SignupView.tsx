import React from "react";
import SignupForm from "./SignupForm";
import AuthLayout from "./AuthLayout";

export default function SignupView() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
