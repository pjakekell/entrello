import React from "react";
import { useIntl } from "react-intl";
import moment from "moment";
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_EVENT } from "../Event/logic";

const useStyles = makeStyles({
  formItem: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 40,
  },
  submitBtn: {
    marginLeft: "auto",
    textAlign: "right",
  },
  actionsContainer: {
    marginBottom: "1em",
  },
});

export default function RoomStep({ handleNext, handleClose }) {
  const classes = useStyles();
  const { formatMessage: f } = useIntl();
  const [createEvent, { error }] = useMutation(CREATE_EVENT);

  const handleSubmit = async (variables, { setSubmitting }) => {
    try {
      const {
        data: { createEvent: event },
      } = await createEvent({ variables });
      handleNext({
        event_id: event.id,
        event_id: event.event_ids[0],
      });
    } catch (e) {
      console.log("caught", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidation = (values) => {
    const errors = {};
    if (!values.title) errors.title = "required";
    if (!values.start_time) errors.start_time = "required";
    return errors;
  };

  if (error) return <div>{error.message}</div>;

  return (
    <Formik
      initialValues={{
        title: "",
        subtitle: "",
        start_time: moment().minutes(0).hours(20).add(1, "d").toDate(),
      }}
      validate={handleValidation}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Box className={classes.title}>
            <Typography variant="h5" element="h2">
              {f({ id: "Event Information" })}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {f({ id: "Enter Basic Information about your Event" })}
            </Typography>
          </Box>
          <Grid container spacing={3} className={classes.formItem}>
            <Grid item xs={12}>
              <Field
                required
                autoFocus
                fullWidth
                name="title"
                label={f({ id: "eventTitle" })}
                element={TextField}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.formItem}>
            <Grid item xs={12}>
              <Field
                required
                name="start_time"
                fullWidth
                label={f({ id: "Starts at" })}
                element={DateTimePicker}
                inputVariant="outlined"
                ampm={false}
                format="ddd, DD. MMM. HH:mm"
                showTodayButton
                disablePast
              />
            </Grid>
          </Grid>
          {isSubmitting && <LinearProgress />}
          <Grid container className={classes.actionsContainer}>
            <Grid item xs>
              <Button disabled={isSubmitting} onClick={handleClose}>
                {f({ id: "cancel" })}
              </Button>
            </Grid>
            <Grid item xs className={classes.submitBtn}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                {f({ id: "Create and continue" })}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
