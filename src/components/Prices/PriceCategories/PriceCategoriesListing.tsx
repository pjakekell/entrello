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
import { classNames } from "../../../utils/misc";
import { FETCH_PRICE_CATEGORIES, IPriceCategory } from "./logic";

export default function PriceCategoriesListing() {
    const { formatMessage: f } = useIntl();
    const { data, loading, error } = useQuery(FETCH_PRICE_CATEGORIES);
    const navigate = useNavigate()
    if (error) return <Error error={error} />;

    const priceCategories = data ? data.price_categories : null;

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
                                        (priceCategories && priceCategories.length > 0 ? (
                                            priceCategories.map((priceCategory: IPriceCategory, priceCategoryId: number) => (
                                                <tr
                                                    onClick={() => navigate(`${priceCategory.id}/edit`)}
                                                    key={priceCategory.id}
                                                    className={classNames("hover:cursor-pointer", priceCategoryId % 2 === 0 ? "bg-white" : "bg-gray-50")}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <div className="flex align-center">
                                                            <div
                                                                className="rounded-full w-5 h-5 mr-2 ml-2"
                                                                style={{ backgroundColor: priceCategory.color || "none" }}
                                                            />
                                                            {priceCategory.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {priceCategory.description}

                                                    </td>


                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                                                        <Link to={`${priceCategory.id}/edit`}>
                                                            <a
                                                                href={`${priceCategory.id}/edit`}
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
                                                    <NoResultsFromQueryYet message={f(messages.noPriceCategoriesMatchingQuery)} />
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
