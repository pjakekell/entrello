import React, { Fragment, useRef, useMemo } from "react";
import { useIntl } from "react-intl";
import { IOrg } from "../Org/interfaces";
import messages from "../../i18n/messages";
import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { GroupedItemsListingForSellDialog } from "./GroupedItemsListing";
import { oidFromJWT, FETCH_ORG_BY_ID } from "../Org/logic";
import { FETCH_ORDER_BY_ID, CREATE_INVOICE } from "./logic";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PaymentMethods from "./PaymentMethods";
import RedeemVoucher from "./RedeemVoucher";
import LoadingBtn from "../Btn/LoadingBtn";
import ApplyPromoCode from "./ApplyPromoCode";
import Currency from "../Currency";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrder";
import { FETCH_VOUCHER_BY_ID } from "../../pages/Vouchers/logic";

const SellOrderDialog = () => {
  const { orderId } = useParams();
  const [order] = useOrder(orderId || "");
  const voucherId = useMemo(() => {
    return order?.order_items?.length ? order?.order_items[0].voucher_id : "";
  }, [order]);
  const { data: vData } = useQuery(FETCH_VOUCHER_BY_ID, {
    variables: { id: voucherId },
    skip: !voucherId,
  });
  const voucher = vData ? vData.voucher : null;
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const focusFieldRef = useRef(null);
  const [createInvoice, { loading, error }] = useMutation(CREATE_INVOICE);
  const { data } = useQuery(FETCH_ORG_BY_ID, {
    variables: { id: oidFromJWT() },
    fetchPolicy: "cache-only",
  });

  const org: IOrg | null = data ? data.org : null;

  if (!order) return <></>;

  const handleClose = () => {
    navigate(location.pathname.split("/sell")[0]);
  };

  const handleSubmit = async () => {
    try {
      await createInvoice({
        variables: {
          input: {
            order_id: order.id,
          },
        },
        refetchQueries: [
          {
            query: FETCH_ORDER_BY_ID,
            variables: { id: order.id },
          },
        ],
      });
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  const getDiff = () => {
    const amount = order.pay_items.reduce(
      (acc: number, i: any) => acc + i.total,
      0
    );
    return order.total - amount;
  };
  const diff = getDiff();

  return (
    <Transition.Root show as={Fragment}>
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
              <div className="flex items-center">
                <div className="sm:text-left w-full">
                  <Dialog.Title as="div">
                    <div className="text-lg leading-6 font-medium text-brand-600">
                      {f(messages.sellOrder)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.booking_code}
                    </div>
                  </Dialog.Title>
                </div>
                <div
                  className="ml-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                  ref={focusFieldRef}
                  onClick={handleClose}
                >
                  <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-2">
                <GroupedItemsListingForSellDialog order={order} />
                <div className="flex items-center">
                  <RedeemVoucher order={order} voucher={voucher} />
                  <div className="w-1" />
                  <ApplyPromoCode order={order}/>
                </div>
                {org && order ? (
                  <div>
                    <PaymentMethods
                      order={order}
                      handleClose={handleClose}
                      getDiff={getDiff}
                    />
                    <div className="flex justify-end mt-4 items-center">
                      {diff > 0 ? (
                        <div className="text-red-500 text-sm mr-2">
                          <span className="font-bold mr-1">
                            {f(messages.unpaid)}:
                          </span>
                          <Currency value={diff} />
                        </div>
                      ) : null}
                      {diff === 0 ? null : (
                        <LoadingBtn
                          color={diff > 0 ? "warning" : "success"}
                          loading={loading}
                          disabled={order.pay_items.length < 1}
                          onClick={handleSubmit}
                        >
                          {diff > 0
                            ? f(messages.sellOrderAnyways)
                            : f(messages.sellOrder)}
                        </LoadingBtn>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              {error ? (
                <div className="text-red-500 px-2 my-4">{error}</div>
              ) : null}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SellOrderDialog;
