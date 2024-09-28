import React from "react";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEventStats } from "../../hooks/useEventStats";

interface IEventStatsChart {
  eventID: string;
  from: Date;
  to: Date;
  resolution: string;
}

export default function EventStatsChart({
  resolution,
  from,
  to,
  eventID,
}: IEventStatsChart) {
  const { stats, loading } = useEventStats(eventID, from, to, resolution);
  if (loading || !stats) return <></>;

  return (
    <ResponsiveContainer
      width="100%"
      height={150}
      className="bg-white p-4 shadow-sm m-1"
    >
      <LineChart
        width={100}
        height={100}
        data={stats.stats_date}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="created_at"
          domain={["auto", "auto"]}
          tickFormatter={(timeStr) => moment(timeStr).format("ddd, DD.MM.")}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="booked"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="paid" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
