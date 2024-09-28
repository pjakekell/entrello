import React, { useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { useIntl } from "react-intl";
import Select from "react-select";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import messages from "../../../i18n/messages";
import { IEvent } from "../../Event/interfaces"
import ContactInput from "../../FormHelpers/ContactInput";
import Error from "../../Error";
import { FETCH_CONTACTS } from "../../Contact/logic";
import { IContact } from "../../Contact/interfaces";
import InputField from "../../FormHelpers/InputField";
import { IGeneralOrderTab } from "./interfaces";
import { customSelectStyles, selectTheme } from "../reactSelectTheme";

export default function GeneralOrderTab(props: IGeneralOrderTab) {
    const { formik, eventsLoading, events } = props;
    const [showEventSelect, setShowEventSelect] = useState(false);
    const [showContactSelect, setShowContactSelect] = useState(false);
    const [contact, setContact] = useState<IContact>();
    const { formatMessage: f, formatDate: d } = useIntl();
    const { loading: loadingContacts, error: contactsError, data: contactsData } = useQuery(FETCH_CONTACTS);

    useEffect(() => {
        if (contactsData) {
            const contact = contactsData.contacts.find((c: IContact) => c.id === formik.values.contact_id);
            setContact(contact);
        }
        if (formik.values.contact_id !== '') {
            setShowContactSelect(false);
        }
    }, [formik.values.contact_id, contactsData]);

    if (contactsError) return <Error error={contactsError} />;

    return (
        <>
            <div>

                <h4 className="text-base leading-5 font-medium mt-3">{f(messages.events)}</h4>
                {formik.values.linkedEvent.id ? (
                    <div className="flex text-sm align-middle my-3 first:mt-5" key={formik.values.linkedEvent.id}>{formik.values.linkedEvent.title}<span className="ml-1">{d(formik.values.linkedEvent.starts_at, {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    })}</span>
                        <button
                            type="button"
                            className="ml-auto flex-shrink-0 flex items-center justify-center h-4 w-4 sm:h-4 sm:w-4 cursor-pointer"
                            onClick={() => {
                                formik.setFieldValue('linkedEvent', {});
                                setShowEventSelect(false);
                            }}
                        >
                            <XIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                        </button>
                    </div>
                ) : null}

                {
                    showEventSelect ? (
                        <Select
                            className="react-select"
                            options={events}
                            theme={selectTheme}
                            value={null}
                            onChange={(event) => {
                                formik.setFieldValue('linkedEvent', event);
                                setShowEventSelect(false);
                            }}
                            isLoading={eventsLoading}
                            isClearable={true}
                            getOptionLabel={(event: IEvent) => event.title}
                            styles={customSelectStyles}
                        />
                    ) : (!formik.values.linkedEvent.id ? (
                        <button
                            onClick={() => setShowEventSelect(true)}
                            type="button"
                            className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-1 sm:px-2 sm:py-1 border-1 rounded-full shadow-sm text-sm font-medium text-brand-500 hover:text-white border-brand-500 hover:bg-brand-500 mr-2">
                            <FontAwesomeIcon icon={faPlus} className="sm:mr-2 h-3 w-3" />
                            <span className="uppercase sm:inline">
                                {f(messages.addEvent)}
                            </span>
                        </button>
                    ) : null)
                }
            </div>
            <div>
                <h4 className="text-base leading-5 font-medium mt-3">{f(messages.contact)}</h4>
                {showContactSelect ? (
                    <ContactInput shouldSubmit={false} formik={formik} loading={loadingContacts} />
                ) : (
                    formik.values.contact_id === '' ? (
                        <button
                            onClick={() => setShowContactSelect(true)}
                            type="button"
                            className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-1 sm:px-2 sm:py-1 border-1 rounded-full shadow-sm text-sm font-medium text-brand-500 hover:text-white border-brand-500 hover:bg-brand-500 mr-2">
                            <span className="uppercase sm:inline">
                                {f(messages.findOrCreateContact)}
                            </span>
                        </button>
                    ) : (
                        contact && contact.name ? (
                            <div className="flex text-sm my-3">{contact.name}
                                <button
                                    type="button"
                                    className="ml-auto flex-shrink-0 flex items-center justify-center h-4 w-4 sm:h-4 sm:w-4 cursor-pointer"
                                    onClick={() => {
                                        formik.setFieldValue('contact_id', "");
                                        setShowContactSelect(false)
                                    }}
                                >
                                    <XIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                                </button>
                            </div>
                        ) : null
                    )
                )
                }
            </div>
            <div className="mt-3">
                <InputField onBlur={false} name="split_order_id" formik={formik} label={f(messages.linkOrderId)} />
            </div>
        </>
    )
}