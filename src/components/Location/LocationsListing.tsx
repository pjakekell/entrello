import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_LOCATIONS } from "./logic";
import { useIntl } from "react-intl";

import Error from "../Error";
import messages from "../../i18n/messages.js";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ILocationTypes } from "./interfaces";
import LoadingData from "../common/LoadingData";
import NoResultsFromQueryYet from "../common/NoResultsFromQueryYet";
import classNames from "classnames";
import { faUpRightFromSquare } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LocationsListing() {
    const { formatMessage: f } = useIntl();
    const { data, loading, error } = useQuery(FETCH_LOCATIONS);
    const navigate = useNavigate()
    if (error) return <Error error={error} />;

    const locations = data ? data.locations : null;

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
                                        {f(messages.city)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.street)}
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
                                        (locations && locations.length > 0 ? (
                                            locations.map((location: ILocationTypes, locationIdx: number) => (
                                                <tr
                                                    onClick={() => navigate(`${location.id}/edit`)}
                                                    key={location.id}
                                                    className={classNames("hover:cursor-pointer", locationIdx % 2 === 0 ? "bg-white" : "bg-gray-50")}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {location.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {location.address.city}

                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {location.address.street}

                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                                                        <Link to={`${location.id}/edit`}>
                                                            <a
                                                                href={`${location.id}/edit`}
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
                                                    <NoResultsFromQueryYet message={f(messages.noLocationsMatchingQuery)} />
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
