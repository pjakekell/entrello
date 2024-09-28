// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   Slide,
// } from '@material-ui/core'
// import { useNavigate } from 'react-router-dom'

// import EventStep from './EventStep'
// import PctsStep from './PctsStep'
// import SplStep from './SplStep'

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// export default function SeatingPlanWizard() {

//   const [activeStep, setActiveStep] = useState(0)
//   const [newEventId, setNewEventId] = useState(null)
//   const [eventId, setEventId] = useState(null)
//   const [useSpl, setUseSpl] = useState(false)
//   const history = useNavigate()

//   const nav = {
//     handleBack: () => setActiveStep((prevActiveStep) => prevActiveStep - 1),
//     handleClose: () => navigate('/dashboard'),
//     handleReset: () => setActiveStep(0),
//     handleNext: ({ event_id, event_id }) => {
//       if (event_id) setNewEventId(event_id)
//       if (event_id) setEventId(event_id)
//       setActiveStep((prevActiveStep) => prevActiveStep + 1)
//     },
//   }

//   const steps = [
//     <EventStep {...nav} />,
//     <PctsStep {...nav} event_id={newEventId} />,
//     <SplStep {...nav} useSpl={useSpl} handleToggleUseSpl={setUseSpl} event_id={newEventId} event_id={eventId} />,
//     // <SplStep {...nav} useSpl={useSpl} handleToggleUseSpl={setUseSpl} event_id="5ebe236dd9d13d1ad6b5f897" />,
//   ]

//   return (
//     <Dialog
//       onClose={nav.handleClose}
//       aria-labelledby="simple-dialog-title"
//       open
//       fullWidth
//       maxWidth="sm"
//       Transition element={Transition}
//     >
//       <DialogContent>
//         {steps[activeStep]}
//       </DialogContent>

//     </Dialog>
//   )
// }
