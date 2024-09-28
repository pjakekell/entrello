import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "../Layout/SettingsLayout";
import LocationsListing from "../Location/LocationsListing";

const BreadcrumbConfig = {
    links: [
        {
            to: "/settings",
            text: messages.settings,
        },
        {
            to: "/settings/locations",
            text: messages.locations,
        },
    ],
};

export default function LocationSettings() {
    const { formatMessage: f } = useIntl();
    const navigate = useNavigate();

    const handleToggleNewLocationForm = () => {
        navigate(`/settings/locations/new`);
    };

    return (
        <SettingsLayout
            title={f(messages.locations)}
            config={BreadcrumbConfig}
            md={false}
            background={false}
            button
            buttonFunction={handleToggleNewLocationForm}
            buttonText={f(messages.createLocation)}
        >
            <LocationsListing />
        </SettingsLayout>
    );
}
