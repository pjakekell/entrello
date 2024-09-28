import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import DealListing from "../Deal/DealListing";
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
  ],
};

export default function TaxSettings() {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();

  const handleToggleNewDealForm = () => {
    navigate(`/settings/deals/new`);
  };

  return (
    <SettingsLayout
      title={f(messages.deals)}
      config={BreadcrumbConfig}
      md={false}
      background={false}
      button
      buttonFunction={handleToggleNewDealForm}
      buttonText={f(messages.createDeal)}
    >
      <DealListing />
    </SettingsLayout>
  );
}
