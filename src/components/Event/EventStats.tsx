import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages.js";
import { IEvent } from "./interfaces";
import { TicketIcon } from "@heroicons/react/outline";
import NumberFormat from "react-number-format";

interface IEventStats {
  event: IEvent;
}

interface IStatusNumber {
  booked: number;
  claimed: number;
  valueOff?: number;
  icon: any;
}

const StatusNumber = ({ booked, claimed, valueOff, icon }: IStatusNumber) => {
  return (
    <div className="flex items-center text-gray-500">
      <div className="mr-2">{icon}</div>
      <div className="text-xs flex">
        <NumberFormat
          value={booked}
          thousandSeparator=" "
          decimalSeparator=","
          fixedDecimalScale
          decimalScale={0}
          displayType="text"
        />
        <span className="text-gray-400 ml-0.5 text-2xs">
          +
          <NumberFormat
            value={claimed}
            thousandSeparator=" "
            decimalSeparator=","
            fixedDecimalScale
            decimalScale={0}
            displayType="text"
          />
        </span>
        {valueOff ? (
          <div>
            <span className="mx-1">/</span>
            <NumberFormat
              value={valueOff}
              thousandSeparator=" "
              decimalSeparator=","
              fixedDecimalScale
              decimalScale={0}
              displayType="text"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const EventStats = ({ event }: IEventStats) => {
  const { formatMessage: f } = useIntl();

  return (
    <div className="my-3">
      <label className="text-2xs uppercase text-gray-400">
        {f(messages.levelOfBookings)}
      </label>
      <div className="mb-2">
        <StatusNumber
          icon={<TicketIcon className="w-4 h-4" />}
          booked={event.totals.booked}
          claimed={event.totals.claimed}
          valueOff={event.totals.total}
        />
      </div>
    </div>
  );
};

export default EventStats;
