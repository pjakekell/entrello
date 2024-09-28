import React, { Fragment, useRef } from "react";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import * as Yup from "yup";

// import { oidFromJWT, FETCH_ORG_BY_ID } from "../Org/logic";

import messages from "../../i18n/messages";

import { useSeatGroup } from "../../hooks/useSeatGroup";
// @ts-ignore @headlessui/react@dev has no up-to-date type defs
import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_EVENT_BY_ID } from "../Event/logic";
import InputField from "../FormHelpers/InputField";
import { useParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import range from "lodash/range";
import { ISeat } from "../Spl/interfaces";
import SeatGroupInput from "../FormHelpers/SeatGroupInput";
import { useDispatch, useSelector } from "react-redux";
import { setSeatCandidates, selectSeatCandidates } from "../Spl/logic";
import { drawSeats } from "./tools/draw_seat";
import { SEAT_WIDTH, SEAT_BORDER_WIDTH } from "./tools/seat_dimensions";

// const NEW_SEAT_SPACE_Y = 300;

interface IAddSeatsModal {
  open: boolean;
  handleClose: Function;
}

export default function AddSeatsModal({ open, handleClose }: IAddSeatsModal) {
  const { formatMessage: f } = useIntl();
  const seatCandidates = useSelector(selectSeatCandidates);
  const focusFieldRef = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { error, data } = useQuery(FETCH_EVENT_BY_ID, {
    variables: { id },
  });
  const event = data.event;
  if (!event || error) {
    console.error(error);
  }
  const validationSchema = Yup.object().shape({
    qty: Yup.number().min(1).required(f(messages.qtyRequired)),
    seat_group_id: Yup.string().required(f(messages.seatGroupRequired)),
  });
  const sgrIDs: Array<string> = [];
  const [seatGroup] = useSeatGroup(sgrIDs[0]);
  const formik = useFormik({
    initialValues: {
      qty: seatCandidates ? seatCandidates.length : 2,
      section_id: seatGroup && seatGroup.parent_id ? seatGroup.parent_id : null,
      seat_group_id: sgrIDs && sgrIDs.length === 1 ? sgrIDs[0] : null,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  async function onSubmit() {
    if (isEmpty(formik.values.seat_group_id) || formik.values.qty < 1) return;

    if (seatCandidates && seatCandidates.length > 0) {
      drawSeats(seatCandidates, true);
      handleClose();
      return;
    }

    const seats: ISeat[] = range(formik.values.qty).map(
      (c: number): ISeat => ({
        seat_group_id: formik.values.seat_group_id,
        num: c + 1,
        x: 1000 + (SEAT_WIDTH + SEAT_BORDER_WIDTH) * (c + 1),
        y: 1000,
        status_code: 0,
      })
    );
    dispatch(setSeatCandidates(seats));
    if (!sgrIDs || sgrIDs.length < 1) drawSeats(seats, true);
    handleClose();
    // try {
    //   const {
    //     data: { createEvent: event },
    //   } = await createEvent({
    //     variables: {
    //       ...formik.values,
    //     },
    //   });
    //   console.log("ev", event);
    // } catch (e) {
    //   console.log("caught", e);
    // }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={focusFieldRef}
        open={open}
        onClose={() => handleClose()}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-brand-600"
                  >
                    {f(messages.addSeats)}
                  </Dialog.Title>
                </div>
                <div
                  className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                  onClick={() => handleClose()}
                >
                  <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                </div>
              </div>
              <div>
                <form>
                  <div>
                    <InputField
                      formik={formik}
                      refField={focusFieldRef}
                      number
                      name="qty"
                      label={f(messages.qtySeats)}
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
                  </div>
                </form>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-600 text-base font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:w-auto sm:text-sm"
                  disabled={
                    !formik.values.seat_group_id || formik.values.qty < 1
                  }
                  onClick={() => onSubmit()}
                >
                  {f(messages.addSeats)}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleClose(false)}
                >
                  {f(messages.cancel)}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
