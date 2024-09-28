import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import { faUpRightFromSquare } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Error from "../../Error";
import messages from "../../../i18n/messages.js";
import LoadingData from "../../common/LoadingData";
import NoResultsFromQueryYet from "../../common/NoResultsFromQueryYet";
import { FETCH_PRICE_NAMES, IPriceName } from "./logic";
import { classNames } from "../../../utils/misc";

export default function PriceNamesListing() {
    const { formatMessage: f } = useIntl();
    const { data, loading, error } = useQuery(FETCH_PRICE_NAMES);
    const navigate = useNavigate()
    if (error) return <Error error={error} />;

    const priceNames = data ? data.price_names : null;

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
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.number)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.taxGroup)}
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">{f(messages.edit)}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    loading ?
                                        <tr>
                                            <td colSpan={4}>
                                                <LoadingData />
                                            </td>
                                        </tr>
                                        :
                                        (priceNames && priceNames.length > 0 ? (
                                            priceNames.map((priceName: IPriceName, priceNameIdx: number) => (
                                                <tr
                                                    onClick={() => navigate(`${priceName.id}/edit`)}
                                                    key={priceName.id}
                                                    className={classNames("hover:cursor-pointer", priceNameIdx % 2 === 0 ? "bg-white" : "bg-gray-50")}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {priceName.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {priceName.description}

                                                    </td>
                                                    <td
                                                        className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                                                    // onClick={handleEditPrice}
                                                    >
                                                        <NumberFormat
                                                            value={priceName.num}
                                                            displayType="text"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 cursor-pointer">
                                                        {priceName.tax_group_name}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                                                        <Link to={`${priceName.id}/edit`}>
                                                            <a
                                                                href={`${priceName.id}/edit`}
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
                                                    <NoResultsFromQueryYet message={f(messages.noPriceNamesMatchingQuery)} />
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
