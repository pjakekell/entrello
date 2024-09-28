import React, { memo } from "react";
import {
  oidFromJWT,
  FETCH_ORG_BY_ID,
  FETCH_ORGS,
  SWITCH_ORG,
} from "../Org/logic";
import { IOrg } from "../Org/interfaces";
import { Menu, Transition } from "@headlessui/react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useIntl } from "react-intl";
import { BanIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";

import messages from "../../i18n/messages";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/outline";

export default function OrgSwitch() {
  const navigate = useNavigate();

  const { error, loading, data } = useQuery(FETCH_ORG_BY_ID, {
    variables: { id: oidFromJWT() },
  });

  if (error) {
    navigate("/login");
  }

  return (
    <>
      <Menu as="div" className="relative p-2">
        {({ open }) => (
          <>
            <Menu.Button className="w-full flex align-center pt-1">
              <div className="text-xs text-gray-500">
                {loading || !data ? ".." : data.org.name}
              </div>
              <ChevronDownIcon className="w-4 h-3 ml-1 text-gray-400" />
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
              <Menu.Items className="origin-top-left w-full absolute rounded-md shadow-lg -mt-8 py-1 bg-white focus:outline-none divide-gray-100 divide-y z-10">
                <OrgsList />
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      {error && error.message ? (
        <div
          className="absolute text-sm top-1 right-1 -mr-8 bg-gray-100 border-l-4 border-red-600 p-2 px-4 rounded shadow-lg flex items-center justify-between mb-6"
          role="alert"
        >
          <BanIcon className="h-8 w-8 text-red-600 mr-4" />
          <div className="sm:text-left text-center sm:mb-0 mb-3 w-128">
            <p className="font-bold">ERROR</p>
            <p className="text-gray-600 inline-block">{error.message}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

interface IOrgListItem {
  org: IOrg;
}

const OrgListItem = ({ org }: IOrgListItem) => {
  const [switchOrg, { loading, error }] = useMutation(SWITCH_ORG);
  const { formatMessage: f } = useIntl();
  if (error) {
    if (error.message === "Failed to fetch") toast(f(messages.noInternet));
    else toast(f(messages.noInternet));
  }
  if (error) {
    toast(error.message);
  }

  const switchToOrg = async (id: string) => {
    const variables = {
      org_id: id,
      refresh_token: localStorage.getItem("r") || localStorage.getItem("t"),
    };
    const {
      data: { Refresh },
    } = await switchOrg({ variables });
    localStorage.setItem("t", Refresh.access_token);
    localStorage.setItem("r", Refresh.refresh_token);
    window.location.reload();
  };

  const handleSwitchOrg = () => switchToOrg(org.id);

  return (
    <Menu.Item>
      <button
        className="px-4 py-3 hover:bg-gray-100 hover:cursor-pointer block w-full text-left"
        onClick={handleSwitchOrg}
      >
        {loading ? <div className="ring-loader" /> : null}
        <div className="text-gray-500 text-xs">{org.name}</div>
      </button>
    </Menu.Item>
  );
};

const OrgsList = memo(() => {
  const { loading, error, data } = useQuery(FETCH_ORGS);

  if (loading)
    return (
      <Menu.Item>
        <div className="ring-loader" />
      </Menu.Item>
    );
  if (error)
    return (
      <Menu.Item>
        <div className="text-red-600">{error.message}</div>
      </Menu.Item>
    );

  return (
    <>
      {data.orgs.map((org: IOrg) => (
        <OrgListItem org={org} key={`org_${org.id}`} />
      ))}
    </>
  );
});
