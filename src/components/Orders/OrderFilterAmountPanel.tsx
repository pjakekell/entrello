import React from "react";
import { ReplyIcon } from "@heroicons/react/solid";
import { FormikProps } from "formik";

import SelectSeason from "../Events/EventsListingHeader/SelectSeason";
import classNames from "classnames";
interface IOrderFilterAmountPanelParams {
  amountOptions: {
    id: number;
    name: string;
  }[],
  props: FormikProps<any>,
  isRequired: boolean
};

export default function OrderFilterAmountPanel({
  props,
  amountOptions,
  isRequired
}: IOrderFilterAmountPanelParams) {
  return (
    <div>
      <SelectSeason
        name="amount"
        options={amountOptions}
        value={props.values.amount}
        props={props}
      />
      <div className="flex my-2">
        <ReplyIcon className="w-4 rotate-180 mr-1 fill-brand-500"/>
        <div className="flex items-center">
          <input
            className={
              classNames(
                "appearance-none block w-48 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm",
                props.values.amount.name === "is between" ? "w-20" : "w-48"
              )
            }
            name="amountNumStart"
            type="number"
            onChange={(e) => props.setFieldValue("amountNumStart", e.target.value)}
            value={props.values.amountNumStart}
            required={isRequired}
          />
          {
            props.values.amount.name === "is between" &&
            <>
              <span className="mx-2">and</span>
              <input
                className="appearance-none block w-20 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                name="amountNumEnd"
                type="number"
                onChange={(e) => props.setFieldValue("amountNumEnd", e.target.value)}
                value={props.values.amountNumEnd}
                required={isRequired}
              />            
            </>
          }
        </div>
      </div>
    </div>
  );
}