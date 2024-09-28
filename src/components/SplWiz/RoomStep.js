import React from 'react'
import { useIntl } from 'react-intl'
import {
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'

export default function RoomStep ({ disabled, handleBack, handleNext }) {

  const { formatMessage: f } = useIntl()

  return (
    <div>
      <Typography variant="overline">test</Typography>
      <Grid container spacing={3}>
        <Grid item xs>
          <TextField
            required
            label={f({ id: 'width' })}
            helperText={f({ id: 'inMeter'})}
            defaultValue={10}
            variant="outlined"
          />
        </Grid>
        <Grid item xs>
          <TextField
            required
            label={f({ id: 'width' })}
            helperText={f({ id: 'inMeter' })}
            defaultValue={10}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </div>
  )
}