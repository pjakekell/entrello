import React from "react";
import { useIntl } from "react-intl";
import {
  Box,
  Button,
  Typography,
  makeStyles,
  Grid,
  LinearProgress,
} from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_EVENT_W_CAT } from "../Event/logic";
import { FETCH_PRICES } from "../Price/logic";

import PriceFormItem from "../PriceForm/PriceFormItem";
import PricesListing from "../PriceForm/PricesListing";

const useStyles = makeStyles({
  title: {
    marginBottom: 40,
  },
  submitBtn: {
    marginLeft: "auto",
    textAlign: "right",
  },
});

export default function PctsStep({ event_id, handleNext, handleBack }) {
  const classes = useStyles();
  const { formatMessage: f, formatDate: d } = useIntl();
  const { error, loading, data } = useQuery(FETCH_EVENT_W_CAT, {
    variables: { id: event_id },
  });
  const pricesState = useQuery(FETCH_PRICES, { variables: { event_id } });

  if (loading)
    return (
      <div>
        <LinearProgress />
      </div>
    );
  if (error) return <div>{error.message}</div>;

  const { event } = data;
  const showActionBtns =
    pricesState.data &&
    pricesState.data.prices &&
    pricesState.data.prices.length > 0;

  return (
    <div>
      <Box className={classes.title}>
        <Typography variant="h5" element="h2">
          {f({ id: "Prices" })}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {event.title}, {d(event.start_time)}
        </Typography>
      </Box>
      <PricesListing {...pricesState} event_id={event_id} />
      <PriceFormItem event_id={event_id} />
      <Grid container className={classes.actionsContainer}>
        <Grid item xs>
          <Button
            disabled={pricesState.loading || !showActionBtns}
            onClick={handleBack}
          >
            {f({ id: "cancel" })}
          </Button>
        </Grid>
        <Grid item xs className={classes.submitBtn}>
          <Button
            variant="contained"
            color="primary"
            disabled={!showActionBtns}
            onClick={handleNext}
            className={classes.submitBtn}
          >
            {f({ id: "Continue" })}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export const eventStepValidation = () => {};
