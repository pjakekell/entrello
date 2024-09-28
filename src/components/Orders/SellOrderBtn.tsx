import React from "react";

import messages from "../../i18n/messages";
import { useIntl } from "react-intl";
import Tooltip, { Placement } from "../Tooltip/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister } from "@fortawesome/pro-regular-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

const SellOrderBtn = () => {
  const { formatMessage: f } = useIntl();

  const location = useLocation();
  const navigate = useNavigate();

  const handleOpen = () => navigate(`${location.pathname}/sell`);

  return (
    <div>
      <Tooltip placement={Placement.left} content={f(messages.sellOrder)}>
        <div
          className="border-2 border-brand-500 pt-2 pb-1 px-2 rounded hover:bg-brand-500 group cursor-pointer"
          onClick={handleOpen}
        >
          <FontAwesomeIcon
            icon={faCashRegister}
            className="w-5 h-5 text-brand-600 group-hover:text-white"
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default SellOrderBtn;
