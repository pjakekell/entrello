import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import {
  selectActiveSeatIds,
  UPDATE_SEATS,
  DELETE_SEATS,
  setSeatCandidates,
} from "./logic";
import { useHotkeys } from "react-hotkeys-hook";
import { deleteSvgSeats } from "./tools/seat_active_toggles";
import isEmpty from "lodash/isEmpty";
import { IEvent } from "../Event/interfaces";
import { ISeat } from "../Spl/interfaces";

import messages from "../../i18n/messages.js";
import InputField from "../FormHelpers/InputField";
import SeatGroupInput from "../FormHelpers/SeatGroupInput";
import { useDispatch, useSelector } from "react-redux";
import LoadingBtn from "../Btn/LoadingBtn";
import { useMutation } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";

const SplSeatInfo = ({ event }: { event: IEvent }) => {
  const { formatMessage: f } = useIntl();
  const focusFieldRef = useRef(null);
  const dispatch = useDispatch();
  const activeSeatIds = useSelector(selectActiveSeatIds);
  const [updateSeats, { loading }] = useMutation(UPDATE_SEATS);
  const [deleteSeats, { loading: loadingDelete }] = useMutation(DELETE_SEATS);
  const seats: ISeat[] = [];
  useHotkeys(
    "del, backspace",
    () => {
      handleDeleteSeats();
    },
    [activeSeatIds]
  );

  if (event.seating_plan && event.seating_plan.seats.length > 0)
    event.seating_plan.seats.forEach((seat: ISeat) => {
      if (activeSeatIds.includes(seat.id)) seats.push(seat);
    });

  const firstSeat: ISeat = seats[0];
  const firstSeatSectionID =
    firstSeat && firstSeat.fmt_positions && firstSeat.fmt_positions.length === 3
      ? firstSeat.fmt_positions[2].id
      : null;
  const firstSeatSgrID =
    firstSeat && firstSeat.fmt_positions && firstSeat.fmt_positions.length === 3
      ? firstSeat.fmt_positions[1].id
      : null;

  const handleSubmit = async () => {
    try {
      if (!event.seating_plan) return;

      updateSeats({
        variables: {
          input: {
            seating_plan_id: event.seating_plan.id,
            seats: seats.map((seat: ISeat) => ({
              id: seat.id,
              x: seat.x,
              y: seat.y,
              price_id: seat.price_id,
              num: seats.length === 1 ? formik.values.num : seat.num,
              seat_group_id: formik.values.seat_group_id,
            })),
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  async function handleDeleteSeats() {
    if (!event || !event.seating_plan) return;

    if (activeSeatIds.length < 1) return;

    const variables = {
      seat_ids: activeSeatIds,
      seating_plan_id: event.seating_plan.id,
    };
    try {
      await deleteSeats({
        variables,
      });
      deleteSvgSeats(activeSeatIds);
      dispatch(setSeatCandidates([]));
    } catch (e) {
      console.error(e);
    }
  }

  const formik = useFormik({
    initialValues: firstSeat
      ? {
          num: activeSeatIds.length === 1 ? firstSeat.num : "-",
          section_id: firstSeatSectionID,
          seat_group_id: firstSeatSgrID,
        }
      : { section_id: null, num: null, seat_group_id: null },
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const editMode = window.location.pathname.includes("/spl/edit");

  if (!event.seating_plan || seats.length < 1) return <></>;

  return (
    <>
      {activeSeatIds && activeSeatIds.length > 0 && editMode ? (
        <div className="p-4 mt-1 text-xs text-left bg-gray-50 opacity-90 rounded-sm shadow text-gray-600 hover:opacity-1 hover:text-black">
          <div className="my-1 font-medium">{f(messages.seatInfo)}</div>
          <InputField
            formik={formik}
            refField={focusFieldRef}
            number
            disabled={activeSeatIds.length > 1}
            name="num"
            label={f(messages.seatNum)}
          />
          <SeatGroupInput
            formik={formik}
            name="section_id"
            className="mt-4"
            seating_plan_id={event.seating_plan.id}
            label={f(messages.section)}
          />
          <SeatGroupInput
            formik={formik}
            name="seat_group_id"
            disabled={isEmpty(formik.values.section_id)}
            parent_id={formik.values.section_id}
            seating_plan_id={event.seating_plan.id}
            label={f(messages.row)}
          />
          <div className="flex items-center justify-between">
            <LoadingBtn onClick={handleSubmit} loading={loading}>
              {f(messages.save)}
            </LoadingBtn>
            <LoadingBtn
              onClick={handleDeleteSeats}
              loading={loadingDelete}
              color="none"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="w-4 h-4 text-brand-500"
              />
            </LoadingBtn>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SplSeatInfo;
