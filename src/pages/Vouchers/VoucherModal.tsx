import React, { Fragment, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Transition, Dialog } from "@headlessui/react";
import { TrashIcon, XIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";

import VoucherForm from "./VoucherForm";
import messages from "../../i18n/messages";
import {
  buildVoucher,
  DELETE_VOUCHER,
  FETCH_VOUCHERS,
  FETCH_VOUCHER_BY_ID,
} from "./logic";
import Tooltip, { Placement } from "../../components/Tooltip/Tooltip";
import LoadingIcon from "../../components/Btn/LoadingIcon";
import { setMsg } from "../../components/Toaster/logic";

export default function VoucherModal() {
  const [showVoucherDialog, setShowDialog] = useState(true);
  const dispatch = useDispatch();
  const { VoucherId } = useParams();

  const { formatMessage: f } = useIntl();

  const { data } = useQuery(FETCH_VOUCHER_BY_ID, {
    variables: { id: VoucherId },
    skip: !VoucherId,
  });
  const [deleteVoucher, { loading: deleting }] = useMutation(DELETE_VOUCHER);

  const voucher = buildVoucher(data ? data.Voucher : null);

  const navigate = useNavigate();
  const focusFieldRef = useRef(null);

  const handleClose = () => {
    setShowDialog(false);
    navigate("/Vouchers");
  };

  const handleDelete = async () => {
    try {
      await deleteVoucher({
        variables: {
          id: VoucherId,
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
      dispatch(setMsg({ title: f(messages.voucherDeleted), level: "success" }));
      handleClose();
    } catch (e) {
      //@ts-ignore
      dispatch(setMsg({ title: "ERROR", level: "error", desc: e.message }));
    }
  };

  return (
    <Transition.Root show={showVoucherDialog} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={focusFieldRef}
        open
        onClose={handleClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-brand-600"
                  >
                    {VoucherId
                      ? f(messages.editVoucher)
                      : f(messages.newVoucher)}
                  </Dialog.Title>
                </div>
                <Tooltip
                  content={f(messages.deleteVoucherDescription)}
                  placement={Placement.top}
                >
                  <div
                    className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer group"
                    onClick={handleDelete}
                  >
                    {deleting ? (
                      <LoadingIcon color="text-red-600" />
                    ) : (
                      <TrashIcon
                        className="h-6 w-6 text-red-400 group-hover:text-red-600"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </Tooltip>
                <div
                  className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                  onClick={handleClose}
                >
                  <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-2">
                <VoucherForm voucher={voucher} handleClose={handleClose} />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
