import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages.js";
import { FETCH_EVENT_BY_ID } from "../Event/logic";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import EditEventForm from "./EditEventForm";

const EventSettingsView = () => {
  const { formatMessage: f } = useIntl();
  const { id } = useParams();
  const { data, loading } = useQuery(FETCH_EVENT_BY_ID, {
    variables: { id },
  });

  return (
    <div className="p-4 mt-2">
      <div className="mb-4 pb-2">
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="mt-2">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {f(messages.settings)}
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-5 md:mt-0">
        {!loading && data && data.event ? (
          <EditEventForm event={data.event} />
        ) : null}
      </div>
    </div>
  );
};

export default EventSettingsView;
