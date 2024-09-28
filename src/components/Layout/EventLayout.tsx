import React from "react";
import messages from "../../i18n/messages";
import { useIntl } from "react-intl";
import Layout from "./Layout";
import {
  PresentationChartBarIcon,
  AdjustmentsIcon,
  CalendarIcon,
} from "@heroicons/react/outline";
import { NavLink, useNavigate } from "react-router-dom";
import normalize from "../../utils/normalize";
import { classNames } from "../../utils/misc";

interface IProps {
  children: React.ReactNode;
}

interface IEventMenuItem {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const EventMenuItem = ({ icon, link, title }: IEventMenuItem) => {
  const navigate = useNavigate();
  return (
    <div>
      <NavLink
        to={`${normalize(window.location.pathname)}/${link}`}
        className={({ isActive }) =>
          classNames(
            "my-2 px-4 py-2 text-sm text-gray-500 transition duration-200 ease-in-out rounded flex items-center",
            isActive ? "bg-gray-200 font-bold" : ""
          )
        }
      >
        {icon}
        <div className="ml-4">{title}</div>
      </NavLink>
    </div>
  );
};

export default function EventLayout({ children }: IProps) {
  const { formatMessage: f } = useIntl();

  return (
    <Layout>
      <div className="px-4 py-5 sm:px-6 flex-grow-0">
        <h3 className="text-xl font-bold leading-0 mt-2 text-gray-500 uppercase">
          {f(messages.dates)}
        </h3>
        <div className="md:grid md:grid-cols-5 md:gap-6 mt-6">
          <div className="md:col-span-1">
            <div className="md:pr-8">
              <EventMenuItem
                icon={<PresentationChartBarIcon className="h-5" />}
                title={f(messages.overview)}
                link=""
              />
              <EventMenuItem
                icon={<AdjustmentsIcon className="h-5" />}
                title={f(messages.settings)}
                link="settings"
              />
              <EventMenuItem
                icon={<CalendarIcon className="h-5" />}
                title={f(messages.dates)}
                link="dates"
              />
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-4 bg-gray-50 shadow-lg p-4 rounded">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}
