import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { faEllipsisH } from "@fortawesome/pro-regular-svg-icons/faEllipsisH";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import { useParams } from "react-router";

import messages from "../../i18n/messages.js";
import { classNames } from "../../utils/misc";
import LoadingIcon from "../Btn/LoadingIcon";
import { DELETE_PRICE, FETCH_PRICES_BY_EVENT_ID, FETCH_PRICES_BY_PARENT_ID } from "./logic";
import { setMsg } from "../Toaster/logic";

interface IPriceRowOptions {
    link: string;
    priceId: string;
    isConcession: boolean;
    parentId?: string
}

const PriceRowOptions = ({ link, priceId, parentId, isConcession }: IPriceRowOptions) => {
    const { formatMessage: f } = useIntl();
    const dispatch = useDispatch();
    const { id: eventId } = useParams();

    const [deletePrice, { loading: deleting }] = useMutation(DELETE_PRICE, {
        refetchQueries: [
            {
                query: FETCH_PRICES_BY_EVENT_ID,
                variables: { event_id: eventId }
            },

            {
                query: FETCH_PRICES_BY_PARENT_ID,
                variables: { parent_id: parentId },
            },
        ]
    })

    const handleDelete = async (message: string) => {
        try {
            await deletePrice({ variables: { id: priceId } });
            dispatch(setMsg({ title: message, level: "success" }));
        } catch (e) {
            dispatch(setMsg({ title: "ERROR", level: "error", desc: (e as Error).message }))
        }
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="rounded-full h-6 w-6 relative border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-white cursor-pointer flex items-center justify-center">
                <span className="sr-only">options</span>
                <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    to={isConcession ? `edit/${parentId}/subprices` : link}
                                    state={{ concessionId: priceId }}
                                    className={classNames(
                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                    )}
                                >
                                    {f(messages[isConcession ? "editConcession" : "editPrice"])}
                                </Link>
                            )}
                        </Menu.Item>
                        {
                            deleting
                                ?
                                <LoadingIcon color="text-red-600" />
                                :
                                <Menu.Item>
                                    {({ active }) => (
                                        <div
                                            className={classNames(
                                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                "block px-4 py-2 text-sm cursor-pointer"
                                            )}
                                            onClick={() => handleDelete(f(messages[isConcession ? "concessionDeleted" : "priceDeleted"]))}
                                        >
                                            {f(messages[isConcession ? "deleteConcession" : "deletePriceDesc"])}
                                        </div>
                                    )}
                                </Menu.Item>
                        }
                        {isConcession ? null : (
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to={`edit/${priceId}/subprices`}
                                        className={classNames(
                                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                            "block px-4 py-2 text-sm"
                                        )}

                                    >
                                        {f(messages.createConcession)}
                                    </Link>
                                )}
                            </Menu.Item>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

export default PriceRowOptions