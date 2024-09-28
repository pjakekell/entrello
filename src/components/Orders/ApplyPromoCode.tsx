import React from "react";
import { IOrder } from "./interfaces";
import Btn from "../Btn/Btn";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";

interface IRedeemVoucher {
  order: IOrder;
}

export default function ApplyPromoCode({ order }: IRedeemVoucher) {
  const { formatMessage: f } = useIntl();

  return (
    <div>
      <Btn sm outline color="purple-info">
        {f(messages.applyPromoCode)}
      </Btn>
    </div>
  );
}
