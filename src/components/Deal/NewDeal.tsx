import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { buildDeal } from "./logic";

import DealForm from "./DealForm";
import { SettingsLayout } from "../Layout/SettingsLayout";

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/deals",
      text: messages.deals,
    },
    {
      to: "/settings/deals/new",
      text: messages.newDeal,
    },
  ],
};

export default function TaxSettings() {
  const { formatMessage: f } = useIntl();
  return (
    <SettingsLayout title={f(messages.newDeal)} config={BreadcrumbConfig}>
      <DealForm deal={buildDeal()} />
    </SettingsLayout>
  );
}
