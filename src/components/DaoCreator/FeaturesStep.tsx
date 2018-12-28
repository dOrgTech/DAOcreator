import {
  Card,
  CardContent,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { schemas } from "../../lib/integrations/daoStack/arc/schemas"
import { Schema } from "../../lib/integrations/daoStack/arc"
import { AppState } from "../../AppState"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  addedSchemes: Scheme[]
  actions: DaoCreatorActions
}

const AddScheme: React.SFC<Props> = ({ classes, addedSchemes, actions }) => {
  const handleChange = (scheme: Scheme) => (event: any) => {
    R.contains(scheme, addedSchemes) === true
      ? actions.remScheme(scheme)
      : actions.addScheme(scheme)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.headline} gutterBottom>
          DAO Features
        </Typography>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel>Features</FormLabel>
              <FormGroup>
                {R.map(scheme => {
                  return (
                    <FormControlLabel
                      key={"formControlLable-" + scheme.typeName}
                      control={
                        <Checkbox
                          checked={R.contains(scheme, addedSchemes)}
                          onChange={handleChange(scheme)}
                          value={scheme.typeName}
                        />
                      }
                      label={scheme.displayName}
                    />
                  )
                }, schemes)}
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    header: {},
    card: {},
    addButton: {},
    subheader: {},
    headline: {},
  })

const componentWithStyles = withStyles(styles)(AddScheme)

// STATE
const mapStateToProps = (state: AppState) => {
  return {
    addedSchemes: state.daoCreator.schemes,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(daoCreatorActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
