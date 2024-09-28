import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import messages from "../../../i18n/messages";
import { useIntl } from "react-intl";
import InputField from "../../FormHelpers/InputField";
import { isUndefined, pick } from "lodash";
import TaxGroupInput from "../../FormHelpers/TaxGroupInput";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PRICE_NAME, FETCH_PRICE_NAMES, IPriceName, UPDATE_PRICE_NAME } from "./logic";
import LoadingBtn from "../../Btn/LoadingBtn";
import { classNames } from "../../../utils/misc";

export default function PriceNameForm({ handleClose, priceName }: { handleClose: () => void, priceName: IPriceName }) {
    const { formatMessage: f } = useIntl();
    const [createPriceName, { loading: creating }] = useMutation(CREATE_PRICE_NAME);
    const [updatePriceName, { loading: updating }] = useMutation(UPDATE_PRICE_NAME);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(f(messages.nameRequired)),
        tax_group_id: Yup.string().required(),
        description: Yup.string()
    })

    const formik = useFormik({
        initialValues: {
            ...priceName,
        },
        validationSchema,
        onSubmit,
    });

    const create = async () => {
        try {
            const input = pick(
                formik.values,
                "name",
                "tax_group_id",
                "description",
                "num"
            );
            const { data } = await createPriceName({
                variables: {
                    input,
                },
                refetchQueries: [
                    {
                        query: FETCH_PRICE_NAMES,
                    }
                ],
            });
            if (data.CreatePriceName) {
                handleClose();
                return;
            }
            console.error("unexpected return value from server", data);
        } catch (e) {
            console.error(e);
        }
    };


    const save = async () => {
        const { id } = priceName;
        try {
            const input = pick(
                formik.values,
                "name",
                "tax_group_id",
                "description",
                "num"
            );
            const { data } = await updatePriceName({
                variables: {
                    id,
                    input
                },
                refetchQueries: [
                    {
                        query: FETCH_PRICE_NAMES,
                    }
                ],
            });
            if (data.UpdatePriceName) {
                handleClose();
                return;
            }
            console.error("unexpected return value from server", data);
        } catch (e) {
            console.error(e);
        }
    };



    function onSubmit() {
        if (priceName && priceName.id) {
            save();
            return;
        }
        create();
    }
    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <InputField
                    name="name"
                    className="mb-2 col-span-6 py-2"
                    formik={formik}
                    onBlur={false}
                    disabled={creating || updating}
                    label={f(messages.priceName)}
                    cornerHint={f(
                        { id: "{count} characters remaining" },
                        {
                            count:
                                40 -
                                (!isUndefined(formik.values.name)
                                    ? formik.values.name.length
                                    : 0),
                            b: (...chunks) => <b key="ttt">{chunks}</b>,
                        }
                    )}
                />
                <div className="flex justify-between gap-4 items-top">
                    <InputField
                        name="num"
                        className="mb-2 py-4 w-1/3"
                        formik={formik}
                        mask="999"
                        number
                        disabled={updating || creating}
                        label={f(messages.number)}
                    />
                    <TaxGroupInput
                        name="tax_group_id"
                        className="mb-2 py-4 w-full"
                        formik={formik}
                        label={f(messages.taxGroup)}
                    />
                </div>
                <InputField
                    name="description"
                    className="mb-2 py-2"
                    formik={formik}
                    disabled={creating || updating}
                    label={f(messages.description)}
                    cornerHint={f(
                        { id: "{count} characters remaining" },
                        {
                            count:
                                40 -
                                (!isUndefined(formik.values.description)
                                    ? formik.values.description.length
                                    : 0),
                            b: (...chunks) => <b key="ttt">{chunks}</b>,
                        }
                    )}
                />
            </div>
            <div className="mt-5 sm:mt-4 sm:flex">
                <LoadingBtn
                    loading={updating || creating}
                    type="submit"
                    className={classNames(
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                        !formik.dirty || !formik.isValid || updating || creating
                            ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                            : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
                    )}
                    disabled={!formik.dirty || !formik.isValid || updating || creating}
                >
                    {f(messages[priceName && priceName.id ? "save" : "create"])}
                </LoadingBtn>
                <button
                    type="submit"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleClose}
                >
                    {f(messages.cancel)}
                </button>
            </div>
        </form>
    )
}