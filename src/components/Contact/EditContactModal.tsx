import React, { Fragment, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { IContact } from "./interfaces";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { FETCH_CONTACT_BY_ID, UPDATE_CONTACT, buildContact } from "./logic";

import messages from "../../i18n/messages";

// @ts-ignore @headlessui/react@dev has no up-to-date type defs
import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import ContactForm from "./ContactForm";
import { useParams } from "react-router";

export default function EditContactModal() {
  const [show, setShow] = useState(false);
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { formatMessage: f } = useIntl();
  const focusFieldRef = useRef(null);
  const [updateContact, { loading: saving, error: saveErr }] = useMutation(
    UPDATE_CONTACT,
    {
      update(cache: any, { data: { UpdateContact: contact } }: any) {
        cache.modify({
          id: cache.identify(contact),
          fields: {
            firstname() {
              return contact.firstname;
            },
            lastname() {
              return contact.lastname;
            },
            email() {
              return contact.email;
            },
            phone() {
              return contact.phone;
            },
          },
        });
      },
    }
  );
  const {
    data: contactData,
    loading,
    error,
  } = useQuery(FETCH_CONTACT_BY_ID, {
    variables: { id: contactId },
  });

  const contact = buildContact(
    contactData && contactData.contact ? contactData.contact : {}
  );

  const handleClose = () => {
    navigate(window.location.pathname.split("/contact/edit")[0]);
  };

  const handleSave = async (contact: IContact) => {
    const { data } = await updateContact({ variables: contact });
    if (error) {
      console.log("error", error);
    }
    console.log("TODO: FINISH THAT result:", data);
  };

  useEffect(() => setShow(true), []);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={focusFieldRef}
        open
        onClose={handleClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-brand-600"
                  >
                    {f(messages.editContact)}
                  </Dialog.Title>
                </div>
                <div
                  className="mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 sm:-mt-2 sm:-mr-2 sm:h-10 sm:w-10 cursor-pointer"
                  onClick={handleClose}
                >
                  <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                </div>
              </div>
              {error || saveErr ? (
                <div className="bg-red-100 rounded shadow my-4 p-4 text-red-800">
                  {error ? error.message : null}
                  {saveErr ? saveErr.message : null}
                </div>
              ) : null}
              <div>
                <div className="mt-2">
                  <ContactForm
                    contact={contact}
                    handleClose={handleClose}
                    handleSave={handleSave}
                    loading={loading || saving}
                    focusFieldRef={focusFieldRef}
                  />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
