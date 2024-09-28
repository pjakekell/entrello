// import React from 'react'
// import { Breadcrumbs, Card, ProgressBar } from '@blueprintjs/core'
// import { useIntl } from 'react-intl'
// import { useParams } from 'react-router'
// import { useQuery } from '@apollo/react-hooks'
// import { AppToaster } from '../../utils/toaster'
// import EditEventForm from './EditEventForm'
// import {
//   FETCH_EVENT,
// } from './logic'

// export default function EditEvent() {

//   const { id } = useParams()
//   const { formatMessage: f } = useIntl()
//   const { loading, error: loadingErr, data } = useQuery(FETCH_EVENT, { variables: { id }})

//   const err = loadingErr
//   if (err) {
//     AppToaster.show({ intent: 'danger', message: err.message })
//   }

//   const BREADCRUMBS = [
//     { href: '/events', text: f({ id: 'Events' }) },
//     { text: loading || !data ? <ProgressBar /> : data.event.title, current: true, intent: 'primary' },
//   ]

//   return (
//     <div className="settings">
//       <Breadcrumbs
//         items={BREADCRUMBS}
//       />
//       <Card elevation={2}>
//         { data && data.event
//           && <EditEventForm event={data.event} dates={[]} />
//         }
//       </Card>
//     </div>
//   )
// }
