import React from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { UserIcon } from "@heroicons/react/outline";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_EVENT_BY_ID } from "../Event/logic";
import colors from "../../utils/colors";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Label,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EventStatsChart from "./EventStatsChart";
import { IEvent } from "../Event/interfaces";
import Currency from "../Currency";

interface IEventTitle {
  event: IEvent | undefined;
  loading: boolean;
}

const CustomLabel = ({ viewBox, value1, value2 }: any) => {
  const { cx, cy } = viewBox;
  return (
    <>
      <text
        x={cx}
        y={cy - 8}
        fill="#3d405c"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="12">
          {value1}
        </tspan>
      </text>
      <line
        x1={cx - 15}
        y1={cy}
        x2={cx + 15}
        y2={cy}
        style={{ stroke: "rgb(100,100,100)", strokeWidth: 1 }}
      />
      <text
        x={cx}
        y={cy + 11}
        fill="#3d405c"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="12">
          {value2}
        </tspan>
      </text>
    </>
  );
};

const EventCharts = ({ event, loading }: IEventTitle) => {
  if (loading || !event) {
    return (
      <>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-light-blue-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-light-blue-400 rounded"></div>
              <div className="h-4 bg-light-blue-400 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const stats = [
    { name: "Total capacity", stat: event.totals.total, icon: UserIcon },
    { name: "Total claimed", stat: event.totals.claimed, icon: UserIcon },
    { name: "Total booked", stat: event.totals.booked, icon: UserIcon },
    {
      name: "Total revenue",
      stat: <Currency value={event.totals.revenue} />,
      icon: UserIcon,
    },
  ];

  const data01 = [
    { name: "Available", value: event.totals.total - event.totals.booked },
    { name: "Claimed", value: event.totals.claimed },
    { name: "Booked", value: event.totals.booked - event.totals.paid },
    { name: "Paid", value: event.totals.paid },
  ];

  return (
    <div className="md:grid md:grid-cols-5 md:gap-6 px-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={50} height={50}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data01}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={40}
            fill="#8884d8"
            paddingAngle={2}
          >
            {data01.map((_, index: number) => (
              <Cell key={`cell-${index}`} fill={colors.chartColors[index]} />
            ))}
            <Label
              position="center"
              content={
                <CustomLabel
                  value1={event.totals.booked}
                  value2={event.totals.total}
                />
              }
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {stats.map((item) => (
        <div
          key={item.name}
          className="px-4 py-5 overflow-hidden sm:p-6 md:grid-cols-1"
        >
          <item.icon className="h-8 w-8 text-brand-600" aria-hidden="true" />
          <div className="text-xs text-gray-400 truncate mt-1">{item.name}</div>
          <div className="text-md font-bold text-gray-600">{item.stat}</div>
        </div>
      ))}
    </div>
  );
};

export default function EventOverview() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(FETCH_EVENT_BY_ID, {
    variables: { id },
  });

  if (error) {
    toast(error.message, {
      toastId: error.message,
      type: toast.TYPE.ERROR,
    });
  }

  const from = moment().subtract(7, "d").toDate();
  return (
    <div className="mt-4 h-full">
      <EventCharts loading={loading} event={data ? data.event : undefined} />
      <EventStatsChart
        from={from}
        to={new Date()}
        resolution=""
        eventID={id || ""}
      />
    </div>
  );
}
