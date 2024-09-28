import React from "react";
import { useIntl } from "react-intl";

import CheckboxField from "../FormHelpers/CheckboxField";
import messages from "../../i18n/messages.js";
import { ORDER_MORE_STATUS } from "../Orders/logic";
interface IOrderFilterStatusPanelParams {
  statusFormik: any;
};

export default function OrderFilterStatusPanel({
  statusFormik
}: IOrderFilterStatusPanelParams) {
  const { formatMessage: f } = useIntl();

  return (
    <div>
      {
        Object.keys(ORDER_MORE_STATUS).map(key => (
          <CheckboxField
            key={key}
            className="mb-2"
            formik={statusFormik}
            name={key}
            value={statusFormik.values[key]}
            light={true}
            label={f(messages[key as keyof typeof messages])}
          />
        ))
      }
    </div>
  );
}