import React, { useState } from "react";
import { useIntl } from "react-intl";
import { NavLink, Link } from "react-router-dom";
import SvgLogo from "../../logo.svg";

import messages from "../../i18n/messages";
import ProfileDropdown from "../Profile/ProfileDropdown";
import OrgSwitch from "../Org/OrgSwitch";
import { BellIcon, CogIcon, SupportIcon } from "@heroicons/react/outline";
import Tooltip from "../Tooltip/Tooltip";
import Container from "../Layout/Container";
import SearchDialog from "../SearchDialog/SearchDialog";
import { classNames } from "../../utils/misc";
import { SearchIcon } from "@heroicons/react/solid";

export default function TopMenu() {
  const { formatMessage: f } = useIntl();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOpenSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <div>
      <nav className="w-full space-y-4 flex-grow-0 border-b border-gray-200 bg-gray-100">
        <Container>
          <div className="relative flex flex-col md:flex-row items-center justify-between h-10">
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-7 w-7 bg-gray-50 border border-gray-300 shadow rounded-full flex items-center justify-center">
                    <Link to="/dashboard">
                      <img src={SvgLogo} className="h-4" alt="entrello logo" />
                    </Link>
                  </div>
                </div>
                <OrgSwitch />
              </div>

              <div className="flex items-center space-x-2 mr-4 md:mr-0">
                <div className="">
                  <Link
                    to="/help"
                    className="flex align-center p-1 m-1 rounded-full text-gray-600 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-600"
                  >
                    <SupportIcon className="w-5 h-5" />
                    <div className="text-xs ml-1 leading-5">
                      {f(messages.help)}
                    </div>
                  </Link>
                </div>

                <Tooltip content={f(messages.search)}>
                  <button
                    onClick={handleOpenSearch}
                    className="p-1 my-1 rounded-full text-gray-600 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-600"
                  >
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </Tooltip>

                <Tooltip content={f(messages.notifications)}>
                  <Link to="/settings" className="">
                    <button className="p-1 my-1 rounded-full text-gray-600 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-600">
                      <BellIcon className="w-5 h-5" />
                    </button>
                  </Link>
                </Tooltip>

                <Tooltip content={f(messages.systemSettings)}>
                  <Link to="/settings" className="">
                    <button className="p-1 my-1 rounded-full text-gray-600 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-600">
                      <CogIcon className="w-5 h-5" />
                    </button>
                  </Link>
                </Tooltip>
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </Container>

        <div className="sm:hidden w-11/12 mx-auto" id="mobile-menu">
          <div className="flex justify-center px-2 pt-2 pb-3 space-y-1 w-full">
            <div className="flex justify-between w-full space-x-4">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-medium text-sm uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.dashboard)}
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-medium text-sm uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.events)}
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-medium text-sm uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.orders)}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <nav className="text-sm text-gray-600 hidden sm:block">
        <div className="hidden sm:block">
          <Container>
            <div className="border-b border-gray-300 py-1 flex">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-bold uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.dashboard)}
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-bold uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.events)}
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-bold uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.products)}
              </NavLink>
              <NavLink
                to="/vouchers"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-bold uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.vouchers)}
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  classNames(
                    "px-3 py-1 font-bold uppercase rounded-full my-1",
                    isActive
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "hover:text-brand-600"
                  )
                }
                aria-current="page"
              >
                {f(messages.orders)}
              </NavLink>
            </div>
          </Container>
        </div>
      </nav>
      <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
