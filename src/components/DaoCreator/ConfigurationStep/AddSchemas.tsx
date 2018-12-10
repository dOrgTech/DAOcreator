import {
  Card,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { addSchema, removeSchema } from "../../../state/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  addSchema: (schema: string) => void
  removeSchema: (schema: string) => void
  avalibleSchemas: string[]
  addedSchemas: string[]
}

const AddSchema: React.SFC<Props> = ({
  classes,
  addedSchemas,
  avalibleSchemas,
  addSchema,
  removeSchema,
}) => {
  const handleChange = (schema: string) => (event: any) => {
    R.contains(schema, addedSchemas) === true ? removeSchema(schema) : addSchema(schema)
  }

  return (
    <Card className={classes.card}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Turn on the schemas you want for your DAO
        </FormLabel>
        <FormGroup>
          {R.map(schema => {
            return (
              <FormControlLabel
                  key={"formControlLable-" + schema}
                control={
                  <Checkbox
                    checked={R.contains(schema, addedSchemas)}
                    onChange={handleChange(schema)}
                    value={schema}
                  />
                }
                label={schema}
              />
            )
          }, avalibleSchemas)}
        </FormGroup>
      </FormControl>
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
const mapStateToProps = (state: any) => {
  return {
    // TODO: fix hardcoded
    avalibleSchemas: [
      "SchemeRegistrar",
      "UpgradeScheme",
      "GlobalConstraintRegistrar",
    ],
    addedSchemas: state.daoCreator.schemas,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addSchema: (schema: string) => dispatch(addSchema(schema)),
    removeSchema: (schema: string) => dispatch(removeSchema(schema)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
