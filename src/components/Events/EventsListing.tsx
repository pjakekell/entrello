import React, { useEffect, useRef } from "react";

import Error from "../Error";
import { classNames } from "../../utils/misc";
import { useEvents } from "../../hooks/useEvents";
import { useFormik } from "formik";
// import { DATE_FORMAT, TIME_FORMAT } from "../../utils/misc";
// import { IEvent } from "../Event/interfaces";
import { AutoSizer, SortDirection, Table, Column } from "react-virtualized";

import { useIntl } from "react-intl";
import EventsListingHeader from "./EventsListingHeader/EventsListingHeader";

import messages from "../../i18n/messages.js";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { lang } from "../../locale";
import { EventStatusIcons } from "../Event/EventStatus";
import EventFeaturesIcons from "../Event/EventFeaturesIcons";
import { BarChart, Bar } from "recharts";

import {
  fromEventFilter,
  toEventFilter,
  statuses,
  labels,
  initialSeason,
} from "./EventsListingHeader/config";
import NoResultsFromQueryYet from "../common/NoResultsFromQueryYet";
import LoadingData from "../common/LoadingData";

interface IRowGetter {
  index: number;
}

const getVariables = (formik: any) => {
  const variables: any = {};
  const from = formik.values.fromEventFilter;
  if (from && from instanceof Date) {
    variables.from = from.getTime() / 1000;
  }
  return variables;
};

export default function EventsListing() {
  const { formatDate: d, formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const { dataUserId } = useUser();
  const tableRef = useRef(null);
  const sortBy = "starts_at";
  const sortDir = SortDirection.ASC;
  const initialValues = {
    eventName: "",
    fromEventFilter,
    toEventFilter,
    statuses,
    labels,
    selectedSeason: initialSeason,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: () => { },
    enableReinitialize: true,
  });

  const [events, { loading, error, refetch }] = useEvents(getVariables(formik));

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (dataUserId) {
    if (lang !== dataUserId?.user.lang.toLowerCase()) {
      localStorage.setItem("locale", dataUserId?.user.lang);
      // window.location.reload();
    }
  }

  if (error) return <Error error={error} />;

  const rowGetter = ({ index }: IRowGetter) => {
    return events ? events[index] : {};
  };

  const handleOpenEvent = ({ rowData: event }: any) => {
    navigate(`/events/${event.id}`);
  };

  const renderSeatsBooked = ({ rowData: event }: any) => {
    const perc = Math.floor((100 * event.totals.booked) / event.totals.total);
    return (
      <div className="flex items-center">
        <div className="relative w-36 ml-2">
          <div className="flex items-center justify-between text-xs">
            <div className="text-right">
              <span className="text-2xs font-semibold inline-block text-pink-600">
                {event.totals.booked}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xs font-semibold inline-block text-pink-600">
                {event.totals.total}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-1 text-xs flex rounded bg-pink-200">
            <div
              style={{ width: perc }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const render7DayPerformance = () => {
    const cdata = [
      {
        booked_shop: Math.floor((Math.random() * 10) % 2) + 1,
      },
      {
        booked_shop: Math.floor((Math.random() * 10) % 2) + 1,
      },
      {
        booked_shop: Math.floor((Math.random() * 10) % 2) + 1,
      },
      {
        booked_shop: Math.floor(Math.random() * 10) + 1,
      },
      {
        booked_shop: Math.floor(Math.random() * 10) + 1,
      },
    ];

    return (
      <div className="flex items-center">
        <BarChart width={100} height={30} data={cdata}>
          <Bar dataKey="booked_shop" fill="#bbb" />
        </BarChart>
      </div>
    );
  };

  const renderActionIcon = () => (
    <ChevronRightIcon className="h-8 text-gray-400 self-end" />
  );

  const renderTitle = ({ cellData }: any) => {
    const cArr = cellData.split(" - ");
    return (
      <div>
        <div className="text-bold">{cArr[0]}</div>
      </div>
    );
  };

  const renderStatus = ({ rowData }: any) => (
    <EventStatusIcons event={rowData} />
  );

  const renderFeatures = ({ rowData }: any) => (
    <EventFeaturesIcons event={rowData} />
  );

  const renderDate = ({ cellData: startsAt }: any) => {
    const isSunday = new Date(startsAt).getDay() === 0;
    return (
      <div
        className={classNames(
          "p-1 flex items-center",
          isSunday ? "text-brand-600" : "text-gray-600"
        )}
      >
        <div className="text-center w-10">
          <div className="text-xl font-bold leading-none">
            {d(startsAt, { day: "numeric" })}
          </div>
          <div className="text-xs uppercase">
            {d(startsAt, { month: "short" })}
          </div>
        </div>
        <div className="">
          <div className="text-xs leading-none">
            {d(startsAt, {
              weekday: "short",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
          <div className="text-xs">
            {d(startsAt, {
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    );
  };

  const calcRowClassName = () =>
    classNames(
      "flex border-b border-gray-300 items-center cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out text-sm"
    );

  return (
    <div className="px-2 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto min-h-screen">
      <EventsListingHeader formik={formik} />
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            headerHeight={40}
            className="my-6"
            headerClassName="flex px-2 h-full text-sm items-center"
            overscanRowCount={10}
            rowCount={events ? events.length : 0}
            rowHeight={50}
            noRowsRenderer={() =>
              loading ? <LoadingData /> : <NoResultsFromQueryYet message={f(messages.noEventsMatchingQuery)} />
            }
            onRowClick={handleOpenEvent}
            width={width}
            ref={tableRef}
            rowClassName={calcRowClassName}
            rowGetter={rowGetter}
            sort={({ sortBy, sortDirection }) =>
              console.log("not impl.", sortBy, sortDirection)
            }
            sortBy={sortBy}
            sortDirection={sortDir}
          >
            <Column
              label={f(messages.date)}
              dataKey="starts_at"
              className="px-2"
              headerClassName="ml-2"
              width={150}
              cellRenderer={renderDate}
            />
            <Column
              label={f(messages.title)}
              className="px-2"
              dataKey="title"
              width={300}
              cellRenderer={renderTitle}
              flexGrow={1}
            />
            <Column
              label={f(messages.last7performance)}
              dataKey="line_chart"
              className="px-2 items-center"
              cellRenderer={render7DayPerformance}
              width={100}
            />
            <Column
              label={f(messages.poss)}
              dataKey="line_chart"
              className="px-2 items-center"
              cellRenderer={renderSeatsBooked}
              width={120}
            />
            <Column
              label={f(messages.status)}
              dataKey="status_code"
              className="px-2 items-center"
              cellRenderer={renderStatus}
              flexGrow={1}
              width={100}
            />
            <Column
              label={f(messages.features)}
              dataKey="features"
              className="px-2 items-center"
              cellRenderer={renderFeatures}
              flexGrow={1}
              width={100}
            />
            <Column
              dataKey="id"
              label=""
              className="flex justify-end pr-2"
              cellRenderer={renderActionIcon}
              width={80}
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  );
}
