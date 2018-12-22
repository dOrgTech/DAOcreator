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
import { AppState } from "src/AppState"
import { Schema } from "src/lib/integrations/daoStack/arc"
import { schemas } from "../../lib/integrations/daoStack/arc/schemas"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  addedSchemas: Schema[]
  actions: DaoCreatorActions
}

const AddSchema: React.SFC<Props> = ({ classes, addedSchemas, actions }) => {
  const handleChange = (schema: Schema) => (event: any) => {
    R.contains(schema, addedSchemas) === true
      ? actions.remSchema(schema)
      : actions.addSchema(schema)
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
                {R.map(schema => {
                  return (
                    <FormControlLabel
                      key={"formControlLable-" + schema.typeName}
                      control={
                        <Checkbox
                          checked={R.contains(schema, addedSchemas)}
                          onChange={handleChange(schema)}
                          value={schema.typeName}
                        />
                      }
                      label={schema.displayName}
                    />
                  )
                }, schemas)}
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

const componentWithStyles = withStyles(styles)(AddSchema)

// STATE
const mapStateToProps = (state: AppState) => {
  return {
    addedSchemas: state.daoCreator.schemas,
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
