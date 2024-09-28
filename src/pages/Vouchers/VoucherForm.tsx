import React from "react";
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { pick, isUndefined } from "lodash";

import { IVoucher } from "./interfaces";
import { CREATE_VOUCHER, FETCH_VOUCHERS } from "./logic";
import InputField from "../../components/FormHelpers/InputField";
import LoadingBtn from "../../components/Btn/LoadingBtn";
import { classNames } from "../../utils/misc";
import messages from "../../i18n/messages";
import InsetInputField from "../../components/FormHelpers/InsetInputField";
import { CashIcon } from "@heroicons/react/outline";
import ContactShortInfo from "../../components/Contact/ContactShortInfo";
import { useUpdateVoucher, IVoucherInput } from "../../hooks/useUpdateVoucher";
import { useCreateOrder } from "../../hooks/useCreateOrder";

export default function VoucherForm({
  voucher,
  handleClose,
}: {
  voucher: IVoucher;
  handleClose: () => void;
}) {
  const navigate = useNavigate();
  const { formatMessage: f } = useIntl();
  const [createVoucher, { loading: creating }] = useMutation(CREATE_VOUCHER);
  const [createOrder, { loading: creatingOrder }] = useCreateOrder();
  const setVoucherContact = ({ contact_id }: any) =>
    formik.setFieldValue("contact_id", contact_id);
  const [updateVoucher, { loading: updating, error: updatingError }] =
    useUpdateVoucher(voucher.id || "");

  const validationSchema = Yup.object().shape({
    dedication: Yup.string().max(40),
    value: Yup.number().min(1).required(f(messages.voucherValueRequired)),
  });
  const formik = useFormik({
    initialValues: {
      ...voucher,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  const getInputValues = () => {
    return pick(formik.values, "value", "dedication", "contact_id");
  };

  const create = async () => {
    try {
      const input = getInputValues();
      const { data } = await createVoucher({
        variables: {
          input,
        },
        refetchQueries: [
          {
            query: FETCH_VOUCHERS,
            variables: {
              limit: 100,
            },
          },
        ],
      });
      if (data.CreateVoucher) {
        const voucher = data.CreateVoucher;
        try {
          const { data } = await createOrder([
            {
              voucher_id: voucher.id,
              qty: 1,
            },
          ]);
          handleClose();
          navigate(`/vouchers/o/${data.CreateOrder.id}/sell`);
        } catch (e) {
          console.error(
            "failed to create order for voucher with id ",
            voucher.id,
            e
          );
        }
        return;
      }
      console.error("unexpected return value from server", data);
      return;
    } catch (e) {
      console.error(e);
    }
  };

  const save = async () => {
    try {
      const input = getInputValues();
      await updateVoucher(input as IVoucherInput);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  function onSubmit() {
    if (voucher && voucher.id) {
      save();
      return;
    }
    create();
  }

  const handleBackToVouchers = () => navigate(`/Vouchers`);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <InsetInputField
          name="value"
          className="mb-2 col-span-6 py-4"
          icon={<CashIcon className="h-5 w-5 text-gray-400" />}
          formik={formik}
          number
          currency="€"
          disabled={updating || creating || creatingOrder}
          label={f(messages.value)}
        />
        <InputField
          name="dedication"
          className="mb-2 col-span-6 py-2"
          formik={formik}
          disabled={creating || updating || creatingOrder}
          label={f(messages.description)}
          cornerHint={f(
            { id: "{count} characters remaining" },
            {
              count:
                40 -
                (!isUndefined(formik.values.dedication)
                  ? formik.values.dedication.length
                  : 0),
              b: (...chunks) => <b key="ttt">{chunks}</b>,
            }
          )}
        />
        <ContactShortInfo
          contact={voucher.contact}
          vertical
          update={voucher.id ? updateVoucher : setVoucherContact}
          error={updatingError}
          loading={updating || creating || creatingOrder}
        />
        <div className="mt-5 sm:mt-4 sm:flex">
          <LoadingBtn
            loading={creating || updating || creatingOrder}
            type="submit"
            className={classNames(
              "focus:outline-none focus:ring-2 focus:ring-offset-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              !formik.dirty || !formik.isValid || creating || updating
                ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500"
            )}
            disabled={!formik.dirty || !formik.isValid || creating || updating}
          >
            {voucher.id ? f(messages.update) : f(messages["create"])}
          </LoadingBtn>
          <button
            type="submit"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleBackToVouchers}
          >
            {f(messages.cancel)}
          </button>
        </div>
      </div>
    </form>
  );
}
