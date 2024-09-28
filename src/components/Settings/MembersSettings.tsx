import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "../Layout/SettingsLayout";
import MembersListing from "../Members/MembersListing";

const BreadcrumbConfig = {
    links: [
        {
            to: "/settings",
            text: messages.settings,
        },
        {
            to: "/settings/members",
            text: messages.members,
        },
    ],
};

export default function MembersSettings() {
    const { formatMessage: f } = useIntl();
    const navigate = useNavigate();

    const handleToggleNewMembers = () => {
        navigate(`/settings/members/new`);
    };

    return (
        <SettingsLayout
            config={BreadcrumbConfig}
            title={f(messages.members)}
            background={false}
            button
            md={false}
            buttonFunction={handleToggleNewMembers}
            buttonText={f(messages.inviteUsers)}
        >
            <MembersListing />
        </SettingsLayout>
    );
}
