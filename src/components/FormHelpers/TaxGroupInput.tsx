import React, { useState } from "react";
import { classNames } from "../../utils/misc";
import { useIntl } from "react-intl";
import { setMsg } from "../Toaster/logic";
import { useDispatch } from "react-redux";
import Creatable from "react-select/creatable";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_TAX_GROUPS } from "../TaxGroup/logic";
import { PlusCircleIcon, PencilIcon } from "@heroicons/react/outline";
import { customSelectStyles, selectTheme } from "../common/reactSelectTheme";


import messages from "../../i18n/messages";
import { isEmpty } from "lodash";
import TaxGroupModal from "../TaxGroup/TaxGroupModal";

interface ITaxGroupInput {
  className?: string;
  formik: any; // couldn't find formik's return type
  name: string;
  label: string;
  disableEdit?: boolean;
}

const TaxGroupInput = ({ className, formik, name, label, disableEdit }: ITaxGroupInput) => {
  const [isTaxGroupModalOpen, setIsTaxGroupModalOpen] = useState(false);
  const [isModalCreating, setIsModalCreating] = useState(false);
  const [creatingTaxGroupName, setCreatingTaxGroupName] = useState("");
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(FETCH_TAX_GROUPS);
  if (error) {
    dispatch(setMsg({ title: error.message }));
  }

  const handleCreate = async (name: string) => {
    if (isEmpty(name) || disableEdit) return;
    setIsTaxGroupModalOpen(true);
    setIsModalCreating(true);
    setCreatingTaxGroupName(name);
  };

  const renderCreateLabelText = (name: string) => {
    return (
      <span>

        {disableEdit ? '' : f(
          { id: "create a tax group {name}" },
          { name, b: (...chunks) => <b key="ttt">{chunks}</b> }
        )}
      </span>
    );
  }

  const tax_groupOpts =
    data && data.tax_groups
      ? data.tax_groups.map((l: any) => ({
        value: l.id,
        label: `${l.name} (${(l.tax_rate * 100.0).toFixed(2)} %)`,
        id: l.id,
        name: l.name,
        tax_rate: l.tax_rate,
      }))
      : [];

  const selectedOption = tax_groupOpts.find((l: any, idx: number) => {
    if (formik.values[name]) return l.value === formik.values[name];
    if (idx === 0) return true;
    return false;
  });

  const handleToggleTaxGroupAddress = () => {
    setIsTaxGroupModalOpen(true);
    setIsModalCreating(false);
  };

  const handleCreateNewTaxGroup = () => {
    setIsTaxGroupModalOpen(true);
    setIsModalCreating(true);
    setCreatingTaxGroupName('');
  }

  const renderTaxGroupActions = () => (
    <div className="flex justify-end">
      {formik.values[name] ? (
        <>
          <button
            type="button"
            className="ml-auto flex text-xs text-brand-500 hover:text-brand-600 items-center"
            onClick={handleCreateNewTaxGroup}
          >
            <PlusCircleIcon className="w-3 h-3 mr-1" />
            <span>{f(messages.newTaxGroup)}</span>
          </button>
          <button
            type="button"
            className="ml-2 flex text-xs text-gray-500 items-center"
            onClick={handleToggleTaxGroupAddress}
          >
            <PencilIcon className="w-3 h-3 mr-2" />
            <span>{f(messages.edit)}</span>
          </button>
        </>
      ) : (
        <button
          className="ml-auto flex text-xs text-brand-500 hover:text-brand-600 items-center"
          onClick={handleCreateNewTaxGroup}
        >
          <PlusCircleIcon className="w-3 h-3 mr-1" />
          <span>{f(messages.newTaxGroup)}</span>
        </button>
      )}
    </div>
  );
  const handleTaxGroupModalState = (state: boolean, newValue?: string) => {
    newValue && formik.setFieldValue(name, newValue);
    setIsTaxGroupModalOpen(state);
  }
  return (
    <div className={classNames(className)}>
      <div className="flex justify-between items-end mb-1">
        <label
          htmlFor="name"
          className="block text-sm font-normal text-gray-700"
        >
          {label}
        </label>
      </div>
      <Creatable
        className="react-select"
        theme={selectTheme}
        isClearable
        onChange={(item: any) => {
          formik.setFieldValue(name, item ? item.value : null)
        }}
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
            : `${f(messages.selectTaxGroup)}...`
        }
        name="tax_group_id"
        options={tax_groupOpts}
      />
      {formik.values.featureOnlineEvent || disableEdit ? null : renderTaxGroupActions()}
      <div>
        {formik.touched[name] && formik.errors[name] ? (
          <p className="mt-2 text-sm text-red-600" id="name-error">
            {formik.errors[name]}
          </p>
        ) : null}
      </div>
      {isTaxGroupModalOpen ? <TaxGroupModal creatingTaxGroupName={creatingTaxGroupName} selectedOption={selectedOption} isModalCreating={isModalCreating} handleTaxGroupModalState={handleTaxGroupModalState} /> : null}

    </div>
  );
};

export default TaxGroupInput;
