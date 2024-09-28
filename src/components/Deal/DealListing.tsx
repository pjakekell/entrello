import React from "react";
import Error from "../Error";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_DEALS } from "./logic";
import { useIntl } from "react-intl";
import { IDeal } from "./interfaces";

import messages from "../../i18n/messages.js";
import { Link, useNavigate } from "react-router-dom";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/pro-thin-svg-icons";
import { classNames } from "../../utils/misc";

export default function DealsListing() {
  const { formatMessage: f } = useIntl();
  const { error, data } = useQuery(FETCH_DEALS, {
    variables: { limit: 100 },
  });
  const navigate = useNavigate();
  if (error) return <Error error={error} />;

  const deals = data ? data.deals : null;

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.dealDesc)}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.cr)}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.sf)}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.dealPartnerName)}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{f(messages.edit)}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals &&
                  deals.map((deal: IDeal, dealIdx: number) => (
                    <tr
                      onClick={() => navigate(`/settings/deals/edit/${deal.id}`)}
                      key={deal.id}
                      className={classNames("hover:cursor-pointer", dealIdx % 2 === 0 ? "bg-white" : "bg-gray-50")}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deal.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <NumberFormat
                          value={deal.cr * 100.0}
                          thousandSeparator=" "
                          decimalSeparator=","
                          fixedDecimalScale
                          decimalScale={1}
                          displayType="text"
                          suffix=" %"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <NumberFormat
                          value={deal.sf / 100.0}
                          thousandSeparator=" "
                          decimalSeparator=","
                          fixedDecimalScale
                          decimalScale={2}
                          displayType="text"
                          prefix="€ "
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deal.reseller_org_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                        <Link to={`/settings/deals/edit/${deal.id}`}>
                          <a
                            href={`/settings/deals/edit/${deal.id}`}
                            className="flex justify-center text-brand-600 hover:border-brand-500 border-2 border-transparent w-8 h-8 items-center rounded cursor-pointer"

                          >
                            <FontAwesomeIcon icon={faUpRightFromSquare} />
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
