import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "../Layout/SettingsLayout";
import PriceTemplatesListing from "../Prices/PriceTemplates/PriceTemplatesListing";

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/priceTemplates",
      text: messages.priceTemplates,
    },
  ],
};

export default function PriceTemplatesSettings() {
    const { formatMessage: f } = useIntl();
    const navigate = useNavigate();

    const handleToggleNewPriceTemplateForm = () => {
        navigate(`/settings/priceTemplates/new`);
    };

    return (
        <SettingsLayout
          title={f(messages.priceTemplates)}
          config={BreadcrumbConfig}
          md={false}
          background={false}
          button
          buttonFunction={handleToggleNewPriceTemplateForm}
          buttonText={f(messages.createPriceTemplate)}
        >
          <PriceTemplatesListing />
        </SettingsLayout>
    );
}
