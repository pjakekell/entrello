import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "../Layout/SettingsLayout";
import PriceNamesListing from "../Prices/PriceName/PriceNamesListing";

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/pricenames",
      text: messages.priceNames,
    },
  ],
};

export default function PriceNamesSettings() {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();

  const handleToggleNewPriceNameForm = () => {
    navigate(`/settings/pricenames/new`);
  };

  return (
    <SettingsLayout
      title={f(messages.priceNames)}
      config={BreadcrumbConfig}
      md={false}
      background={false}
      button
      buttonFunction={handleToggleNewPriceNameForm}
      buttonText={f(messages.createPriceName)}
    >
      <PriceNamesListing />
    </SettingsLayout>
  );
}
