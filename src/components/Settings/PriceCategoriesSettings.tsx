import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "../Layout/SettingsLayout";
import PriceCategoriesListing from "../Prices/PriceCategories/PriceCategoriesListing";

const BreadcrumbConfig = {
    links: [
        {
            to: "/settings",
            text: messages.settings,
        },
        {
            to: "/settings/pricecategories",
            text: messages.priceCategories,
        },
    ],
};

export default function PriceCategoriesSettings() {
    const { formatMessage: f } = useIntl();
    const navigate = useNavigate();

    const handleToggleNewPriceCategoryForm = () => {
        navigate(`/settings/pricecategories/new`);
    };

    return (
        <SettingsLayout
            title={f(messages.priceCategories)}
            config={BreadcrumbConfig}
            md={false}
            background={false}
            button
            buttonFunction={handleToggleNewPriceCategoryForm}
            buttonText={f(messages.createPriceCategory)}
        >
            <PriceCategoriesListing />
        </SettingsLayout>
    );
}
