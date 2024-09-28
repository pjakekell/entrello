import React, { Fragment, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useParams, Link, Outlet } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Transition, Dialog } from "@headlessui/react";
import { TrashIcon, XIcon } from "@heroicons/react/outline";
import {
  DELETE_PRICE,
  FETCH_EVENT_DEALS_BY_PRICE_ID,
  FETCH_PRICE_BY_ID,
  FETCH_PRICES_BY_EVENT_ID,
} from "./logic";
import LoadingIcon from "../Btn/LoadingIcon";
import Subprices from "./Subprices";
import messages from "../../i18n/messages.js";

import { useQuery } from "@apollo/react-hooks";

import PriceForm from "./PriceForm";
import { classNames } from "../../utils/misc";
import Tooltip, { Placement } from "../Tooltip/Tooltip";
import { setMsg } from "../Toaster/logic";
import { useDispatch } from "react-redux";

export const PriceFormWrap = () => {
  const navigate = useNavigate();
  const { id: eventId, priceId } = useParams();
  const { error, data } = useQuery(FETCH_PRICE_BY_ID, {
    variables: { id: priceId },
  });
  const handleClose = () => {
    navigate(`/events/${eventId}/prices`);
  };
  if (error) return <div>{error}</div>;
  if (!data || !data.price)
    return (
      <div>
        <LoadingIcon size={24} />
      </div>
    );
  const price = data && data.price ? data.price : null;

  return <PriceForm price={price} handleClose={handleClose} />;
};

export const SubpricesWrap = () => {
  const { priceId } = useParams();
  const { error, data } = useQuery(FETCH_PRICE_BY_ID, {
    variables: { id: priceId },
    skip: !priceId,
  });
  if (error) return <div>{error}</div>;

  const price = data && data.price ? data.price : null;
  return <Subprices parent={price} />;
};

export const DealsWrap = () => {
  const { priceId } = useParams();
  const { error, data } = useQuery(FETCH_EVENT_DEALS_BY_PRICE_ID, {
    variables: { id: priceId },
  });
  if (error) return <div>{error}</div>;

  const price = data && data.price ? data.price : null;
  return <Subprices parent={price} />;
};

export default function NewPrice() {
  const [show, setShow] = useState(false);
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const { id: eventId, priceId, ...rest } = useParams();
  const isInSubpriceMode = rest["*"]?.includes("subprice");

  const [deletePrice, { loading: deleting }] = useMutation(DELETE_PRICE, {
    refetchQueries: [
      { query: FETCH_PRICES_BY_EVENT_ID, variables: { event_id: eventId } },
    ],
  });
  const navigate = useNavigate();
  const focusFieldRef = useRef(null);
  const { error, data } = useQuery(FETCH_PRICE_BY_ID, {
    variables: { id: priceId },
  });
  const handleClose = () => {
    setShow(false);
    navigate(`/events/${eventId}/prices`);
  };

  const handleDelete = async () => {
    try {
      await deletePrice({ variables: { id: priceId } });
      dispatch(setMsg({ title: "price deleted", level: "success" }));
      handleClose();
    } catch (e) {
      // @ts-ignore
      dispatch(setMsg({ title: "ERROR", level: "error", desc: e.message }));
    }
  };

  useEffect(() => setShow(true), []);

  if (error) return <div>{error}</div>;

  const price = data && data.price ? data.price : null;
  const path = window.location.href;

  if (!price) return <div>not found</div>;

  let priceTitle = price.name;
  if (price.deleted_at) priceTitle += ` [${f(messages.deleted).toUpperCase()}]`;

  return (
    <Transition.Root show={show} as={Fragment}>
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
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-lg sm:w-full"
              style={{ minHeight: "600px" }}
            >
              <div
                className={classNames(
                  "sm:flex sm:items-start p-4 sm:p-6 pb-0 sm:pb-0",
                  price && price.deleted_at
                    ? "bg-red-200 text-red-800"
                    : "text-brand-600"
                )}
              >
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium"
                  >
                    <div className="flex align-center">
                      <div
                        className="w-5 h-5 block mr-3 rounded-full cursor-pointer"
                        style={{ backgroundColor: price.color }}
                      />
                      <div>{priceTitle}</div>
                    </div>
                  </Dialog.Title>
                </div>
                <Tooltip
                  content={f(messages.deletePriceDesc)}
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

              <div className="p-6">
                {!isInSubpriceMode ? (
                  <div className="flex space-x-2 mb-8">
                    <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                      <Link
                        to={`/events/${eventId}/prices/edit/${priceId}`}
                        className={classNames(
                          path.split(priceId || "").length < 2
                            ? "border-brand-500 text-brand-500"
                            : "text-gray-500 border-gray-200 hover:text-gray-700",
                          "px-3 py-1 border-2 font-normal text-sm rounded-full outline-none"
                        )}
                        aria-current={
                          path.includes("/priceform") ? "page" : undefined
                        }
                      >
                        {f(messages.editPrice)}
                      </Link>
                      <Link
                        to={`/events/${eventId}/prices/edit/${priceId}/deals`}
                        className={classNames(
                          path.includes("deals")
                            ? "border-brand-500 text-brand-500"
                            : "text-gray-500  border-gray-200 hover:text-gray-700",
                          "px-3 py-1 border-2 font-normal text-sm rounded-full outline-none flex items-center"
                        )}
                        aria-current={
                          path.includes("deals") ? "page" : undefined
                        }
                      >
                        <div className="">{f(messages.deals)}</div>
                        <div className="ml-2 rounded-full border border-gray-300 text-gray-600 text-xs py-1 px-2 leading-none">
                          0
                          {/* {dealsData && dealsData.prices
                          ? dealsData.prices.length
                          : 0} */}
                        </div>
                      </Link>
                    </nav>
                  </div>
                ) : null}
                <Outlet />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
