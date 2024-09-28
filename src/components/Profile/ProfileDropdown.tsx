import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useMutation, useQuery } from "@apollo/react-hooks";
// import { useNavigate } from "react-router-dom";
import { LOGOUT_USER } from "../Auth/logic";

import messages from "../../i18n/messages";
import { useIntl } from "react-intl";
import { uidFromJWT, FETCH_USER_BY_ID } from "../User/logic";
import { BanIcon, XIcon, UserIcon } from "@heroicons/react/solid";

const ProfileDropdown = () => {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const [errMsg, setErr] = useState({ msg: "", err: false });
  const { error, data } = useQuery(FETCH_USER_BY_ID, {
    variables: { id: uidFromJWT() },
  });
  const [logoutUser] = useMutation(LOGOUT_USER);
  // const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser({ variables: {} }); // remove token entry from db
    localStorage.removeItem("t");
    localStorage.removeItem("r");
    localStorage.removeItem("locale");
    navigate("/login");
  };

  if (error && !errMsg.err) {
    setErr({
      msg:
        error.message === "Failed to fetch"
          ? f(messages.noInternet)
          : error.message,
      err: true,
    });
  }

  const handleCloseError = () => {
    setErr({ msg: "", err: true });
  };

  return (
    <>
      <Menu as="div" className="relative ml-2">
        {({ open }) => (
          <>
            <Menu.Button className="flex items-center text-gray-600 justify-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-800">
              <UserIcon className="w-5 h-5" />
            </Menu.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-gray-100 divide-y z-10">
                <Menu.Item>
                  <div className="px-4 py-3">
                    <p className="text-sm leading-5 font-thin">
                      {f(messages.signedInAs)}
                    </p>
                    <p className="text-sm font-medium leading-5 text-gray-900 truncate">
                      {data && data.user.email}
                    </p>
                  </div>
                </Menu.Item>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings/profile"
                        className={classNames(
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                          { "bg-gray-500": active }
                        )}
                        aria-current="page"
                      >
                        {f(messages.myProfile)}
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={classNames(
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                          { "bg-gray-500": active }
                        )}
                        aria-current="page"
                      >
                        {f(messages.systemSettings)}
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="#"
                        className={classNames(
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                          { "bg-gray-500": active }
                        )}
                      >
                        {f(messages.billing)}
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="#"
                        onClick={handleLogout}
                        className={classNames(
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                          { "bg-gray-500": active }
                        )}
                      >
                        {f(messages.logout)}
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      {errMsg.err && errMsg.msg.length > 0 ? (
        <div
          className="absolute text-sm top-1 right-1 -mr-8 bg-gray-50 border-l-4 border-red-600 p-2 px-4 rounded shadow-lg flex items-center justify-between mb-6"
          role="alert"
        >
          <BanIcon className="h-8 w-8 text-red-600 mr-4" />
          <div className="sm:text-left text-center sm:mb-0 mb-3 w-128">
            <p className="font-bold">ERROR</p>
            <p className="text-gray-600 inline-block">
              fetchUser: {errMsg.msg}
            </p>
          </div>
          <button onClick={handleCloseError} className="ml-6">
            <XIcon className="h-8 w-8 text-gray-500" />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ProfileDropdown;
