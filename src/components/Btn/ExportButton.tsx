import React, { Fragment, useState, useCallback } from "react";
import { SaveIcon, XIcon } from "@heroicons/react/solid";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { useIntl } from "react-intl";

import { DateRange } from "react-date-range-ts";
import messages from "../../i18n/messages.js";
import { exportOrdersAsCSV, exportOrdersAsXLSX } from "../Orders/logic";

import "react-date-range-ts/dist/styles.css"; // main style file
import "react-date-range-ts/dist/theme/default.css"; // theme css file

interface IExportButtonParams {
  event_sync_id: string;
  status_code?: number;
  order_type?: string;
}

const ExportButton = ({
  event_sync_id,
  status_code,
  order_type,
}: IExportButtonParams) => {
  const [isOpen, setOpen] = useState(false);
  const [exportCategory, setExportCategory] = useState(0); //0: csv, 1: xlsx
  const { formatMessage: f } = useIntl();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const exportCSV = async (params: object) => {
    const response = await exportOrdersAsCSV(params);
    if (response) {
      console.log("CSV link", window.URL.createObjectURL(response));
    }
  };

  const exportXLSX = async (params: object) => {
    const response = await exportOrdersAsXLSX(params);
    if (response) {
      console.log("XLSX link", window.URL.createObjectURL(response));
    }
  };

  const handleExport = useCallback(() => {
    const params = {
      event_sync_id,
      split_order_id: "",
      order_type,
      label_ids: "",
      status_code,
      from: new Date(dateRange[0].startDate),
      to: dateRange[0].endDate ? new Date(dateRange[0].endDate) : null,
      limit: 50,
    };

    if (exportCategory === 0) exportCSV(params);
    else exportXLSX(params);
  }, [exportCategory, event_sync_id, status_code, order_type, dateRange]);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center sm:justify-start text-center sm:text-left px-2 mr-2 sm:py-2 text-sm font-medium text-brand-500"
        onClick={openModal}
      >
        <SaveIcon className="w-4 h-4" aria-hidden="true" />
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <RadioGroup
                    value={exportCategory}
                    onChange={setExportCategory}
                  >
                    <div className="flex items-center mb-5">
                      <RadioGroup.Option
                        value={0}
                        className="cursor-pointer mr-5"
                      >
                        {({ checked }) => (
                          <>
                            <input
                              type="radio"
                              className="mr-2"
                              checked={checked}
                              onChange={() => !!checked && setExportCategory(0)}
                            />
                            <span className={checked ? "text-blue-500" : ""}>
                              CSV
                            </span>
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value={1} className="cursor-pointer">
                        {({ checked }) => (
                          <>
                            <input
                              type="radio"
                              className="mr-2"
                              checked={checked}
                              onChange={() => !!checked && setExportCategory(1)}
                            />
                            <span className={checked ? "text-blue-500" : ""}>
                              XLSX
                            </span>
                          </>
                        )}
                      </RadioGroup.Option>
                      <XIcon
                        className="ml-auto w-4 h-4 text-gray-500 cursor-pointer"
                        onClick={() => setOpen(false)}
                      />
                    </div>
                  </RadioGroup>
                  <DateRange
                    className="w-full"
                    editableDateInputs={true}
                    onChange={(item: any) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                  />
                  <button
                    type="button"
                    className="flex items-center justify-center mt-2 ml-auto sm:justify-start text-center sm:text-left px-2 mr-2 sm:px-4 sm:py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    onClick={handleExport}
                  >
                    {f(messages.export)}
                  </button>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ExportButton;
