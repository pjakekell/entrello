import { faChevronRight, faHome } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useIntl } from "react-intl";
import { NavLink } from "react-router-dom";
import { Ruler } from "../Ruler/Ruler";

export interface IBreadcrums {
  links: {
    to: string;
    text: object;
  }[];
}

export function Breadcrumbs({ links }: IBreadcrums) {
  const { formatMessage: f } = useIntl();
  return (
    <>
      <nav className="mt-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4 text-sm">
          <li>
            <div>
              <NavLink to="/" className="text-gray-400 hover:text-gray-500">
                <FontAwesomeIcon
                  icon={faHome}
                  className="flex-shrink-0 h-4 w-4"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </NavLink>
            </div>
          </li>
          {links.map((link) => {
            return (
              <li key={`link-${link.to}`}>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="flex-shrink-0 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <NavLink
                    to={link.to}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                  >
                    {f(link.text)}
                  </NavLink>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
      <Ruler />
    </>
  );
}
