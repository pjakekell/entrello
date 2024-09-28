import React from "react";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import navigation from "./navigation";
import messages from "../../i18n/messages";

const RenderSettingsItems = ({ items }: any) => {
  const { formatMessage: f } = useIntl();
  return (
    <ul>
      {items.map((item: any) => (
        <li key={item.name.id} className="leading-8">
          <Link to={item.href}>
            <a
              href={item.href}
              className="text-base text-gray-600 hover:text-brand-600"
            >
              {f(item.name)}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

function UserSettings() {
  const { formatMessage: f } = useIntl();

  return (
    <div className="bg-white container p-8 rounded-lg mt-4">
      <div className="leading-10">
        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
          {f(messages.userSettings)}
        </h3>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
        <RenderSettingsItems items={navigation.user} />
      </div>
    </div>
  );
}

function OrgSettings() {
  const { formatMessage: f } = useIntl();

  return (
    <div className="bg-white container p-8 rounded">
      <div className="leading-10">
        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
          {f(messages.orgSettings)}
        </h3>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
        <RenderSettingsItems items={navigation.organization} />
        <RenderSettingsItems items={navigation.taxAndContracts} />
      </div>
    </div>
  );
}

function PriceSettings() {
  const { formatMessage: f } = useIntl();
  return (
    <div className="bg-white container p-8 rounded ">
      <div className="leading-10">
        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
          {f(messages.priceSettings)}
        </h3>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
        <RenderSettingsItems items={navigation.price} />
      </div>
    </div>
  )
}

// const toggleFeature = (features, feature) => {
//   features = features || [];
//   const index = features.indexOf(feature);
//   return index >= 0
//     ? features.filter((f) => f !== feature)
//     : [...features, feature];
// };

// function ProductSettings() {
//   const { formatMessage: f } = useIntl();
//   const oid = oidFromJWT();
//   const variables = { id: oid };
//   const { data, loading } = useQuery(FETCH_ORG_BY_ID, { variables });
//   const [saveOrg, { loading: saving }] = useMutation(UPDATE_ORG, {
//     refetchQueries: [
//       {
//         query: FETCH_ORG_BY_ID,
//         variables,
//       },
//     ],
//   });
//   const handleToggleFeature = async (feature) => {
//     try {
//       variables.features = toggleFeature(data.org.features, feature);
//       console.log(variables.features);
//       await saveOrg({ variables });
//     } catch (e) {
//       logger.error("caught", e);
//     }
//   };
//   if (loading || saving) return <LoadingContainer />;

//   const { org } = data;

//   return (
//     <Card elevation={2} className="mb-4">
//       <div className="card-title">{f({ id: "Product Settings" })}</div>
//       <div className="card-body">
//         <div className="row">
//           <div className="col settings-section">
//             <div className="settings-section-header d-flex">
//               <div>{f({ id: "Ticketshop" })}</div>
//               <div className="switch">
//                 <Routes
//                   checked={org.features && org.features.includes("tickets")}
//                   onChange={() => handleToggleFeature("tickets")}
//                   label={f({
//                     id:
//                       org.features && org.features.includes("tickets")
//                         ? "enabled"
//                         : "disabled",
//                   })}
//                   alignIndicator="right"
//                 />
//               </div>
//             </div>
//             <div className="settings-section-desc">
//               <div>{f({ id: "sell tickets for events" })}</div>
//             </div>
//           </div>
//           <div className="col settings-section">
//             <div className="settings-section-header d-flex">
//               <div>{f({ id: "Vouchers" })}</div>
//               <div className="switch">
//                 <Routes
//                   checked={org.features && org.features.includes("vouchers")}
//                   onChange={() => handleToggleFeature("vouchers")}
//                   label={f({
//                     id:
//                       org.features && org.features.includes("vouchers")
//                         ? "enabled"
//                         : "disabled",
//                   })}
//                   alignIndicator="right"
//                 />
//               </div>
//             </div>
//             <div className="settings-section-desc">
//               <div>{f({ id: "sell vouchers" })}</div>
//             </div>
//           </div>
//           <div className="col settings-section">
//             <div className="settings-section-header d-flex">
//               <div>{f({ id: "Signup Forms" })}</div>
//               <div className="switch">
//                 <Routes
//                   checked={org.features && org.features.includes("forms")}
//                   onChange={() => handleToggleFeature("forms")}
//                   label={f({
//                     id:
//                       org.features && org.features.includes("forms")
//                         ? "enabled"
//                         : "disabled",
//                   })}
//                   alignIndicator="right"
//                 />
//               </div>
//             </div>
//             <div className="settings-section-desc">
//               <div>{f({ id: "use signup forms" })}</div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col settings-section">
//             <div className="settings-section-header d-flex">
//               <div>{f({ id: "oneTimeTickets" })}</div>
//               <div className="switch">
//                 <Routes
//                   checked={
//                     org.features && org.features.includes("one_time_tickets")
//                   }
//                   onChange={() => handleToggleFeature("one_time_tickets")}
//                   label={f({
//                     id:
//                       org.features && org.features.includes("one_time_tickets")
//                         ? "enabled"
//                         : "disabled",
//                   })}
//                   alignIndicator="right"
//                 />
//               </div>
//             </div>
//             <div className="settings-section-desc">
//               <div>{f({ id: "sell one-time tickets" })}</div>
//             </div>
//           </div>
//           <div className="col settings-section">
//             <div className="settings-section-header d-flex">
//               <div>{f({ id: "House Requests" })}</div>
//               <div className="switch">
//                 <Routes
//                   checked={
//                     org.features && org.features.includes("house_requests")
//                   }
//                   onChange={() => handleToggleFeature("house_requests")}
//                   label={f({
//                     id:
//                       org.features && org.features.includes("house_requests")
//                         ? "enabled"
//                         : "disabled",
//                   })}
//                   alignIndicator="right"
//                 />
//               </div>
//             </div>
//             <div className="settings-section-desc">
//               <div>{f({ id: "schedule house requests" })}</div>
//             </div>
//           </div>
//           <div className="col"></div>
//         </div>
//       </div>
//     </Card>
//   );
// }

export default function SettingsView() {
  return (
    <div>
      <UserSettings />
      <OrgSettings />
      <PriceSettings />
    </div>
  );
}
