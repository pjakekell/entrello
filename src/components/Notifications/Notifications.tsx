import React from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { IOrg } from "../Org/interfaces";
import { useOrg } from "../../hooks/useOrg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-regular-svg-icons/faArrowRight";
import { ITaxGroup } from "../TaxGroup/interfaces";
import { useTaxGroups } from "../../hooks/useTaxGroups";

interface INotification {
  title: string;
  text: string;
  linkTo: string;
  linkToText: string;
}

interface IProps {
  notification: INotification;
}

function Notification({ notification }: IProps) {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();

  return (
    <div className="my-10">
      <div className="leading-10 text-3xl font-bold">
        {f({ id: notification.title })}
      </div>
      <div className="text-gray-500 text-xl leading-10">
        {f({ id: notification.text })}
      </div>
      <div className="mt-3">
        {notification.linkTo && (
          <button
            className="bg-brand-500 text-white rounded-full px-8 py-1"
            onClick={() => navigate(notification.linkTo)}
          >
            {f({ id: notification.linkToText })}
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}

const getNotes = (org: IOrg, taxGroups: [ITaxGroup]) => {
  const notes = [];
  if (!org.stripe_acc_id)
    notes.push({
      title: "addYourBusinessDetails",
      text: "tellUsMoreAboutYourBusiness",
      linkTo: "/settings/legal",
      linkToText: "continue",
    });
  if (!taxGroups || taxGroups.length < 1)
    notes.push({
      title: "createTaxGroup",
      text: "addTaxGroupToTaxYourTickets",
      linkTo: "/settings/taxes",
      linkToText: "continue",
    });

  return notes;
};

export default function Notifications() {
  const [org] = useOrg();
  const [taxGroups, { loading: loadingTaxes }] = useTaxGroups();

  if (loadingTaxes) return <></>;
  if (!org) return <div>notifications missing org!</div>;

  return (
    <div>
      {getNotes(org, taxGroups).map(
        (notification: INotification, index: number) => (
          <Notification
            key={`notification-${index}`}
            notification={notification}
          />
        )
      )}
    </div>
  );
}
