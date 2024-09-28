import React from "react";
import { classNames } from "../../utils/misc";
import { useIntl } from "react-intl";
import { setMsg } from "../Toaster/logic";
import { useDispatch } from "react-redux";
import { CREATE_SEAT_GROUP } from "../SeatGroup/logic";
import Creatable from "react-select/creatable";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { FETCH_SEAT_GROUPS } from "../SeatGroup/logic";
import { PlusCircleIcon, PencilIcon } from "@heroicons/react/outline";

import messages from "../../i18n/messages";
import { isEmpty } from "lodash";
import LoadingIcon from "../Btn/LoadingIcon";
import { selectTheme } from "../common/reactSelectTheme";

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    minHeight: "32px",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    "> div": {
      padding: "6px",
    },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

interface ISeatGroupInput {
  className?: string;
  formik: any;
  placeholder?: string;
  disabled?: boolean;
  name: string;
  label: string;
  seating_plan_id: string;
  parent_id?: string | null;
}

const SeatGroupInput = ({
  className,
  formik,
  name,
  placeholder,
  disabled,
  label,
  seating_plan_id,
  parent_id,
}: ISeatGroupInput) => {
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();
  const [createSeatGroup, { loading: creating }] =
    useMutation(CREATE_SEAT_GROUP);
  const { loading, error, data } = useQuery(FETCH_SEAT_GROUPS, {
    variables: { parent_id, seating_plan_id },
  });
  if (error) {
    dispatch(setMsg({ title: error.message }));
  }

  const handleCreate = async (sgrName: string) => {
    if (isEmpty(sgrName)) return;

    const { data }: any = await createSeatGroup({
      variables: { input: { name: sgrName, parent_id, seating_plan_id } },
      refetchQueries: [
        {
          query: FETCH_SEAT_GROUPS,
          variables: { parent_id, seating_plan_id },
        },
      ],
    });
    if (data.CreateSeatGroup && data.CreateSeatGroup.id)
      formik.setFieldValue(name, data.CreateSeatGroup.id);
  };

  const seatGroupOpts =
    data && data.seat_groups
      ? data.seat_groups.map((l: any) => ({
        value: l.id,
        label: `${l.name} ${l.num}`,
      }))
      : [];

  const selectedOption = seatGroupOpts.find(
    (l: any) => l.value === formik.values[name]
  );

  const handleToggleSeatGroupAddress = () => {
    console.log("noet yet");
  };

  const handleCreateNewSeatGroup = () => console.log("create new seat group");

  const secOrSgrName: any =
    name === "section_id" ? messages.newSection : messages.newSeatGroup;

  const secOrSgrEditLabel: any =
    name === "section_id" ? messages.editSection : messages.editSeatGroup;

  const renderSeatGroupActions = () => (
    <div className="flex">
      {formik.values[name] ? (
        <button
          className="ml-auto flex text-xs text-gray-500 items-center"
          onClick={handleToggleSeatGroupAddress}
        >
          <PencilIcon className="w-3 h-3 mr-2" />
          <span>{f(secOrSgrEditLabel)}</span>
        </button>
      ) : (
        <button
          className="ml-auto flex text-xs text-brand-500 hover:text-brand-600 items-center"
          onClick={handleCreateNewSeatGroup}
        >
          <PlusCircleIcon className="w-3 h-3 mr-1" />
          <span>{f(secOrSgrName)}</span>
        </button>
      )}
    </div>
  );

  const renderCreateLabelText = (name: string) => (
    <span>
      {f(messages.create)}: {label} <span className="font-bold">{name}</span>
    </span>
  );

  return (
    <div className={classNames(className)}>
      <div className="flex justify-between items-end mb-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
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
        styles={customStyles}
        isDisabled={disabled || loading || formik.values.featureOnlineEvent}
        isLoading={loading}
        value={selectedOption}
        isSearchable
        placeholder={placeholder}
        name="seatGroup_id"
        options={seatGroupOpts}
        menuPortalTarget={document.body}
      />
      {renderSeatGroupActions()}
      <div>
        {formik.touched[name] && formik.errors[name] ? (
          <p className="mt-2 text-sm text-red-600" id="name-error">
            {formik.errors[name]}
          </p>
        ) : null}
      </div>
      {creating ? (
        <div className="pt-2">
          <LoadingIcon /> {f(messages.loading)}...
        </div>
      ) : null}
    </div>
  );
};

export default SeatGroupInput;
