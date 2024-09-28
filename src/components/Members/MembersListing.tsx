import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";

import Error from "../Error";
import messages from "../../i18n/messages.js";
import { classNames } from "../../utils/misc";
import { FETCH_USERS_OF_ORG } from "./logic";
import { iUser } from "./interfaces";
import LoadingData from "../common/LoadingData";

export default function MembersListing() {

    const { formatMessage: f } = useIntl();
    const { error, data, loading } = useQuery(FETCH_USERS_OF_ORG);

    if (error) return <Error error={error} />;
    if (loading) return <LoadingData />

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
                                        {f(messages.email)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.Firstname)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.lastname)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.role)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.phone)}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {f(messages.language)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.users && data.users.length > 0 &&
                                    data.users.map((user: iUser, userIdx: number) => (
                                        <tr
                                            key={user.id}
                                            className={classNames(userIdx % 2 === 0 ? "bg-white" : "bg-gray-50")}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {user.email ? user.email : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.firstname ? user.firstname : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.lastname ? user.lastname : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.role ? user.role : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.phone ? user.phone : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.lang ? user.lang : "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}
