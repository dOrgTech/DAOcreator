import {
  Card,
  CardContent,
  createStyles,
  Grid,
  TextField,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as React from "react"

interface Props extends WithStyles<typeof styles> {
  handleChange: (key: string) => (value: any) => void
  daoName: string
  tokenName: string
  tokenSymbol: string
}

const NamingStep: React.SFC<Props> = ({
  handleChange,
  daoName,
  tokenName,
  tokenSymbol,
  classes,
}) => (
  <Card className={classes.card}>
    <form>
      <CardContent>
        <Typography variant="h5" className={classes.headline} gutterBottom>
          Create a DAO
        </Typography>
        <Grid container spacing={16}>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <TextField
                className={classes.daoName}
                id="daoName"
                label="DAO Name"
                value={daoName}
                onChange={handleChange("daoName")}
                margin="normal"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.tokenName}
                id="token-name"
                label="Token Name"
                value={tokenName}
                onChange={handleChange("tokenName")}
                margin="normal"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.tokenSymbol}
                id="token-symbol"
                label="Token Symbol"
                value={tokenSymbol}
                onChange={handleChange("tokenSymbol")}
                margin="normal"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            Avatar?
          </Grid>
        </Grid>
      </CardContent>
    </form>
  </Card>
)

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    card: {},
    headline: {},
    daoName: {},
    tokenName: {},
    tokenSymbol: {},
  })

export default withStyles(styles)(NamingStep)
