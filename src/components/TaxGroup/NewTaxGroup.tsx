import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { buildTaxGroup } from "./logic";

import TaxGroupForm from "./TaxGroupForm";
import { SettingsLayout } from "../Layout/SettingsLayout";

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
      to: "/settings/taxes/new",
      text: messages.newTaxGroup,
    },
  ],
};

export default function TaxSettings() {
  const { formatMessage: f } = useIntl();
  return (
    <SettingsLayout config={BreadcrumbConfig} title={f(messages.newTaxGroup)}>
      <TaxGroupForm tax={buildTaxGroup()} />
    </SettingsLayout>
  );
}
