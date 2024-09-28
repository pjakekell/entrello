import React from "react";
import { useIntl } from "react-intl";
import { Route } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import EditEventForm from "./EditEventForm";
import { buildEvent } from "./logic";
import messages from "../../i18n/messages";
import { Link } from "react-router-dom";
import { Routes } from "react-router-dom";
import NewLocationModal from "../Location/NewLocationModal";

export default function NewEvent() {
  const { formatMessage: f } = useIntl();
  return (
    <>
      <div className="w-1/3 mx-auto mt-8">
        <div>
          <div className="flex-1 min-w-0">
            <Link
              to="/events"
              className="text-sm font-bold leading-7 text-gray-400 hover:text-gray-600 sm:truncate flex items-center mb-2"
            >
              <ChevronLeftIcon
                className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400 hover:text-gray-600"
                aria-hidden="true"
              />
              <div>{f(messages.back)}</div>
            </Link>
          </div>
        </div>
        <div className="bg-white shadow sm:rounded-lg p-8 mt-4">
          <div className="text-2xl font-bold leading-7 text-brand-600 sm:text-3xl sm:truncate border-b border-gray-300 pb-8 pt-2">
            <div>{f(messages.newEvent)}</div>
          </div>
          <EditEventForm event={buildEvent()} />
        </div>
      </div>
      <Routes>
        <Route path="/events/new/location" element={NewLocationModal} />
      </Routes>
    </>
  );
}
