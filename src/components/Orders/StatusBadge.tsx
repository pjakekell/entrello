import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import FormattedDuration from "../FormattedDuration";
import { classNames } from "../../utils/misc";

interface IStatusBadge {
  intent: "claim" | "booked" | "paid" | "invoiced" | "pending" | "refunded";
  expires_at?: Date | null;
}

interface IExpiryCountdown {
  value: Date | null;
}

const ExpiryCountdown = ({ value }: IExpiryCountdown) => {
  const { formatMessage: f } = useIntl();

  if (!value) return <span className="text-red-600">INVALID DATE</span>;

  const d = value.getTime() - new Date().getTime();
  if (d < 0) {
    return (
      <span className="text-yellow-600 font-bold">{f(messages.expired)}</span>
    );
  }
  return <FormattedDuration value={value.getTime()} />;
};

export default function StatusBadge({ intent, expires_at }: IStatusBadge) {
  const { formatMessage: f } = useIntl();
  //@ts-ignore
  const msg = messages[intent];
  const css: any = {
    claim: "bg-gray-200 text-gray-800 border-gray-300",
    invoiced: "bg-green-200 text-green-800 border-green-300",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    refunded: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-green-500 text-white border-green-500",
    booked: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center border px-2.5 py-1 leading-none rounded-full text-xs font-medium uppercase mx-1",
        css[intent]
      )}
    >
      {intent === "claim" && expires_at ? (
        <ExpiryCountdown value={expires_at} />
      ) : (
        f(msg)
      )}
    </span>
  );
}
