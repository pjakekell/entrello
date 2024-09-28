import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { useIntl } from "react-intl";
import { faUpRightFromSquare } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Error from "../../Error";
import messages from "../../../i18n/messages.js";
import LoadingData from "../../common/LoadingData";
import NoResultsFromQueryYet from "../../common/NoResultsFromQueryYet";
import { FETCH_PRICE_TEMPLATES, IPriceTemplate } from "./logic";
import { classNames } from "../../../utils/misc";

export default function PriceNamesListing() {
  const { formatMessage: f } = useIntl();
  const { data, loading, error } = useQuery(FETCH_PRICE_TEMPLATES);
  const navigate = useNavigate()
  if (error) return <Error error={error} />;

  const priceTemplates = data ? data.price_templates : null;

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
                    {f(messages.name)}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.description)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ?
                    <tr>
                      <td colSpan={8}>
                        <LoadingData />
                      </td>
                    </tr>
                    :
                    (priceTemplates && priceTemplates.length > 0 ? (
                      priceTemplates.map((priceTemplate: IPriceTemplate, priceNameIdx: number) => (
                        <tr
                          onClick={() => navigate(`${priceTemplate.id}/edit`)}
                          key={priceTemplate.id}
                          className={classNames("hover:cursor-pointer", priceNameIdx % 2 === 0 ? "bg-white" : "bg-gray-50")}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {priceTemplate.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {priceTemplate.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                            <Link to={`${priceTemplate.id}/edit`}>
                              <a
                                href={`${priceTemplate.id}/edit`}
                                  className="flex justify-center text-brand-600 hover:border-brand-500 border-2 border-transparent w-8 h-8 items-center rounded cursor-pointer"
                                >
                                <FontAwesomeIcon icon={faUpRightFromSquare} />
                              </a>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )
                      :
                      <tr>
                        <td colSpan={4}>
                          <NoResultsFromQueryYet message={f(messages.noPriceTemplatesMatchingQuery)} />
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Outlet />
    </div >
  );
}
