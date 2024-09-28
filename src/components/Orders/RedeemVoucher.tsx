import React, { useState, useMemo, Fragment } from "react";
import { IOrder } from "./interfaces";
import Btn from "../Btn/Btn";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import messages from "../../i18n/messages";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client";

import { Dialog, Transition } from "@headlessui/react";
import InputField from "../FormHelpers/InputField";

import { XIcon } from "@heroicons/react/solid";
import { IVoucher } from "../../pages/Vouchers/interfaces";
import moment from "moment";
import LoadingBtn from "../Btn/LoadingBtn";
import { CREATE_PAY_ITEM, FETCH_ORDER_BY_ID, PAYMENT_METHOD_VOUCHER } from "./logic";

interface IRedeemVoucher {
  order: IOrder;
  voucher: IVoucher;
}

interface IVoucherTable {
  voucher: IVoucher;
}

const VoucherTable = ({
  voucher
}: IVoucherTable) => {
  const { formatMessage: f } = useIntl();
  const data = useMemo(() => {
    const result = [];
    if(voucher) {
      for(const [key, v] of Object.entries(voucher)) {
        let value = "";
        if(key !== "__typename" && key !== "id") {
          if(key === "order")
            value = v.booking_code;
          else if(key === "created_at" || key === "updated_at" || key === "deleted_at")
            value = voucher[key] ? moment(voucher[key]).format("DD-MM-YYYY") : "";
          else
            value = v;

          result.push({
            key,
            value
          });
        }
      }
      result.push({
        key: "remaining",
        value: (voucher?.original_value || 0) - (voucher?.value || 0)
      })
    }
    return result;
  }, [voucher]);

  return (
    <div>
      <table className="mt-2 min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {f(messages.field)}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {f(messages.value)}
            </th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((item, index) => (
              <tr
                key={`column-${index}`}
                className="border-b border-gray-200"
              >
                <td className="px-6 py-1 text-xs font-medium text-gray-500 truncate">
                  { item.key }
                </td>
                <td className="px-6 py-1 text-xs font-medium text-gray-500 truncate">
                  { item.value }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
export default function RedeemVoucher({ order, voucher }: IRedeemVoucher) {
  const { formatMessage: f } = useIntl();
  const [isOpen, setOpen] = useState(false);
  const validationSchema = Yup.object().shape({
    voucherCode: Yup.string()
  });
  const [createPayItem, { loading }] = useMutation(CREATE_PAY_ITEM);
  const remainingValue = useMemo(() => {
    if(!voucher) return 0;
    const value = (voucher?.original_value || 0) - (voucher?.value || 0);
    if(value <= 0) return 0;
    return value;
  }, [voucher]);

  const initialValues = {
    voucherCode: ""
  }

  const onSubmit = async () => {
    try {
      await createPayItem({
        variables: {
          input: {
            paid: true,
            order_id: order.id,
            total: order.total < remainingValue ? order.total : remainingValue,
            payment_method: PAYMENT_METHOD_VOUCHER,
          },
        },
        refetchQueries: [
          {
            query: FETCH_ORDER_BY_ID,
            variables: { id: order.id },
          },
        ],
      });
      closeModal();
    } catch (e) {
      console.error(e);
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  
  const openModal = () => {
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  }

  return (
    <div>
      <Btn sm outline color="info" onClick={openModal}>
        {f(messages.redeemVoucher)}
      </Btn>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center">
                    <div className="sm:text-left w-full">
                      <Dialog.Title as="div">
                        <div className="text-lg leading-6 font-medium text-brand-600">
                          {f(messages.redeemVoucher)}
                        </div>
                      </Dialog.Title>
                    </div>
                    <div
                      className="ml-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                      onClick={closeModal}
                    >
                      <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                    </div>
                  </div>
                  <form onSubmit={formik.handleSubmit} className="mt-2">
                    <InputField
                      name="voucherCode"
                      className="mb-2 col-span-6 py-2"
                      formik={formik}
                      label={f(messages.voucherCode)}
                    />
                    <VoucherTable voucher={voucher} />
                    {
                      !!remainingValue &&
                      <LoadingBtn
                        loading={loading}
                        darkLoader
                        type="submit"
                        className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                        disabled={loading}
                      >
                        {f(messages.applyVoucher)}
                      </LoadingBtn>
                    }
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>      
    </div>
  );
}
