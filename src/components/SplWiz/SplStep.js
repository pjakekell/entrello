import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  FormControlLabel,
  LinearProgress,
  TextField,
  Typography,
  Switch,
  makeStyles,
} from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import { SETUP_SPL_SEATS } from "../Spl/logic";

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
  splSettingsContainer: {
    marginTop: "1em",
    marginBottom: "1em",
  },
  totalSeatsBox: {
    background: "#eee",
    padding: "1em",
    margin: "1em .6em 2em",
  },
  totalSeats: {
    fontSize: "2em",
    fontWeight: "bold",
    margin: "0 1rem",
  },
});

export default function SplStep({
  event_id,
  event_id,
  disabled,
  handleBack,
  handleToggleUseSpl,
  useSpl,
}) {
  const classes = useStyles();
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();
  const [seats, setSeats] = useState(10);
  const [rows, setRows] = useState(5);
  const variables = {
    event_id,
    event_id,
    rows: parseInt(rows),
    seats: parseInt(seats),
  };
  const [setupSplSeats, { loading, error }] = useMutation(SETUP_SPL_SEATS, {
    variables,
  });

  const handleSubmit = async () => {
    try {
      await setupSplSeats();
      navigate(`/d/${event_id}/spl`);
    } catch (e) {
      console.error(e);
    }
  };

  if (error) return <div>{error.message}</div>;
  if (loading)
    return (
      <div>
        <LinearProgress />
      </div>
    );

  return (
    <div>
      <Box className={classes.title}>
        <Typography variant="h5" element="h2">
          {f({ id: "Seating plan" })}
        </Typography>
      </Box>
      <Box spacing={4}>
        <FormControlLabel
          control={
            <Routes
              checked={useSpl}
              onChange={() => handleToggleUseSpl(!useSpl)}
              name="useSpl"
              color="primary"
            />
          }
          label={f({ id: "Use a seating plan" })}
        />
      </Box>
      {useSpl && (
        <Box spacing={4}>
          <Grid container spacing={2} className={classes.splSettingsContainer}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                label={f({ id: "Rows" })}
                onChange={({ target }) => setRows(target.value)}
                value={rows}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                type="number"
                label={f({ id: "Seats" })}
                onChange={({ target }) => setSeats(target.value)}
                value={seats}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6} className={classes.totalSeatsBox}>
              <Typography variant="overline">
                {f({ id: "Total Seats" })}:
              </Typography>
              <Typography className={classes.totalSeats}>
                {seats * rows}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container className={classes.actionsContainer}>
        <Grid item xs>
          <Button onClick={handleBack}>{f({ id: "cancel" })}</Button>
        </Grid>
        <Grid item xs className={classes.submitBtn}>
          <Button
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={handleSubmit}
          >
            {f({ id: "Save and complete" })}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
