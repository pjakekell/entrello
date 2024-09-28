import React from "react";
import { classNames } from "../../utils/misc";
import { useIntl } from "react-intl";
import { setMsg } from "../Toaster/logic";
import { useDispatch } from "react-redux";
import Creatable from "react-select/creatable";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_LOCATIONS } from "../Location/logic";

import messages from "../../i18n/messages";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { customSelectStyles, selectTheme } from "../common/reactSelectTheme";

interface ISelectInputField {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
  cornerHint?: React.ReactNode;
}

const SelectInputField = ({
  className,
  formik,
  name,
  cornerHint,
  label,
}: ISelectInputField) => {
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(FETCH_LOCATIONS);
  if (error) {
    dispatch(setMsg({ title: error.message }));
  }

  const handleCreate = async (name: string) => {
    if (isEmpty(name)) return;

    navigate(`${window.location.pathname}/location`);
    // const {
    //   data: { createLocation: location },
    // } = await createLocation({ variables: { name } });
    // formik.setFieldValue(name, location.id);
  };

  const renderCreateLabelText = (name: string) => (
    <span>
      {f(
        { id: "create location {name}" },
        { name, b: (...chunks) => <b key="ttt">{chunks}</b> }
      )}
    </span>
  );

  const locationOpts =
    data && data.locations
      ? data.locations.map((l: any) => ({ value: l.id, label: l.name }))
      : [];

  const selectedOption = locationOpts.find(
    (l: any) => l.value === formik.values[name]
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
        <div className="text-2xs text-gray-500">{cornerHint}</div>
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
        isDisabled={loading || formik.values.featureOnlineEvent}
        isLoading={loading}
        value={selectedOption}
        isSearchable
        placeholder={
          formik.values.featureOnlineEvent
            ? f(messages.online)
            : `${f(messages.selectLocation)}...`
        }
        name="location_id"
        options={locationOpts}
      />
      <div>
        {formik.touched[name] && formik.errors[name] ? (
          <p className="mt-2 text-sm text-red-600" id="name-error">
            {formik.errors[name]}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SelectInputField;
