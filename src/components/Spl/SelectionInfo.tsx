import React, { useEffect } from "react";
import {
  selectActiveSeatIds,
  selectSeatCandidates,
  selectChangedSeatsQty,
  setActiveTool,
  setSeatCandidates,
  setChangedSeats,
  CREATE_SEATS,
  UPDATE_SEATS,
  SEAT_FRAGMENT,
} from "./logic";
import { deselectAllSeats } from "./events/mouse";
import { getApolloClient } from "../../apollo-client";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { FETCH_EVENT_BY_ID } from "../Event/logic";
import { useIntl } from "react-intl";
import { client } from "../../apollo-client";
import messages from "../../i18n/messages";
import CmdKey from "./CmdKey";
import EditingKeys from "./EditingKeys";
import OptionIcon from "../Btn/OptionIcon";
import MouseIcon from "../Btn/MouseIcon";
import MacCmdIcon from "../Btn/MacCmdIcon";
import { XIcon } from "@heroicons/react/outline";
import { removeTmpSeatCandidates, revertChangedSeats } from "./tools/draw_seat";
import { useMutation } from "@apollo/react-hooks";
import LoadingIcon from "../Btn/LoadingIcon";
import { ISeat } from "./interfaces";
import { setMsg } from "../Toaster/logic";
import SplPrices from "./SplPrices";
import SplSeatInfo from "./SplSeatInfo";
import { getSvgSeatData } from "./tools/draw_seat";
import { pick } from "lodash";
import ClaimSeatsCard from "./ClaimSeatsCard";

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

const Card = ({ label, value }: any) => (
  <div className="py-1 px-4 w-1/3 md:w-36 flex justify-center items-center text-xs">
    <div className="text-xs mr-2">{label}:</div>
    <div className="font-bold">{value}</div>
  </div>
);

const syncedSeatsWithSvg = (seats: ISeat[]): ISeat[] => {
  const svgSeats = document.querySelectorAll(".tmp-spl-seat-candidate");
  if (svgSeats.length !== seats.length)
    throw new Error("svg seats have different length than seats in store");

  return seats.map((seat: ISeat, i: number) => {
    const x = svgSeats[i].getAttribute("x");
    const y = svgSeats[i].getAttribute("y");
    seat.x = x && x.length > 0 ? parseInt(x) : 0;
    seat.y = y && y.length > 0 ? parseInt(y) : 0;
    seat.price_id = svgSeats[i].getAttribute("price-id");
    delete seat.duplicate;
    return seat as ISeat;
  });
};

const SaveChangedSeatsCard = () => {
  const client = getApolloClient();
  const qty = useSelector(selectChangedSeatsQty);
  const seatIDs = useSelector(selectActiveSeatIds);
  const [updateSeats, { loading, error }] = useMutation(UPDATE_SEATS);
  const { id } = useParams();
  const fetchEventByIdQuery = {
    query: FETCH_EVENT_BY_ID,
    variables: { id },
  };
  const { event }: any = client.readQuery(fetchEventByIdQuery);

  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof Element) {
      const el: Element = e.target;
      if (el.closest("[role=dialog]")) return;
    }
    if (e.key === "Enter") {
      handleSaveChangedSeats();
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

  if (qty < 1) return <></>;

  const handleCancelNewCandidates = () => {
    dispatch(setChangedSeats(0));
    dispatch(setActiveTool("select"));
    revertChangedSeats();
  };

  const handleSaveChangedSeats = async () => {
    if (!event || !event.seating_plan) {
      throw new Error(
        "missing event or event seating plan. cannot create seats"
      );
    }
    const seats = getActiveSvgSeats(seatIDs);

    const input = {
      seats,
      seating_plan_id: event.seating_plan.id,
    };
    const { data } = await updateSeats({
      variables: { input },
    });
    if (data && data.UpdateSeats) {
      data.UpdateSeats.forEach((seat: ISeat) => {
        client.writeFragment({
          id: `Seat:${seat.id}`,
          fragment: SEAT_FRAGMENT,
          data: seat,
        });
      });
    }
    dispatch(setChangedSeats(0));
    // deselectAllSeats();
  };

  return (
    <div className="flex justify-center items-center text-xs">
      <div
        className="text-xs mr-2 bg-brand-500 text-white rounded px-4 py-2 font-bold border border-brand-500 cursor-pointer hover:bg-brand-600"
        onClick={handleSaveChangedSeats}
      >
        {error && !loading ? (
          <div className="text-red-600">
            {error.message ? error.message : null}
          </div>
        ) : null}
        {!error && loading ? (
          <LoadingIcon />
        ) : (
          <>
            <span className="font-bold">
              {f(messages.saveChangedSeatsQty, { qty })}
            </span>
            <span className="ml-2 text-2xs">[ENTER]</span>
          </>
        )}
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

const NewSeatsCard = () => {
  const seats: ISeat[] = useSelector(selectSeatCandidates);
  const { id } = useParams();
  const fetchEventByIdQuery = {
    query: FETCH_EVENT_BY_ID,
    variables: { id },
  };
  const { event }: any = client.readQuery(fetchEventByIdQuery);

  const [createSeats, { loading, error }] = useMutation(CREATE_SEATS);
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveNewCandidates();
    }
    if (e.key === "Escape") {
      handleCancelNewCandidates();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (error && error.message) {
    dispatch(setMsg({ title: error.message }));
  }
  if (seats && seats.length < 1) return <></>;

  const handleCancelNewCandidates = () => {
    dispatch(setSeatCandidates([]));
    dispatch(setActiveTool("select"));
    removeTmpSeatCandidates();
  };

  const handleSaveNewCandidates = async () => {
    if (!event || !event.seating_plan) {
      throw new Error(
        "missing event or event seating plan. cannot create seats"
      );
    }

    const input = {
      duplicate: seats.length > 0 ? seats[0].duplicate : false,
      seats: syncedSeatsWithSvg(seats),
      seating_plan_id: event.seating_plan.id,
    };
    await createSeats({
      variables: { input },
      refetchQueries: [fetchEventByIdQuery],
    });

    dispatch(setSeatCandidates([]));
    dispatch(setChangedSeats(0));
    removeTmpSeatCandidates();
  };

  return (
    <div className="flex justify-center items-center text-xs">
      {loading ? (
        <div>
          <LoadingIcon /> {f(messages.saving)} ...
        </div>
      ) : (
        <>
          <div
            className="text-xs mr-2 bg-brand-500 text-white rounded px-4 py-2 font-bold border border-brand-500 cursor-pointer hover:bg-brand-600"
            onClick={handleSaveNewCandidates}
          >
            <span className="font-bold">
              {f(messages.createNewSeatsQty, { qty: seats.length })}
            </span>
            <span className="ml-2 text-2xs">[ENTER]</span>
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
        </>
      )}
    </div>
  );
};

const Shortcuts = () => {
  const { formatMessage: f } = useIntl();
  const isEditing = useMatch("/events/:id/spl/edit");
  return (
    <div className="p-4 text-sm text-left bg-gray-50 opacity-90 rounded-sm shadow text-gray-600 hover:opacity-1 hover:text-black">
      <div className="my-1 small text-uppercase">{f(messages.commandKeys)}</div>
      <CmdKey label="A" desc={f(messages.selectAllSeats)} />
      {isEditing ? <EditingKeys /> : null}
      <CmdKey label="ESC" desc={f(messages.unselectAll)} />
      <CmdKey
        label={<OptionIcon className="text-gray-400 w-4 h-4" />}
        label2={<MouseIcon className="text-gray-800 w-4 h-4" />}
        desc={f(messages.moveViewport)}
      />
      <CmdKey
        label={<MacCmdIcon className="text-gray-400 w-4 h-4" />}
        label2={<MouseIcon className="text-gray-800 w-4 h-4" />}
        desc={f(messages.addToSelection)}
      />
    </div>
  );
};

export default function SelectionInfo() {
  const activeSeatIds = useSelector(selectActiveSeatIds);
  const changedSeatsQty = useSelector(selectChangedSeatsQty);
  const newSeatCandidates = useSelector(selectSeatCandidates);
  const { formatMessage: f } = useIntl();
  const { id } = useParams();

  const { event }: any = client.readQuery({
    query: FETCH_EVENT_BY_ID,
    variables: { id },
  });

  const total = [];
  total.push(event.seating_plan.seats.length);
  if (newSeatCandidates && newSeatCandidates.length > 0) {
    total.push(" + ");
    total.push(newSeatCandidates.length);
  }

  const editMode = window.location.pathname.includes("/spl/edit");

  const workingWithSelectedSeats =
    (!newSeatCandidates || newSeatCandidates.length < 1) &&
    changedSeatsQty &&
    changedSeatsQty > 0;
  return (
    <div>
      <div className="absolute top-20 right-2 hidden md:block">
        <Shortcuts />
        <SplPrices event={event} />
        <SplSeatInfo event={event} />
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
        <div className="flex p-2 items-center text-sm text-left bg-gray-50 opacity-90 rounded-sm shadow text-gray-600 hover:opacity-1 hover:text-black divide-x divide-gray-300 divide-solid">
          {!editMode ? <ClaimSeatsCard /> : null}
          {workingWithSelectedSeats ? <SaveChangedSeatsCard /> : null}
          {newSeatCandidates && newSeatCandidates.length > 0 ? (
            <NewSeatsCard />
          ) : (
            <>
              <Card
                label={f(messages.selectedSeats)}
                value={activeSeatIds.length}
              />
              <Card
                label={f(messages.avlSeats)}
                value={event.totals.total - event.totals.booked}
              />
            </>
          )}
          <Card label={f(messages.totalSeats)} value={total.join(" ")} />
        </div>
      </div>
    </div>
  );
}
