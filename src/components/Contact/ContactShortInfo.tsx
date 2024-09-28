import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import messages from "../../i18n/messages";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import Tooltip from "../Tooltip/Tooltip";
import LoadingIcon from "../Btn/LoadingIcon";
import React, { useState } from "react";
import { IContact } from "./interfaces";
import { useFormik } from "formik";
import ContactInput from "../FormHelpers/ContactInput";
import FieldWrap from "../Orders/FieldWrap";

interface IContactShortInfo {
  contact: IContact;
  update: any;
  error: any;
  loading: boolean;
  vertical?: boolean;
}

const ContactShortInfo = ({
  contact,
  update,
  loading,
  error,
  vertical = false,
}: IContactShortInfo) => {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();

  const handleOpenEditContactModal = () =>
    navigate(`${window.location.pathname}/contact/edit/${contact.id}`);

  const handleUnlinkContact = async (e: any) => {
    e.stopPropagation();
    try {
      await update({
        contact_id: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (isEmpty(contact.id))
    return (
      <div className="py-1">
        <FieldWrap label={f(messages.contact)} vertical={vertical}>
          <ContactSmallForm
            contact={contact}
            update={update}
            loading={loading}
            error={error}
          />
        </FieldWrap>
      </div>
    );

  return (
    <div className="py-1">
      <FieldWrap
        label={f(messages.contact)}
        vertical={vertical}
        className="items-start"
      >
        <div>
          <div
            className="flex group cursor-pointer"
            onClick={handleOpenEditContactModal}
          >
            <div className="font-bold">{contact.name}</div>
            <div className="ml-2 pt-0.5">
              <PencilAltIcon className="w-4 h-4 text-transparent group-hover:text-gray-400" />
            </div>
            <Tooltip content={f(messages.removeLinkToThisContact)}>
              <div className="ml-2 pt-0.5" onClick={handleUnlinkContact}>
                <TrashIcon className="w-4 h-4 text-transparent group-hover:text-gray-400" />
              </div>
            </Tooltip>
          </div>
          <div>{contact.email}</div>
          {contact.addr ? (
            <div>
              <div className="text-2xs">{contact.addr.street}</div>
              <div className="flex">
                <div className="text-2xs">
                  {contact.addr.postcode} {contact.addr.city}
                </div>
                <div className="text-2xs">{contact.addr.city}</div>
                <div className="text-2xs">{contact.addr.country}</div>
              </div>
            </div>
          ) : null}
          {loading ? <LoadingIcon color="text-yellow-500" /> : null}
        </div>
      </FieldWrap>
    </div>
  );
};

const ContactSmallForm = ({
  contact,
  update,
  loading,
  error,
}: IContactShortInfo) => {
  const { formatMessage: f } = useIntl();
  const [showFindContact, setShowFindContact] = useState(false);
  const handleToggleFindContact = () => setShowFindContact(!showFindContact);
  const formik = useFormik({
    initialValues: { contact_id: null },
    onSubmit,
  });

  async function onSubmit() {
    try {
      await update({
        contact_id: formik.values.contact_id || undefined,
      });
    } catch (e) {
      console.log("error", e);
    }
  }

  if (showFindContact)
    return (
      <div className="w-full pr-4">
        <ContactInput formik={formik} loading={loading} />
        {error ? <span className="text-red-800">${error.message}</span> : null}
      </div>
    );

  return (
    <div className="py-1">
      <button className="text-brand-600" onClick={handleToggleFindContact}>
        {f(messages.findOrCreateContact)}
      </button>
    </div>
  );
};

export default ContactShortInfo;
