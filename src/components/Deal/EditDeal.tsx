import React from "react";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import { FETCH_DEAL_BY_ID } from "./logic";

import DealForm from "./DealForm";
import { useQuery } from "@apollo/react-hooks";
import { SettingsLayout } from "../Layout/SettingsLayout";

export default function TaxSettings() {
  const { id } = useParams();
  const { formatMessage: f } = useIntl();
  const { error, data } = useQuery(FETCH_DEAL_BY_ID, {
    variables: { id },
  });

  if (error) return <div>{error}</div>;

  const dealGroup = data && data.deal ? data.deal : null;

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
        to: `/settings/deals/edit/${dealGroup?.id}`,
        text: messages.editDeal,
      },
    ],
  };

  return (
    <SettingsLayout title={f(messages.editDeal)} config={BreadcrumbConfig}>
      {dealGroup ? <DealForm deal={dealGroup} /> : f(messages.loading)}
    </SettingsLayout>
  );
}
