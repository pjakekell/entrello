import React, { useEffect, useState, useMemo } from "react";
import { useIntl } from "react-intl";
import isFunction from "lodash/isFunction";
import { useMutation } from "@apollo/react-hooks";
import LocationInput from "../FormHelpers/LocationInput";
import Select from "react-select";
import { useQuery } from "@apollo/client";
import {
  CREATE_EVENT,
  FETCH_EVENT_BY_ID,
  UPDATE_EVENT,
  EVENT_FEATURE_ALL_DAY,
  getBitsFrom,
} from "./logic";
import { useFormik } from "formik";
import { IEvent } from "./interfaces";
import * as Yup from "yup";
import InputField from "../FormHelpers/InputField";
import CheckboxField from "../FormHelpers/CheckboxField";
import TimeField from "../FormHelpers/TimeField";
import LoadingBtn from "../Btn/LoadingBtn";
import InsetInputField from "../FormHelpers/InsetInputField";
import HtmlEditor from "../common/HtmlEditor";
// import { Switch } from "@headlessui/react";
// import update from "immutability-helper";
// import { classNames } from "../../utils/misc";
import "dayjs/locale/en";
import { CalendarIcon, UserGroupIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import pick from "lodash/pick";

import messages from "../../i18n/messages";
import { useNavigate, Outlet } from "react-router-dom";
import { DatePicker } from "@mantine/dates";
import { FETCH_PRICE_TEMPLATES } from "../Prices/PriceTemplates/logic";

interface IEditEventForm {
  event: IEvent;
}

// interface IEventReducerState {
//   features: any;
// }

// interface IEventReducerAction {
//   type: string;
//   payload: any | null;
// }

// const initialState = { features: { onlineEvent: false } };

// function reducer(state: IEventReducerState, action: IEventReducerAction) {
//   switch (action.type) {
//     case "TOGGLE_ONLINE_EVENT":
//       return update(state, {
//         features: { $set: { onlineEvent: !state.features.onlineEvent } },
//       });
//     default:
//       throw new Error();
//   }
// }

// const ToggleOnlineEvent = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { formatMessage: f } = useIntl();

//   const handleToggleOnlineEvent = () =>
//     dispatch({ type: "TOGGLE_ONLINE_EVENT", payload: null });

//   return (
//     <div className="py-6">
//       <Routes.Group as="div" className="flex items-center justify-between">
//         <span className="flex-grow flex flex-col">
//           <Routes.Label
//             as="span"
//             className="text-sm font-medium text-gray-900"
//             passive
//           >
//             {f(messages.onlineEvent)}
//           </Routes.Label>
//           <Routes.Description as="span" className="text-sm text-gray-500">
//             {f(messages.onlineEventDesc)}
//           </Routes.Description>
//         </span>
//         <Routes
//           checked={state.features.onlineEvent}
//           onChange={handleToggleOnlineEvent}
//           className={classNames(
//             state.features.onlineEvent ? "bg-brand-600" : "bg-gray-200",
//             "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
//           )}
//         >
//           <span
//             aria-hidden="true"
//             className={classNames(
//               state.features.onlineEvent ? "translate-x-5" : "translate-x-0",
//               "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
//             )}
//           />
//         </Routes>
//       </Routes.Group>
//     </div>
//   );
// };

const DatePickerStyles = {
  weekend: {
    color: "#4F46E5 !important",
  },
  selected: {
    backgroundColor: "rgba(232, 83, 0) !important",
    color: "white !important",
  },
};

let eventConfigNumber = 0b0000000000;

export default function EditEventForm({ event }: IEditEventForm) {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const [createEvent, { loading: creating, error: creationError }] =
    useMutation(CREATE_EVENT);
  const [updateEvent, { loading: updating, error: saveError }] =
    useMutation(UPDATE_EVENT);
  // const [completeDate, setCompleteDate] = useState<Date | undefined>();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("20:00");
  const [editedHtml, setEditedHtml] = useState({});
  const [selectedPriceTemplate, setSelectedPriceTemplate] = useState<any>(null);
  const { data } = useQuery(FETCH_PRICE_TEMPLATES);
  const priceTemplateOptions = useMemo(() => {
    if(!data) return [];
    return data.price_templates.map((item: any) => ({
      ...item,
      value: item.id,
      label: item.name
    }))
  }, [data]);

  const validationSchema = Yup.object().shape({
    starts_at: Yup.date().required(f(messages.dateIsRequired)),
    title: Yup.string().required(f(messages.eventTitle)),
    location_id: Yup.string().required(f(messages.locationIsRequired)),
  });

  const error = creationError || saveError;
  const loading = creating || updating;

  const onSubmit = async () => {
    event.id && event.id.length > 10 ? save() : create();
  };

  const formik = useFormik({
    initialValues: {
      featureOnlineEvent: false,
      featureUnlimitedSeats: false,
      onlineFeatureAllDay: getBitsFrom(eventConfigNumber, 9),
      ...event,
      use_spl: false,
      starts_at:
        event.starts_at && !isFunction(event.starts_at.getTime)
          ? new Date(event.starts_at)
          : event.starts_at,
      description: {},
      price_template_id: undefined,
    },
    validationSchema,
    onSubmit,
  });

  const create = async () => {
    const param = pick(
      formik.values,
      "features",
      "starts_at",
      "location_id",
      "title",
      "subtitle",
      "description",
      "static_total",
      "use_spl"
    );
    let input = {};

    if(!formik.values.use_spl) {
      input = {
        ...param,
        price_template_id: formik.values.price_template_id
      };
    }
    else
      input = param;

    try {
      const { data } = await createEvent({
        variables: {
          input
        },
      });
      if (data.CreateEvent) {
        navigate(`/events/${data.CreateEvent.id}`);
        return;
      }
      console.error("unexpected return value from server", data);
    } catch (e) {
      console.error(e);
    }
  };

  const save = async () => {
    try {
      await updateEvent({
        variables: {
          id: event.id,
          detached: false,
          input: pick(
            formik.values,
            "title",
            "subtitle",
            "starts_at",
            "static_total",
            "description"
          ),
        },
        refetchQueries: [
          {
            query: FETCH_EVENT_BY_ID,
            variables: { id: event.id },
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const value = new Date();
    if (date) {
      const getDay = date?.getDate();
      const getMonth = date?.getMonth();
      const getYear = date?.getFullYear();
      const timeParts = time.split(":");
      const getHour = parseInt(timeParts[0]);
      const getMinutes = parseInt(timeParts[1]);

      value.setDate(getDay);
      value.setMonth(getMonth);
      value.setFullYear(getYear);
      value.setHours(getHour);
      value.setMinutes(getMinutes);
    }
    formik.setFieldValue("starts_at", value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time]);

  useEffect(() => {
    formik.setFieldValue("description", JSON.stringify(editedHtml));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedHtml]);

  const handleBackToEvents = () => navigate("/events");

  const handleChangeUseSpl = () => {
    if (!formik.values.use_spl) {
      formik.setFieldValue("static_total", "0");
    }
    formik.setFieldValue("use_spl", !formik.values.use_spl);
  };

  const renderInfiniteSeatsCornerHint = () => (
    <div className="text-2xs text-gray-500 flex">
      <CheckboxField
        name="featureUnlimitedSeats"
        label={f(messages.unlimitedSeats)}
        className="mr-2"
        tabIndex={-1}
        small
        formik={formik}
      />
      <CheckboxField
        name="use_spl"
        label={f(messages.useSeatingPlan)}
        tabIndex={-1}
        small
        onChange={handleChangeUseSpl}
        formik={formik}
      />
    </div>
  );

  const handleToggleAllDay = (toggle: boolean) => {
    formik.setFieldValue("onlineFeatureAllDay", toggle);
    eventConfigNumber ^= EVENT_FEATURE_ALL_DAY;
    formik.values.features = eventConfigNumber;
  };

  const renderAllDayOption = () => (
    <div className="text-2xs text-gray-500">
      <CheckboxField
        name="allDay"
        label={f(messages.allDay)}
        tabIndex={-1}
        small
        formik={formik}
        value={formik.values.onlineFeatureAllDay}
        onChange={handleToggleAllDay}
      />
    </div>
  );

  useEffect(() => {
    formik.setFieldValue("price_template_id", selectedPriceTemplate?.id)
  }, [selectedPriceTemplate, formik]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="card-body">
        <div>
          <InputField
            name="title"
            className="mb-4 col-span-6 py-4"
            formik={formik}
            onBlur={false}
            disabled={loading}
            placeholder={f({ id: "Give your event a meaningful name" })}
            label={f({ id: "eventTitle" })}
            cornerHint={f(
              { id: "{count} characters remaining" },
              {
                count: 70 - formik.values.title.length,
                b: (...chunks) => <b key="ttt">{chunks}</b>,
              }
            )}
          />
          <InputField
            name="subtitle"
            className="mb-4 col-span-6 py-4"
            formik={formik}
            onBlur={false}
            disabled={loading}
            label={f(messages.eventSubtitle)}
            cornerHint={f(
              { id: "{count} characters remaining" },
              {
                count: 120 - formik.values.subtitle.length,
                b: (...chunks) => <b key="ttt">{chunks}</b>,
              }
            )}
          />
          <LocationInput
            label={f({ id: "Location" })}
            className="col-span-6 py-4 mb-4"
            name="location_id"
            formik={formik}
          />
          <InsetInputField
            name="static_total"
            className="mb-4 col-span-6 py-4"
            icon={<UserGroupIcon className="h-5 w-5 text-gray-400" />}
            formik={formik}
            cornerHint={renderInfiniteSeatsCornerHint()}
            placeholder={formik.values.featureUnlimitedSeats ? "-" : ""}
            number
            disabled={
              loading ||
              formik.values.featureUnlimitedSeats ||
              formik.values.use_spl
            }
            label={f(messages.seats)}
          />
          {
            !formik.values.use_spl && //price templates is only shown when seating plan isn't selected
            <div className="mb-4 py-4 space-x-6 items-center">
              <label htmlFor="price_template" className="block text-sm font-normal text-gray-700">
                {f(messages.priceTemplate)}
              </label>            
              <Select
                options={priceTemplateOptions}
                className="price_template__menu mt-1"
                value={selectedPriceTemplate}
                components={{
                  DropdownIndicator: () => null, IndicatorSeparator: () => null
                }}
                isSearchable={false}
                hideSelectedOptions={true}
                isClearable={false}
                onChange={setSelectedPriceTemplate}
              />
            </div>
          }
          <div className="flex mb-4 py-4 space-x-6 items-center">
            <DatePicker
              name="starts_at"
              locale="en"
              placeholder="Pick date"
              inputFormat="D. MMM. YYYY"
              labelFormat="D. MMM. YYYY"
              label={f(messages.date)}
              zIndex={1000}
              value={date}
              onChange={(value: Date) => {
                setDate(value);
              }}
              radius={"sm"}
              styles={DatePickerStyles}
              classNames={{
                input: "w-full h-10 font-sans shadow-sm",
                placeholder: "font-sans",
                label: "text-sm text-gray-700 font-sans",
              }}
            />

            <TimeField
              name="starts_at"
              className="col-span-3 py-4"
              icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
              setTime={setTime}
              formik={formik}
              value={formik.values.starts_at}
              cornerHint={renderAllDayOption()}
              placeholder={formik.values.featureUnlimitedSeats ? "-" : ""}
              number
              disabled={
                loading || (formik.values.onlineFeatureAllDay ? true : false)
              }
              label={f(messages.time)}
            />
          </div>
          <div className="py-4 mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              {f(messages.description)}
            </label>
            <HtmlEditor setData={setEditedHtml} data={editedHtml} />
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex">
          {error ? (
            <div className="text-center font-medium tracking-wide text-red-600 text-xs mb-4">
              {error.message}
            </div>
          ) : null}
          <LoadingBtn
            loading={loading}
            onClick={onSubmit}
            type="submit"
            className={classNames(
              "focus:outline-none focus:ring-2 focus:ring-offset-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              !formik.dirty || !formik.isValid || loading
                ? "bg-gray-200 hover:bg-gray-700 focus:ring-gray-500"
                : "bg-brand-500 hover:bg-brand-700 focus:ring-brand-500",
              event.id ? "" : "w-full"
            )}
            disabled={!formik.dirty || !formik.isValid || loading}
          >
            {f(messages[!event.id ? "create" : "save"])}
          </LoadingBtn>
          {event.id ? null : (
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleBackToEvents}
            >
              {f(messages.cancel)}
            </button>
          )}
        </div>
      </div>
      <Outlet />
    </form>
  );
}
