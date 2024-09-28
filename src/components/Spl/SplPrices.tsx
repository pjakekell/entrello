import React from "react";
import Error from "../Error";
import { useQuery } from "@apollo/react-hooks";
import { useIntl } from "react-intl";
import { IPrice } from "../Prices/interfaces";
import { IEvent } from "../Event/interfaces";
import { FETCH_PRICES_BY_EVENT_ID } from "../Prices/logic";
import NumberFormat from "react-number-format";
import { assignPriceToActiveSeats, selectActiveSeatIds } from "./logic";
import { setPriceIdForSeats } from "./tools/draw_seat";

import messages from "../../i18n/messages.js";
import { useSelector } from "react-redux";

interface ISplPrices {
  event: IEvent;
}

interface ISplPriceItem {
  price: IPrice;
  splId: string;
}

const SplPriceItem = ({ price, splId }: ISplPriceItem) => {
  const seatIds: [string] = useSelector(selectActiveSeatIds);
  const handleAssignPrice = () => {
    setPriceIdForSeats(price.id);
    assignPriceToActiveSeats(splId, price.id, seatIds);
  };

  return (
    <tr
      className="align-middle hover:bg-gray-100 cursor-pointer"
      onClick={handleAssignPrice}
    >
      <td className="p-2 whitespace-nowrap">
        <div className="flex align-center">
          <div
            className="rounded-full w-4 h-4 mr-1"
            style={{
              backgroundColor: price.color || "#aaa",
              marginTop: "-0.05rem",
            }}
          />
          <div className="font-medium text-gray-900">{price.name}</div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap text-gray-500">
        <NumberFormat
          value={price.value / 100.0}
          thousandSeparator=" "
          decimalSeparator=","
          fixedDecimalScale
          decimalScale={2}
          displayType="text"
          prefix="€ "
        />
      </td>
    </tr>
  );
};

const SplPrices = ({ event }: ISplPrices) => {
  const { formatMessage: f } = useIntl();
  const activeSeatIds = useSelector(selectActiveSeatIds);
  const { loading, error, data } = useQuery(FETCH_PRICES_BY_EVENT_ID, {
    variables: { event_id: event.id },
  });
  if (loading) return <div>loading...</div>;
  if (error) return <Error error={error} />;

  const prices = data ? data.prices : null;
  const splId = event.seating_plan && event.seating_plan.id;
  const editMode = window.location.pathname.includes("/spl/edit");

  if (!splId) return <Error error={{ message: "no seating plan provided" }} />;

  return (
    <>
      <style>
        {prices &&
          prices.map(
            (price: IPrice) =>
              `.${price.id} circle { fill: ${price.color || "white"} }`
          )}
      </style>
      {activeSeatIds && activeSeatIds.length > 0 && editMode ? (
        <div className="p-4 mt-1 text-xs text-left bg-gray-50 opacity-90 rounded-sm shadow text-gray-600 hover:opacity-1 hover:text-black">
          <div className="my-1 font-medium">{f(messages.prices)}</div>
          <table className="min-w-full divide-y divide-gray-200">
            <tbody>
              {prices &&
                prices.map((price: IPrice) => (
                  <SplPriceItem key={price.id} price={price} splId={splId} />
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
};

export default SplPrices;
