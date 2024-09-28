import React from "react";
import { useIntl } from "react-intl";
import messages from "../../i18n/messages";
import BankDetails from "./Payout/BankDetails";
import BillingDetails from "./Payout/BillingDetails";
import { SettingsLayout } from "../Layout/SettingsLayout";
import { Ruler } from "../Ruler/Ruler";

// const EnablePayments = () => {
//   const [enabled, setEnabled] = useState(false);
//   const { formatMessage: f } = useIntl();

//   return (
//     <Routes.Group as="div" className="flex items-center justify-between">
//       <span className="flex-grow flex flex-col">
//         <Routes.Label
//           as="span"
//           className="text-sm font-medium text-gray-900"
//           passive
//         >
//           {f(messages.receivePayments)}
//         </Routes.Label>
//         <Routes.Description as="span" className="text-sm text-gray-500">
//           {f(messages.receivePaymentsDesc)}
//         </Routes.Description>
//       </span>
//       <Routes
//         checked={enabled}
//         onChange={setEnabled}
//         className={classNames(
//           enabled ? "bg-indigo-600" : "bg-gray-200",
//           "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         )}
//       >
//         <span
//           aria-hidden="true"
//           className={classNames(
//             enabled ? "translate-x-5" : "translate-x-0",
//             "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
//           )}
//         />
//       </Routes>
//     </Routes.Group>
//   );
// };

const BreadcrumbConfig = {
  links: [
    {
      to: "/settings",
      text: messages.settings,
    },
    {
      to: "/settings/payout",
      text: messages.payout,
    },
  ],
};

export default function PayoutSettings() {
  const { formatMessage: f } = useIntl();

  return (
    <SettingsLayout config={BreadcrumbConfig} title={f(messages.payout)}>
      <BillingDetails />
      <Ruler />
      <BankDetails />
    </SettingsLayout>
  );
}
