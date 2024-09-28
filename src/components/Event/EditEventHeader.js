// import React from "react";
// import classNames from "classnames";
// import { Button } from "@blueprintjs/core";
// import { useIntl } from "react-intl";
// import { useLazyQuery } from "@apollo/react-hooks";
// import { AppToaster } from "../../utils/toaster";
// import LoadingContainer from "../LoadingContainer";
// import { FETCH_LOCATION_BY_ID } from "../Location/logic";

// const EventDetails = ({ event, location }) => {
//   const { formatDate: d } = useIntl();
//   return (
//     <div className="event-details">
//       {location ? (
//         `${location.city} ${location.country_code} | ${location.name}`
//       ) : (
//         <span>&nbsp;</span>
//       )}
//       <br />
//       {event && event.length > 0 ? (
//         `${d(event.start_time)}`
//       ) : (
//         <span>&nbsp;</span>
//       )}
//       {event.start_time &&
//         event.ends_at &&
//         event.start_time !== event.ends_at &&
//         ` &nbps; ${d(event.ends_at)}`}
//     </div>
//   );
// };

// export default function EditEventHeader({ event, handleSave }) {
//   const { formatMessage: f } = useIntl();

//   const [fetchLocation, { loading, error, data }] = useLazyQuery(
//     FETCH_LOCATION_BY_ID,
//     {
//       variables: {
//         id: event.location_id,
//       },
//     }
//   );

//   if (loading) return <LoadingContainer />;

//   if (error) AppToaster.show({ intent: "danger", message: error.message });

//   // if (event && event.location_id) fetchLocation()

//   return (
//     <div
//       className={classNames("event-card-title d-flex", {
//         "bp3-skeleton": loading,
//       })}
//     >
//       <div className="event-card-title-left">
//         <div className="event-title">{loading ? "SKELETON" : event.title}</div>
//         <div className="event-location">
//           {loading ? (
//             "SKELETON"
//           ) : (
//             <EventDetails
//               event={event}
//               location={data ? data.location : null}
//             />
//           )}
//         </div>
//       </div>
//       <div className="event-card-actions-right">
//         <Button onClick={handleSave}>
//           {f({ id: event.id ? "save" : "create" })}
//         </Button>
//         {event.on_sale_dates_qty < 1 ? (
//           <Button intent="danger" disabled={!event.id}>
//             {f({ id: "sales closed" })}
//           </Button>
//         ) : (
//           <Button intent="danger">{f({ id: "on sale" })}</Button>
//         )}
//       </div>
//     </div>
//   );
// }
