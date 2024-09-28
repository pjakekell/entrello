import React from "react";
import Error from "../Error";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_TAX_GROUPS } from "./logic";
import { useIntl } from "react-intl";
import { ITaxGroup } from "./interfaces";

import messages from "../../i18n/messages.js";
import { Link, useNavigate } from "react-router-dom";
import NumberFormat from "react-number-format";
import { classNames } from "../../utils/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/pro-light-svg-icons";

export default function TaxGroupsListing() {
  const { formatMessage: f } = useIntl();
  const { error, data } = useQuery(FETCH_TAX_GROUPS, {
    variables: { limit: 100 },
  });
  const navigate = useNavigate();

  if (error) return <Error error={error} />;

  const taxes = data ? data.tax_groups : null;

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
                    {f(messages.taxName)}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {f(messages.taxRate)}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{f(messages.edit)}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {taxes &&
                  taxes.map((tax: ITaxGroup, taxIdx: number) => (
                    <tr
                      onClick={() => navigate(`/settings/taxes/edit/${tax.id}`)}
                      key={tax.id}
                      className={classNames("hover:cursor-pointer", taxIdx % 2 === 0 ? "bg-white" : "bg-gray-50")}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tax.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <NumberFormat
                          value={tax.tax_rate ? tax.tax_rate * 100.0 : 0}
                          thousandSeparator=" "
                          decimalSeparator=","
                          decimalScale={2}
                          displayType="text"
                          suffix=" %"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                        <Link to={`/settings/taxes/edit/${tax.id}`}>
                          <a
                            href={`/settings/taxes/edit/${tax.id}`}
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
