import React from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { FETCH_TAX_GROUP_BY_ID } from "./logic";

import TaxGroupForm from "./TaxGroupForm";
import { useQuery } from "@apollo/react-hooks";
import { SettingsLayout } from "../Layout/SettingsLayout";

export default function TaxSettings() {
  const { id } = useParams();
  const { formatMessage: f } = useIntl();
  const { error, data } = useQuery(FETCH_TAX_GROUP_BY_ID, {
    variables: { id },
  });

  if (error) return <div>{error}</div>;

  const taxGroup = data && data.tax_group ? data.tax_group : null;

  const BreadcrumbConfig = {
    links: [
      {
        to: "/settings",
        text: messages.settings,
      },
      {
        to: "/settings/taxes",
        text: messages.taxGroups,
      },
      {
        to: `/settings/taxes/edit/${taxGroup?.id}`,
        text: messages.editTax,
      },
    ],
  };

  return (
    <SettingsLayout title={f(messages.editTax)} config={BreadcrumbConfig}>
      {taxGroup ? <TaxGroupForm tax={taxGroup} /> : f(messages.loading)}
    </SettingsLayout>
  );
}
