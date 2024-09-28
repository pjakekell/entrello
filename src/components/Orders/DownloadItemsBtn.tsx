import React from "react";

import messages from "../../i18n/messages";
import { useIntl } from "react-intl";
import Tooltip, { Placement } from "../Tooltip/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faTicketAlt } from "@fortawesome/pro-regular-svg-icons";
import { IOrder } from "./interfaces";

const DownloadItemsBtn = ({ order }: { order: IOrder }) => {
  const { formatMessage: f } = useIntl();
  const token = localStorage.getItem("t") || "";

  const voucherOrTickets =
    order.order_items && order.order_items[0] && order.order_items[0].voucher_id
      ? "voucher"
      : "tickets";

  const handleOpen = () =>
    (window.location.href = `${process.env.REACT_APP_REST_ENDPOINT}/orders/${voucherOrTickets}/${order.id}/${token}`);

  const handleOpenInvoice = () =>
    (window.location.href = `${process.env.REACT_APP_REST_ENDPOINT}/orders/invoice/${order.id}/${token}`);

  return (
    <div className="flex items-center">
      <Tooltip
        placement={Placement.bottom}
        content={f(messages.downloadInvoice)}
      >
        <div
          className="pt-2 pb-1.5 px-2.5 group cursor-pointer"
          onClick={handleOpenInvoice}
        >
          <FontAwesomeIcon
            icon={faReceipt}
            className="w-4 h-4 text-gray-500 group-hover:text-brand-500"
          />
        </div>
      </Tooltip>
      <Tooltip placement={Placement.bottom} content={f(messages.download)}>
        <div
          className="pt-2 pb-1.5 px-2.5 group cursor-pointer"
          onClick={handleOpen}
        >
          <FontAwesomeIcon
            icon={faTicketAlt}
            className="w-4 h-4 text-gray-500 group-hover:text-brand-500"
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default DownloadItemsBtn;
