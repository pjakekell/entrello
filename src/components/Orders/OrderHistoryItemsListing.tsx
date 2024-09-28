import React from "react";
import classNames from "classnames";
import moment from "moment";
import { IOrder, IOrderLog } from "./interfaces";
import { getApolloClient } from "../../apollo-client";

import { orderStatusIcons } from "./orderStatusIcons";
import LoadingIcon from "../Btn/LoadingIcon";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IOrderHistoryItemsListing {
  order: IOrder;
}

export default function OrderHistoryItemsListing({
  order,
}: IOrderHistoryItemsListing) {
  if (!order.logs)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon color="text-indigo-400" />
      </div>
    );

  return (
    <div className="py-4 text-xs">
      <div className="text-xs my-2">
        <div className="flow-root">
          <ul className="-mb-8">
            {order.logs.map((item: IOrderLog, i: number) => (
              <li key={`log-${i}`}>
                <div className="relative pb-8">
                  {i !== order.logs.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <OrderHistoryItem item={item} key={`history-item-${i}`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface IOrderHistoryItem {
  item: IOrderLog;
}

const OrderHistoryItem = ({ item }: IOrderHistoryItem) => {
  const client: any = getApolloClient();
  const user = client.cache.data.data[`User:${item.by_id}`];
  return (
    <div className="relative flex space-x-3">
      <div>
        <span
          className={classNames(
            orderStatusIcons[item.action_code]?.[1],
            "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
          )}
        >
          <FontAwesomeIcon
            icon={orderStatusIcons[item.action_code]?.[0]}
            className="h-5 w-5 text-white"
            aria-hidden="true"
          />
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
        <div>
          <p className="text-sm text-gray-500">{item.message}</p>
        </div>
        <div className="text-right text-sm whitespace-nowrap text-gray-500 flex space-x-3">
          <p className="text-sm text-gray-500">{user.name || "N/A"}</p>
          <time dateTime={item.created_at}>
            {moment(item.created_at).format("MMM DD YYYY")}
          </time>
        </div>
      </div>
    </div>
  );
};
