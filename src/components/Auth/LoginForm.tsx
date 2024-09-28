import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import LoadingBtn from "../Btn/LoadingBtn";
import { LOGIN_USER } from "./logic";
import logger from "../../utils/logger";
import messages from "../../i18n/messages";
import * as Yup from "yup";

interface Values {
  email: string;
  password: string;
}

export default function LoginForm() {
  // hooks
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const { formatMessage: f } = useIntl();
  const focusRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(f(messages.invalidEmailError))
      .required(f(messages.emailIsRequired)),
    password: Yup.string().required(f(messages.passwordIsRequired)),
  });
  const onSubmit = async (variables: Values) => {
    try {
      const {
        data: { Login },
      } = await loginUser({ variables });
      localStorage.setItem("t", Login.access_token);
      localStorage.setItem("r", Login.refresh_token);
      navigate("/events");
    } catch (e) {
      localStorage.removeItem("t");
      localStorage.removeItem("r");
      logger.warn("caught", e);
    }
  };

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} method="POST" className="space-y-6">
      <div className="relative">
        <div className="absolute top-3 left-2 border border-gray-600 w-full z-0" />
        <div className="flex justify-center">
          <div className="bg-white px-2 text-gray-600 text-center text-lg font-bold z-10">
            {f(messages.login)}
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600"
        >
          {f(messages.email)}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            ref={focusRef}
            autoComplete="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="mt-2 text-sm text-red-800" id="email-error">
              {formik.errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-600"
        >
          {f(messages.password)}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            autoComplete="current-password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="mt-2 text-sm text-red-800" id="password-error">
              {formik.errors.password}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <div className="flex">
          <LoadingBtn
            loading={loading}
            darkLoader
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            disabled={!formik.dirty || loading}
          >
            {f(messages.login)}
          </LoadingBtn>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm">
          <Link to="/forgot" className="text-gray-500 hover:text-gray-700">
            {f(messages.forgotPassword)}
          </Link>
        </div>
      </div>

      <div>
        {error ? (
          <div className="text-center font-medium tracking-wide text-red-600 text-xs mb-4">
            {f(messages.authenticationFailed)}
          </div>
        ) : null}
      </div>
    </form>
  );
}
