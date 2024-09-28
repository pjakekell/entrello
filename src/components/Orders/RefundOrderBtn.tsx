import React, { useState } from "react";

import messages from "../../i18n/messages";
import { IOrder } from "./interfaces";
import { useIntl } from "react-intl";
import Tooltip, { Placement } from "../Tooltip/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/pro-solid-svg-icons/faUndo";

interface ISellOrderBtn {
  order: IOrder;
}

const RefundOrder = ({ order }: ISellOrderBtn) => {
  const [open, setOpen] = useState(false);
  const { formatMessage: f } = useIntl();

  const handleToggleOpen = () => setOpen(!open);

  return (
    <div>
      <Tooltip placement={Placement.left} content={f(messages.refundOrder)}>
        <div
          className="border-2 border-yellow-400 p-2 rounded hover:bg-yellow-400 group cursor-pointer flex items-center justify-center"
          onClick={handleToggleOpen}
        >
          <FontAwesomeIcon
            icon={faUndo}
            className="w-6 h-6 text-yellow-500 group-hover:text-white"
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default RefundOrder;
