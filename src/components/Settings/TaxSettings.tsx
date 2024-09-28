import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import TaxGroupListing from "../TaxGroup/TaxGroupListing";
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
  ],
};

export default function TaxSettings() {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();

  const handleToggleNewTaxGroupForm = () => {
    navigate(`/settings/taxes/new`);
  };

  return (
    <SettingsLayout
      config={BreadcrumbConfig}
      title={f(messages.taxGroups)}
      background={false}
      button
      md={false}
      buttonFunction={handleToggleNewTaxGroupForm}
      buttonText={f(messages.createTaxGroup)}
    >
      <TaxGroupListing />
    </SettingsLayout>
  );
}
