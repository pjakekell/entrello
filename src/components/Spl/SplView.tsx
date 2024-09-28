import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { useSubscription } from "@apollo/react-hooks";

import SeatingPlan from "./SeatingPlan";
import FullpageLoader from "../FullpageLoader";
import Toolbar from "./Toolbar";
import EventInfoBox from "./EventInfoBox";
import SelectionInfo from "./SelectionInfo";
import ContingentSideCard from "./ContingentSideCard";

import { ORDERS_SUBSCRIPTION } from "../Orders/logic";
import { IOrder } from "../Orders/interfaces";
import { updateOrderSeats } from "../Spl/tools/seat_active_toggles";
import { useEvent } from "../../hooks/useEvent";

const updateOrderFromSubscription = (order: IOrder) => {
  updateOrderSeats(order);
};

export default function SplView() {
  const { id } = useParams();
  const [event, { loading, error }] = useEvent(id || "");
  const { data } = useSubscription(ORDERS_SUBSCRIPTION, {
    variables: { token: localStorage.getItem("t") },
  });
  if (data && data.orderChanged) updateOrderFromSubscription(data.orderChanged);

  if (loading || !event) return <FullpageLoader />;
  if (error) {
    return <div>Error! ${error.message}</div>;
  }

  return (
    <div className="w-full h-full bg-gray-100">
      <EventInfoBox event={event} />
      {event ? (
        <div className="overflow-hidden w-full h-full">
          <SeatingPlan event={event} />
          <SelectionInfo />
          <Toolbar />
          <ContingentSideCard />
          <Outlet />
        </div>
      ) : null}
    </div>
  );
}
