import React from "react";
import Layout from "../Layout/Layout";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import Notifications from "../Notifications/Notifications";

import {
  LineChart,
  XAxis,
  Legend,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Container from "../Layout/Container";
import moment from "moment";
import messages from "../../i18n/messages";
import colors from "../../utils/colors";

import { useGlobalStats } from "../../hooks/useGlobalStats";
import LoadingIcon from "../Btn/LoadingIcon";
import Currency from "../Currency";

interface IBalanceBlock {
  title: any;
  subtitle: any;
  currency?: boolean;
  value: number;
  link?: any;
}

const BalanceBlock = ({
  title,
  value,
  subtitle,
  link,
  currency,
}: IBalanceBlock) => {
  return (
    <div className="flex flex-col p-2 h-32 justify-center">
      <div className="flex justify-between text-sm">
        {title}
        {link ? link : null}
      </div>
      <div className="text-2xl font-semibold leading-10">
        {currency ? <Currency value={value} /> : value}
      </div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </div>
  );
};

const getValueFromStats = (values: any, stats: any, key: string) => {
  let val =
    stats && stats.stats_date
      ? stats.stats_date[stats.stats_date.length - 1][key]
      : 0;
  if (values) val = values[key];
  return val;
};

const CustomTooltip = ({ payload, fromDate, toDate, resolution }: any) => {
  const { formatMessage: f, formatDate: d } = useIntl();
  const [stats] = useGlobalStats(fromDate, toDate, resolution);
  const values = payload && payload[0] ? payload[0].payload : null;
  const dFormat = {
    day: "numeric",
    weekday: "short",
    month: "short",
    hour: "numeric",
    minute: "numeric",
  };
  const latest = toDate;
  latest.setMinutes(0);
  const now = new Date();
  now.setMinutes(0);
  // @ts-ignore
  let time = d(latest, dFormat);
  // @ts-ignore
  if (now.getTime() < latest.getTime()) time = d(now, dFormat);
  if (values) {
    // @ts-ignore
    time = d(values.created_at, dFormat);
  }
  return (
    <div className="flex gap-x-16">
      <BalanceBlock
        title={f(messages.grossVolume)}
        value={getValueFromStats(values, stats, "revenue_paid")}
        currency
        subtitle={time}
      />
      <BalanceBlock
        title={f(messages.bookings)}
        value={getValueFromStats(values, stats, "booked")}
        subtitle={time}
      />
      <BalanceBlock
        title={f(messages.claims)}
        value={getValueFromStats(values, stats, "claimed")}
        subtitle={time}
      />
      <div></div>
    </div>
  );
};

const PayoutCard = () => {
  const { formatMessage: f, formatDate: d } = useIntl();
  return (
    <BalanceBlock
      title={f(messages.payouts)}
      value={0}
      currency
      subtitle={f(messages.payoutExpectedArrival, {
        date: d(moment().add(3, "d").toDate(), {
          day: "numeric",
          month: "short",
        }),
      })}
      link={
        <Link to="/payouts">
          <span className="text-brand-500">{f(messages.view)}</span>
        </Link>
      }
    />
  );
};

const BalanceCard = () => {
  const { formatMessage: f } = useIntl();
  return (
    <BalanceBlock
      title={f(messages.balance)}
      value={0}
      currency
      subtitle={f(messages.estimatedFuturePayouts)}
      link={
        <Link to="/balance">
          <span className="text-brand-500">{f(messages.view)}</span>
        </Link>
      }
    />
  );
};

interface IStat {
  created_at: Date;
  booked: number;
  paid: number;
  revenue: number;
  revenue_paid: number;
  claimed: number;
}

const getTicks4Timeseries = (
  from: Date,
  to: Date,
  resolution: moment.unitOfTime.StartOf
) => {
  let calcRes = 3600;
  switch (resolution) {
    case "hour":
      calcRes = 3600;
      break;
  }
  const ticks = Math.round((to.getTime() - from.getTime()) / calcRes / 1000);
  return { calcRes, ticks };
};

const fillStatsTimeseries = (
  stats: IStat[],
  from: Date,
  to: Date = new Date(),
  resolution: moment.unitOfTime.StartOf = "hour"
) => {
  const fs: any = {};

  const { calcRes, ticks } = getTicks4Timeseries(from, to, resolution);
  from.setMinutes(0);
  from.setSeconds(0);
  from.setMilliseconds(0);
  for (let i = 0; i < ticks; i++) {
    const t = from.getTime() + i * calcRes * 1000;
    const isFuture = t > new Date().getTime();
    fs[i] = {
      created_at: t,
      booked: isFuture ? null : 0,
      claimed: isFuture ? null : 0,
      paid: isFuture ? null : 0,
      revenue_paid: isFuture ? null : 0,
      revenue: isFuture ? null : 0,
    };
  }

  if (stats)
    stats.forEach((s: IStat) => {
      const d = new Date(s.created_at);
      fs[d.getHours()].booked = s.booked;
      fs[d.getHours()].paid = s.paid;
      fs[d.getHours()].claimed = s.claimed;
      fs[d.getHours()].revenue_paid = s.revenue_paid;
      fs[d.getHours()].revenue = s.revenue;
    });
  return Object.values(fs);
};

const MainOrdersChart = () => {
  let fromDate = new Date();
  fromDate.setHours(0);
  fromDate.setMinutes(0);
  fromDate.setSeconds(0);
  const toDate = new Date();
  toDate.setHours(23);
  toDate.setMinutes(59);
  toDate.setSeconds(59);
  const resolution = "";
  const [stats, { loading }] = useGlobalStats(fromDate, toDate, resolution);

  const data = fillStatsTimeseries(
    stats ? stats.stats_date : null,
    fromDate,
    toDate,
    "hour"
  );
  const ticks = data.map((d: any) => d.created_at);
  ticks.pop();

  return (
    <div className="my-10 border border-gray-200">
      <div className="grid grid-cols-12 divide-x divide-y divide-gray-200">
        <div className="col-span-9">
          {loading ? (
            <LoadingIcon size={48} />
          ) : (
            <div className="grid grid-flow-row grid-rows-2 divide-y divide-gray-200 h-full">
              <div></div>
              <div className="p-2">
                <ResponsiveContainer width="100%" height={150}>
                  {/*
 // @ts-ignore */}
                  <LineChart data={data || []} margin={{ top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="0 0" horizontal={false} />
                    <XAxis
                      tickFormatter={(unixTime) =>
                        moment(unixTime).format("HH:mm")
                      }
                      tick={{ style: { fontSize: 10 } }}
                      domain={[ticks[0], ticks[ticks.length - 1]]}
                      ticks={ticks}
                      minTickGap={1}
                      type="number"
                      dataKey="created_at"
                    />
                    <Tooltip
                      content={
                        <CustomTooltip
                          fromDate={fromDate}
                          toDate={toDate}
                          resolution={resolution}
                        />
                      }
                      wrapperStyle={{ visibility: "visible" }}
                      position={{ x: 0, y: -175 }}
                    />
                    <Legend
                      align="left"
                      verticalAlign="top"
                      wrapperStyle={{ fontSize: 12 }}
                      margin={{ left: 5, top: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="claimed"
                      stroke={colors.bookingColors.claimed}
                    />
                    <Line
                      type="monotone"
                      dataKey="booked"
                      stroke={colors.bookingColors.booked}
                    />
                    <Line
                      type="monotone"
                      dataKey="paid"
                      stroke={colors.bookingColors.paid}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-3">
          <div className="grid grid-flow-row grid-rows-2 divide-y divide-gray-200 h-full">
            <BalanceCard />
            <PayoutCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardView() {
  return (
    <Layout>
      <Container>
        <Notifications />
        <MainOrdersChart />
      </Container>
    </Layout>
  );
}
