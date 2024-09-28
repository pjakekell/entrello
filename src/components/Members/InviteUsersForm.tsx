import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import messages from "../../i18n/messages";
import { classNames } from "../../utils/misc";
import LoadingBtn from "../Btn/LoadingBtn";
import InputField from "../FormHelpers/InputField";
import { ADD_USERS_TO_AN_ORGANIZATION, FETCH_USERS_OF_ORG } from "./logic";

export default function InviteUsersForm({ handleClose }: { handleClose: () => void }) {
    const { formatMessage: f } = useIntl();

    const [inviteUsersToOrganization, { loading: inviting }] = useMutation(ADD_USERS_TO_AN_ORGANIZATION)

    const validationSchema = Yup.object().shape({
        emails: Yup.string()
            .matches(/^([\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})(,[\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})*$/gi, f(messages.invalidEmailError))
            .required(f(messages.emailIsRequired))
    })

    const formik = useFormik({
        initialValues: {
            emails: '',
        },
        validationSchema,
        onSubmit
    })

    function onSubmit() {

        inviteUsers();
        handleClose();
    }

    async function inviteUsers() {
        const users = formik.values.emails.split(",");
        try {
            const { data } = await inviteUsersToOrganization({
                variables: {
                    emails: users,
                    role: 1, // Logic behind roles?
                },
                refetchQueries: [
                    {
                        query: FETCH_USERS_OF_ORG
                    }
                ]
            })
            if (data.AddUsersToOrganization) {
                handleClose();
                return;
            }
            console.error("unexpected return value from server", data);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <InputField
                name="emails"
                className="col-span-3 py-1"
                formik={formik}
                disabled={formik.isSubmitting}
                label={f(messages.emailEmails)}
                placeholder={f(messages.usersEmails)}
            />
            <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                <LoadingBtn
                    loading={inviting}
                    onClick={onSubmit}
                    type="submit"
                    className={classNames(
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 w-fit flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                        !formik.dirty || !formik.isValid || inviting
                            ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                            : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
                    )}
                    disabled={!formik.dirty || !formik.isValid || inviting}
                >
                    {f(messages.inviteUsers)}
                </LoadingBtn>

            </div>
        </form>
    )
}