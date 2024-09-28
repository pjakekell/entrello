import React, { Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDuplicateEvent } from "../../hooks/useDuplicateEvent";
import { FormatDateOptions, useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { IEvent } from "./interfaces";
import { useFormik } from "formik";
import { DatePicker } from "@mantine/dates";
// import { useQuery, useMutation } from "@apollo/react-hooks";
import LoadingBtn from "../Btn/LoadingBtn";
import { DatePickerStyles } from "../../utils/misc";
import { CalendarIcon } from "@heroicons/react/outline";
import TimeField from "../FormHelpers/TimeField";
import CheckboxField from "../FormHelpers/CheckboxField";

interface IDuplicateEventDialog {
  show: boolean;
  event: IEvent;
  handleClose: () => void;
}

const DuplicateEventDialog = ({
  show,
  handleClose,
  event,
}: IDuplicateEventDialog) => {
  const { formatMessage: f, formatDate: d } = useIntl();
  const navigate = useNavigate();
  const [duplicateEvent, { loading }] = useDuplicateEvent();

  const onSubmit = async () => {
    try {
      const newEvent = await duplicateEvent(formik.values);
      if (newEvent) {
        navigate(`/events/${newEvent.id}`);
        return;
      }
      console.error(
        "unexpected return value from server when duplicating event"
      );
    } catch (e) {
      console.error(e);
    }
  };
  const formik = useFormik({
    initialValues: {
      starts_at: undefined,
      event_id: event.id,
      duplicate_prices: true,
      duplicate_event_deals: true,
      duplicate_media: true,
      duplicate_optioned_orders: true,
    },
    onSubmit,
  });

  const handleChangeDate = (value: Date) => {
    formik.setFieldValue("starts_at", value);
  };

  const focusFieldRef = useRef(null);

  const dateFormat: FormatDateOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={focusFieldRef}
        open
        onClose={() => {}}
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
              <div className="flex items-center">
                <div className="sm:text-left w-full">
                  <Dialog.Title as="div">
                    <div className="text-lg leading-6 font-medium text-brand-600">
                      {f(messages.duplicateEvent)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {event.title} - {d(event.starts_at, dateFormat)}
                    </div>
                  </Dialog.Title>
                </div>
                <div
                  className="ml-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                  ref={focusFieldRef}
                  onClick={handleClose}
                >
                  <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                </div>
              </div>
              <div>
                <div>
                  <DatePicker
                    name="starts_at"
                    locale="en"
                    placeholder="Pick date"
                    inputFormat="D. MMM. YYYY"
                    labelFormat="D. MMM. YYYY"
                    label={f(messages.date)}
                    zIndex={1000}
                    value={formik.values.starts_at}
                    onChange={handleChangeDate}
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
                    setTime={() => {}}
                    formik={formik}
                    value={formik.values.starts_at || null}
                    number
                    label={f(messages.time)}
                  />
                </div>
              </div>
              <fieldset className="space-y-5">
                <legend className="sr-only">{f(messages.options)}</legend>
                <CheckboxField
                  formik={formik}
                  name="duplicate_prices"
                  label={f(messages.prices)}
                  description={
                    <p className="text-gray-500">
                      {f(messages.duplicatePricesDesc)}
                    </p>
                  }
                />
                <CheckboxField
                  formik={formik}
                  name="duplicate_media"
                  label={f(messages.media)}
                  description={
                    <p className="text-gray-500">
                      {f(messages.duplicateMediaDesc)}
                    </p>
                  }
                />
                <CheckboxField
                  formik={formik}
                  name="duplicate_event_deals"
                  label={f(messages.deals)}
                  description={
                    <p className="text-gray-500">
                      {f(messages.duplicateEventDealsDesc)}
                    </p>
                  }
                />
                <CheckboxField
                  formik={formik}
                  name="duplicate_optioned_orders"
                  label={f(messages.options)}
                  description={
                    <p className="text-gray-500">
                      {f(messages.duplicateOptionsDesc)}
                    </p>
                  }
                />
              </fieldset>
              <div className="mt-2 flex justify-end">
                <LoadingBtn
                  color="primary"
                  loading={loading}
                  onClick={onSubmit}
                >
                  {f(messages.create)}
                </LoadingBtn>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DuplicateEventDialog;
