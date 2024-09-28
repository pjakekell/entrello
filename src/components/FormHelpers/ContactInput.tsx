import React from "react";
import { classNames } from "../../utils/misc";
import { useIntl } from "react-intl";
import Creatable from "react-select/creatable";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { FETCH_CONTACTS, CREATE_CONTACT } from "../Contact/logic";
import { PencilIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/outline";

import messages from "../../i18n/messages";
import { setMsg } from "../Toaster/logic";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { customSelectStyles, selectTheme } from "../common/reactSelectTheme";

interface IContactInput {
  className?: string;
  loading?: boolean;
  formik: any; // couldn't find formik's return typem
  shouldSubmit?: boolean;
}

const ContactInput = ({
  className,
  formik,
  loading: loadingSave,
  shouldSubmit = true
}: IContactInput) => {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const { loading: loadingContacts, error, data } = useQuery(FETCH_CONTACTS);
  const loading = loadingContacts || loadingSave;
  const [createContact, { loading: creating, error: creationError }] =
    useMutation(CREATE_CONTACT);
  if (error) {
    dispatch(setMsg({ title: error.message }));
  }

  const handleCreate = async (contactName: string) => {
    if (isEmpty(contactName)) return;

    const {
      data: { CreateContact: contact },
    } = await createContact({
      variables: { name: contactName },
      refetchQueries: [
        {
          query: FETCH_CONTACTS,
        },
      ],
    });
    formik.setFieldValue("contact_id", contact.id);
    shouldSubmit && formik.submitForm();
  };

  const renderCreateLabelText = (name: string) => (
    <span>
      {f(
        { id: "create contact {name}" },
        { name, b: (...chunks) => <b key="ttt">{chunks}</b> }
      )}
    </span>
  );

  const contactOpts =
    data && data.contacts
      ? data.contacts.map((l: any) => ({ value: l.id, label: l.name }))
      : [];

  const selectedOption = contactOpts.find(
    (l: any) => l.value === formik.values.contact_id
  );

  const handleToggleContactAddress = () => {
    console.log("noet yet");
  };

  // const handleCreateNewContact = () =>
  //   navigate(`${history.contact.pathname}/contact`);

  const renderContactActions = () => (
    <div className="flex">
      {formik.values.contact_id ? (
        <button
          className="ml-auto flex text-xs text-gray-500 items-center"
          onClick={handleToggleContactAddress}
        >
          <PencilIcon className="w-3 h-3 mr-2" />
          <span>{f(messages.editAddress)}</span>
        </button>
      ) : null}
    </div>
  );

  return (
    <div className={classNames("w-full", className)}>
      <div className="w-full flex justify-between items-end">
        <div className="w-full mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pt-1 pl-2 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Creatable
            className="react-select w-full"
            theme={selectTheme}
            isClearable
            onChange={(item: any) => {
              formik.setFieldValue("contact_id", item ? item.value : null);
              shouldSubmit && formik.submitForm();
            }}
            formatCreateLabel={renderCreateLabelText}
            onCreateOption={handleCreate}
            styles={customSelectStyles}
            isDisabled={loading || creating || formik.values.featureOnlineEvent}
            isLoading={loading || creating}
            value={selectedOption}
            isSearchable
            placeholder={
              formik.values.featureOnlineEvent
                ? f(messages.online)
                : `${f(messages.selectContact)}...`
            }
            name="contact_id"
            options={contactOpts}
          />
        </div>
        {formik.values.featureOnlineEvent ? null : renderContactActions()}
        <div>
          {creationError ? (
            <p className="mt-2 text-sm text-red-600" id="name-error">
              {creationError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContactInput;
