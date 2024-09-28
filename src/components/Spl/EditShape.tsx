import React from "react";
// import { useQuery, useMutation } from '@apollo/react-hooks'
// import { useParams } from 'react-router'
// import { useIntl } from 'react-intl'
// import { Button, Grid, LinearProgress, makeStyles, FormControlLabel, FormHelperText } from '@material-ui/core'
// import { Formik, Form, Field } from 'formik'
// import { TextField, Switch } from 'formik-material-ui'
// import { IFixture } from './interfaces'
// import {
//   FETCH_EVENT_BY_ID,
// } from '../event/logic'

// import Error from '../Error'
// import { client } from '../../apollo-client'

// const useStyles = makeStyles({
//   formItem: {
//     marginBottom: 20,
//   },
//   title: {
//     marginBottom: 40,
//   },
//   submitBtn: {
//     marginLeft: 'auto',
//     textAlign: 'right',
//   },
//   actionsContainer: {
//     marginBottom: '1em',
//   },
// })

// interface ShapesInfoParams {
//   shape: IFixture,
//   [key:string]: any,
// }

// export default function ShapesInfo({ shape }:ShapesInfoParams) {
//   const classes = useStyles()
//   const { formatMessage: f } = useIntl()
//   // const [saveSection, { loading: loadingSave }] = useMutation(UPDATE_SECTION, {
//   //   refetchQueries: [{
//   //     query: FETCH_SECTION,
//   //     variables,
//   //   }]
//   // })

//   const handleSubmit = async (variables:any, { setSubmitting }:any) => {
//     // await saveSection({ variables: { ...variables, id: secId, event_id: id } })
//     setSubmitting(false)
//   }

//   const handleValidation = (values:any) => {
//     const errors = {}
//     return errors
//   }

//   // if (loading || loadingSave) return <LinearProgress />
//   // if (error) return <Error error={error} />

//   return (
//     <div>
//       <Formik
//         enableReinitialize
//         initialValues={shape}
//         validate={handleValidation}
//         onSubmit={handleSubmit}
//       >
//         {({ submitForm, isSubmitting }) => (
//           <Form onSubmit={(e:React.FormEvent) => submitForm()}>
//             <Grid container spacing={3} className={classes.formItem}>
//               <Grid item xs={12}>
//                 <Field
//                   autoFocus
//                   fullWidth
//                   name="name"
//                   label={f({ id: 'Section name' })}
//                    element={TextField}
//                   variant="outlined"
//                 />
//               </Grid>
//             </Grid>
//             <FormControlLabel
//               control={
//                 <Field
//                    element={Switch}
//                   name="free_standing"
//                   color="primary"
//                   type="checkbox"
//                 />
//               }
//               label={f({ id: 'Free standing' })}
//             />
//             <Grid container spacing={3} className={classes.formItem}>
//               <Grid item xs={6}>
//                 <Field
//                   autoFocus
//                   fullWidth
//                   name="rows"
//                   label={f({ id: 'Rows' })}
//                    element={TextField}
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Field
//                   autoFocus
//                   fullWidth
//                   name="seatsInRow"
//                   label={f({ id: 'Seats' })}
//                    element={TextField}
//                   variant="outlined"
//                 />
//               </Grid>
//             </Grid>
//             <Grid container spacing={3} className={classes.formItem}>
//               <Grid item xs={12}>
//                 <Button
//                   variant="contained"
//                   type="submit"
//                   color="primary"
//                   disabled={isSubmitting}
//                   onClick={submitForm}
//                 >
//                   {f({ id: 'Save' })}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   )
// }

export default function EditShape() {
  return <div />;
}
