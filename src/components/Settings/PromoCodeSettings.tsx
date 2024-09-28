import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "../Layout/SettingsLayout";
import PromoCodeListing from "../Prices/PromoCode/PromoCodeListing";

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/promocodes",
      text: messages.promoCodes,
    },
  ],
};

export default function PromoCodeSettings() {
    const { formatMessage: f } = useIntl();
    const navigate = useNavigate();

    const handleToggleNewPromoCodeForm = () => {
      navigate(`/settings/promocode/new`);
    };

    return (
        <SettingsLayout
          title={f(messages.promoCodes)}
          config={BreadcrumbConfig}
          md={false}
          background={false}
          button
          buttonFunction={handleToggleNewPromoCodeForm}
          buttonText={f(messages.createPromoCode)}
        >
          <PromoCodeListing />
        </SettingsLayout>
    );
}