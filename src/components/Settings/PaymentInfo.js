import React from "react";
import { useIntl } from "react-intl";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { oidFromJWT, FETCH_ORG_BY_ID, UPDATE_ORG } from "../Org/logic";
import LoadingContainer from "../LoadingContainer";
import { useFormik } from "formik";

function PaymentInfoForm({ org }) {
  const oid = oidFromJWT();
  const [saveOrg] = useMutation(UPDATE_ORG);
  const initialValues = org.individual || {
    dob: {
      day: 0,
      month: 0,
      year: 0,
    },
  };
  const onSubmit = async (variables, { setSubmitting }) => {
    try {
      const {
        data: { updateOrg: org },
      } = await saveOrg({
        variables: {
          ...variables,
          id: oid,
        },
      });
      console.log("response org", org);
    } catch (e) {
      console.log("caught", e);
    } finally {
      setSubmitting(false);
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.firstname) errors.firstname = "required";
    if (!values.lastname) errors.lastname = "required";
    return errors;
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      names here
      <button type="submit" className="d-none">
        Submit
      </button>
    </form>
  );
}

export default function PaymentInfo() {
  const { formatMessage: f } = useIntl();
  const oid = oidFromJWT();
  const variables = { id: oid };
  const { data, loading } = useQuery(FETCH_ORG_BY_ID, { variables });

  // const BREADCRUMBS = [
  //   { href: "/settings", text: f({ id: "Settings" }) },
  //   { text: f({ id: "Payment Info" }), current: true, intent: "primary" },
  // ];

  return (
    <div className="settings">
      <div>
        <div className="card-title">
          {f({ id: "Primary Owner Information" })}
        </div>
        <div className="card-body">
          {loading ? <LoadingContainer /> : <PaymentInfoForm org={data.org} />}
        </div>
      </div>
    </div>
  );
}
