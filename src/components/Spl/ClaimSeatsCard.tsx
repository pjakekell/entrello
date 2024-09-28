import React, { useEffect } from "react";
import { selectActiveSeatIds, setActiveTool, setChangedSeats } from "./logic";
import { FULL_ORDER_FRAGMENT } from "../Orders/logic";
import { deselectAllSeats } from "./events/mouse";
import { getApolloClient } from "../../apollo-client";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FETCH_EVENT_BY_ID, EVENT_STATUS_ON_SALE } from "../Event/logic";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { XIcon } from "@heroicons/react/outline";
import { revertChangedSeats } from "./tools/draw_seat";
import LoadingIcon from "../Btn/LoadingIcon";
import { ISeat } from "./interfaces";
import { pick } from "lodash";
import { getSvgSeatData } from "./tools/draw_seat";
import { classNames } from "../../utils/misc";
import { useCreateSplOrder } from "../../hooks/useCreateSplOrder";

export const getActiveSvgSeats = (seatIds: [string]) => {
  const client: any = getApolloClient();
  return seatIds.map((seatID: string) => {
    const seat: ISeat = client.cache.data.data[`Seat:${seatID}`];
    const svgSeat: ISeat | null = getSvgSeatData(seatID);
    if (!svgSeat) throw Error(`seat not found in svg:${seatID}`);

    seat.x = svgSeat.x;
    seat.y = svgSeat.y;
    return pick(seat, "x", "y", "num", "id", "seat_group_id", "price_id");
  });
};

const getSeatsAvailable = (seatIDs: [string]) => {
  if (seatIDs.length < 1) return false;

  const seat1 = window.document.getElementById(seatIDs[0]);
  if (!seat1 || !seat1.classList.contains("status-0")) return false;

  return true;
};

const ClaimSeatsCard = () => {
  const client = getApolloClient();
  const seatIDs = useSelector(selectActiveSeatIds);
  const [createOrder, { loading, error }] = useCreateSplOrder(false);
  const { id } = useParams();
  const fetchEventByIdQuery = {
    query: FETCH_EVENT_BY_ID,
    variables: { id },
  };
  const { event }: any = client.readQuery(fetchEventByIdQuery);

  const seatsAvailable = getSeatsAvailable(seatIDs);
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof Element) {
      const el: Element = e.target;
      if (el.closest("[role=dialog]")) return;
    }
    if (e.key === "Enter" && seatsAvailable) {
      handleClaimSeats();
    }
    if (e.key === "Escape") {
      deselectAllSeats();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (seatIDs.length < 1 || !seatsAvailable) return <></>;

  const handleCancelNewCandidates = () => {
    dispatch(setChangedSeats(0));
    dispatch(setActiveTool("select"));
    revertChangedSeats();
  };

  const handleClaimSeats = async () => {
    if (!event || !event.seating_plan) {
      throw new Error(
        "missing event or event seating plan. cannot create seats"
      );
    }
    const seats = getActiveSvgSeats(seatIDs);

    const items = seats.map((seat) => ({
      event_id: event.id,
      seat_id: seat.id,
      qty: 1,
      price_id: seat.price_id,
    }));
    const res = await createOrder({
      variables: { items },
    });
    if (res && res.data && res.data.CreateOrder) {
      const order = res.data.CreateOrder;
      client.writeFragment({
        id: `Order:${order.id}`,
        fragment: FULL_ORDER_FRAGMENT,
        fragmentName: "Order",
        data: order,
      });
    }
    dispatch(setChangedSeats(0));
    // deselectAllSeats();
  };

  return (
    <div className="flex justify-center items-center text-xs">
      <div
        className={classNames(
          "text-xs mr-2 text-white rounded px-4 py-2 font-bold border cursor-pointer",
          (event.status_code & EVENT_STATUS_ON_SALE) === 1
            ? "bg-indigo-500 hover:bg-indigo-600 border-indigo-500"
            : "bg-gray-400 border-gray-300"
        )}
        onClick={
          (event.status_code & EVENT_STATUS_ON_SALE) === 1
            ? handleClaimSeats
            : handleCancelNewCandidates
        }
      >
        {!error && loading ? <LoadingIcon /> : null}
        {!error &&
        !loading &&
        (event.status_code & EVENT_STATUS_ON_SALE) === 0 ? (
          <>
            <span className="font-bold">{f(messages.eventNotOnSale)}</span>
            <span className="ml-2 text-2xs">[ESC]</span>
          </>
        ) : null}
        {!error &&
        !loading &&
        (event.status_code & EVENT_STATUS_ON_SALE) !== 0 ? (
          <>
            <span className="font-bold">
              {f(messages.claimSeats, { qty: seatIDs.length })}
            </span>
            <span className="ml-2 text-2xs">[ENTER]</span>
          </>
        ) : null}
      </div>
      <div
        className="py-2 px-4 flex items-center cursor-pointer hover:border-gray-400 border border-transparent group rounded"
        onClick={handleCancelNewCandidates}
      >
        <XIcon className="w-5 h-5 text-gray-400 group-hover:text-yellow-500" />
        <div className="text-gray-400 font-bold ml-1 text-2xs group-hover:text-yellow-500">
          [ESC]
        </div>
      </div>
    </div>
  );
};

export default ClaimSeatsCard;
