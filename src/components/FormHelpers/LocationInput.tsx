import React, { useEffect, useMemo, useState } from "react";
import { classNames } from "../../utils/misc";
import { useIntl } from "react-intl";
import Creatable from "react-select/creatable";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { FETCH_LOCATIONS, CREATE_LOCATION } from "../Location/logic";
import { PencilIcon } from "@heroicons/react/outline";
import CheckboxField from "./CheckboxField";

import messages from "../../i18n/messages";
import { setMsg } from "../Toaster/logic";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { customSelectStyles, selectTheme } from "../common/reactSelectTheme";
import { useNavigate } from "react-router";

interface ILocationInput {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
}

const LocationInput = ({ className, formik, name, label }: ILocationInput) => {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(FETCH_LOCATIONS);
  const [createLocation, { loading: creating, error: creationError }] =
    useMutation(CREATE_LOCATION);
  if (error) {
    dispatch(setMsg({ title: error.message }));
  }

  const handleCreate = async (locationName: string) => {
    if (isEmpty(locationName)) return;

    const {
      data: { CreateLocation: location },
    } = await createLocation({
      variables: {
        input: {
          name: locationName,
          address: {}
        }
      },
      refetchQueries: [
        {
          query: FETCH_LOCATIONS,
        },
      ],
    });
    formik.setFieldValue(name, location.id);
  };

  const renderCreateLabelText = (name: string) => (
    <span>
      {f(
        { id: "create location {name}" },
        { name, b: (...chunks) => <b key="ttt">{chunks}</b> }
      )}
    </span>
  );

  const locationOpts = useMemo(() => {
    return data && data.locations
      ? data.locations.map((l: any) => ({ value: l.id, label: l.name }))
      : [];
  }, [data]);

  const [selectedOption, setSelecedOption] = useState(locationOpts.find(
    (l: any) => l.value === formik.values[name]
  ))
  useEffect(() => {
    setSelecedOption(locationOpts.find(
      (l: any) => l.value === formik.values[name]
    ))
  }, [locationOpts, formik.values, name])

  const handleToggleLocationAddress = () => {
    navigate(`${selectedOption.value}/edit`);
  };

  const renderLocationActions = () => (
    <div className="flex">
      {formik.values[name] ? (
        <button
          className="ml-auto flex text-xs text-gray-500 items-center"
          onClick={handleToggleLocationAddress}
        >
          <PencilIcon className="w-3 h-3 mr-2" />
          <span>{f(messages.editLocation)}</span>
        </button>
      ) : null}
    </div>
  );

  return (
    <div className={classNames(className)}>
      <div className="flex justify-between items-end">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="text-2xs text-gray-500">
          <CheckboxField
            name="featureOnlineEvent"
            label={f(messages.onlineEvent)}
            tabIndex={-1}
            small
            formik={formik}
          />
        </div>
      </div>
      <Creatable
        className="react-select"
        theme={selectTheme}
        isClearable
        onChange={(item: any) =>
          formik.setFieldValue(name, item ? item.value : null)
        }
        formatCreateLabel={renderCreateLabelText}
        onCreateOption={handleCreate}
        styles={customSelectStyles}
        isDisabled={loading || creating || formik.values.featureOnlineEvent}
        isLoading={loading || creating}
        value={selectedOption ? selectedOption : null}
        isSearchable
        placeholder={
          formik.values.featureOnlineEvent
            ? f(messages.online)
            : `${f(messages.selectLocation)}...`
        }
        name="location_id"
        options={locationOpts}
      />
      {formik.values.featureOnlineEvent ? null : renderLocationActions()}
      <div>
        {formik.touched[name] && formik.errors[name] ? (
          <p className="mt-2 text-sm text-red-600" id="name-error">
            {formik.errors[name]}
          </p>
        ) : null}
        {creationError ? (
          <p className="mt-2 text-sm text-red-600" id="name-error">
            {creationError}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default LocationInput;
