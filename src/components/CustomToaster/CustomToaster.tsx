import React from "react";
import {
  faExclamationTriangle,
  faXmark,
  faCheckCircle,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import Tooltip from "../Tooltip/Tooltip";
import messages from "../../i18n/messages";
import LoadingIcon from "../Btn/LoadingIcon";
import colors from "../../utils/colors";

const levelStates: any = {
  info: () => (
    <FontAwesomeIcon
      icon={faExclamationTriangle}
      className="h-8 w-8 text-blue-600"
      aria-hidden="true"
    />
  ),
  warn: () => (
    <FontAwesomeIcon
      icon={faExclamationTriangle}
      className="h-8 w-8 text-yellow-500"
      aria-hidden="true"
    />
  ),
  error: () => (
    <FontAwesomeIcon
      icon={faExclamationTriangle}
      className="h-8 w-8 text-red-500"
      aria-hidden="true"
    />
  ),
  success: () => (
    <FontAwesomeIcon
      icon={faCheckCircle}
      className="h-8 w-8 text-green-600"
      aria-hidden="true"
    />
  ),
};

const levelFGColor: any = {
  info: "text-gray-600",
  warn: "text-yellow-600 bg-yellow-200",
  error: "text-red-700 bg-red-200",
  success: "text-green-700 bg-green-200",
};

interface ICustomToaster {
  message: string;
  level?: "info" | "warn" | "error" | "success";
  loading?: boolean;
  t?: any;
}

export const CustomToaster = ({
  message,
  t,
  loading,
  level = "info",
}: ICustomToaster) => {
  const { formatMessage: f } = useIntl();
  const handleDismiss = () => {
    toast.remove(t.id);
  };
  return (
    <div
      className={`${t.visible ? "animate-enter" : "animate-leave"} ${
        levelFGColor[level]
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-full flex items-center">
        <div className="flex items-center">
          <div className="flex-shrink-0 pl-4 leading-none">
            {levelStates[level]()}
          </div>
          <div className="ml-3 flex-1">
            <p className="leading-none text-sm">{message}</p>
          </div>
        </div>
      </div>
      <div
        className={`flex border-l ${
          level === "info" ? "border-gray-200" : "border-gray-600"
        }`}
      >
        {loading ? (
          <div className="w-full flex items-center justify-center p-4">
            <div className="w-6 h-6">
              <LoadingIcon size={22} color={colors.brand[500]} />
            </div>
          </div>
        ) : (
          <Tooltip content={f(messages.close)}>
            <button
              onClick={handleDismiss}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FontAwesomeIcon
                icon={faXmark}
                className={`h-6 w-6 ${
                  level === "info" ? "text-gray-400" : "text-gray-700"
                }`}
              />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export const customToastFn = ({
  message,
  loading,
  level = "info",
}: ICustomToaster) => (t: any) => (
  <CustomToaster message={message} level={level} loading={loading} t={t} />
);
