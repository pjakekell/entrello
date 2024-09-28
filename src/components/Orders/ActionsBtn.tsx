import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages.js";
import { FETCH_ORDER_BY_ID, DELETE_ORDER } from "./logic";
import { useMutation } from "@apollo/react-hooks";
import { Menu, Transition } from "@headlessui/react";
import { TrashIcon, MenuIcon } from "@heroicons/react/outline";
import { classNames } from "../../utils/misc";
import LoadingIcon from "../Btn/LoadingIcon.js";
import colors from "../../utils/colors";

interface IToggleItem {
  orderId: string;
}

const DeleteOrderAction = ({ orderId }: IToggleItem) => {
  const { formatMessage: f } = useIntl();
  const [deleteOrder, { loading, error }] = useMutation(DELETE_ORDER);
  const handleToggleAction = async () => {
    try {
      await deleteOrder({
        variables: {
          id: orderId,
        },
        refetchQueries: [
          {
            query: FETCH_ORDER_BY_ID,
            variables: { id: orderId },
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Menu.Item>
      {({ active }) => (
        <div
          className={classNames(
            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
            "px-4 py-2 flex items-center cursor-pointer"
          )}
          onClick={handleToggleAction}
        >
          <div className="pb-0.5">
            {loading ? (
              <LoadingIcon color={colors.brand[500]} size={25} />
            ) : (
              <TrashIcon className="text-yellow-500 w-5 h-5" />
            )}
          </div>
          <div>
            <div className="ml-2 text-xs font-bold text-gray-700 uppercase">
              {error ? error.message : f(messages.delete)}
            </div>
          </div>
        </div>
      )}
    </Menu.Item>
  );
};

interface IActionsBtn {
  orderId: string;
}

const ActionsBtn = ({ orderId }: IActionsBtn) => {
  return (
    <Menu as="div" className="mr-4 relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="rounded-md focus:outline-none ring-2 ring-gray-300 p-1 group hover:ring-brand-600">
              <MenuIcon className="w-4 h-4 text-gray-300 group-hover:text-brand-600" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1 divide-y">
                <DeleteOrderAction orderId={orderId} />
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ActionsBtn;
