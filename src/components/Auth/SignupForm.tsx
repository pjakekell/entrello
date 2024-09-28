import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useFormik, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import LoadingBtn from "../Btn/LoadingBtn";
import { SIGNUP_USER } from "./logic";
import logger from "../../utils/logger";
import messages from "../../i18n/messages";
import * as Yup from "yup";
import { lang } from "../../locale";

interface Values {
  name: string;
  org_name: string;
  email: string;
  password: string;
  lang: string;
}

export default function SignupForm() {
  // hooks
  const [signupUser, { error }] = useMutation(SIGNUP_USER);
  const navigate = useNavigate();
  const { formatMessage: f } = useIntl();
  const focusRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(f(messages.invalidEmailError))
      .required(f(messages.emailIsRequired)),
    password: Yup.string().required(f(messages.passwordIsRequired)),
  });
  const onSubmit = async (
    variables: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    try {
      setSubmitting(true);
      const {
        data: { Signup },
      } = await signupUser({ variables });
      if (lang !== variables.lang) {
        localStorage.setItem("locale", variables.lang);
      }
      localStorage.setItem("t", Signup.access_token);
      localStorage.setItem("r", Signup.refresh_token);
      navigate("/events");
      window.location.reload();
    } catch (e) {
      localStorage.removeItem("t");
      localStorage.removeItem("r");
      logger.warn("caught", e);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      org_name: "",
      email: "",
      password: "",
      lang: "en",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit} method="POST" className="space-y-6">
      <div className="relative">
        <div className="absolute top-3 left-0 border-2 border-gray-600 w-full z-0" />
        <div className="flex justify-center">
          <div className="bg-white px-2 text-gray-600 text-center text-lg font-bold z-10">
            {f(messages.signup)}
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="org_name"
          className="block text-sm font-medium text-gray-700"
        >
          {f(messages.organization)}
        </label>
        <div className="mt-1">
          <input
            id="org_name"
            name="org_name"
            type="text"
            ref={focusRef}
            autoComplete="org_name"
            onChange={formik.handleChange}
            value={formik.values.org_name}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
          />
          {formik.touched.org_name && formik.errors.org_name ? (
            <p className="mt-2 text-sm text-red-800" id="org_name-error">
              {formik.errors.org_name}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {f(messages.name)}
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
          />
          {formik.touched.name && formik.errors.name ? (
            <p className="mt-2 text-sm text-red-800" id="name-error">
              {formik.errors.name}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="lang"
          className="block text-sm font-medium text-gray-700"
        >
          {f(messages.language)}
        </label>
        <div className="mt-1">
          <select
            name="lang"
            id="lang"
            onChange={formik.handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            <option value="en">English</option>
            <option value="de">German</option>
          </select>
          {formik.touched.name && formik.errors.name ? (
            <p className="mt-2 text-sm text-red-800" id="name-error">
              {formik.errors.name}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {f(messages.email)}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
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
          className="block text-sm font-medium text-gray-700"
        >
          {f(messages.password)}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
        <div className="flex -mx-3">
          <LoadingBtn
            loading={formik.isSubmitting}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            {f(messages.signup)}
          </LoadingBtn>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm">
          {f(messages.alreadyHaveAccount)}
          &nbsp;&#8594;&nbsp;
          <Link to="/login" className="text-gray-500 hover:text-gray-700">
            {f(messages.login)}
          </Link>
        </div>
      </div>

      <div>
        {error ? (
          <div className="text-center font-medium tracking-wide text-red-600 text-xs mb-4">
            {error.message}
          </div>
        ) : null}
      </div>
    </form>
  );
}
