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
import {schemas} from "../../../lib/integrations/daoStack/arc/schemas"
import { Schema } from "src/lib/integrations/daoStack/arc";


interface Props extends WithStyles<typeof styles> {
  addSchema: (schema: Schema) => void
  removeSchema: (Schema: Schema) => void
  addedSchemas: Schema[]
}

const AddSchema: React.SFC<Props> = ({
  classes,
  addedSchemas,
  addSchema,
  removeSchema,
}) => {
  const handleChange = (schema: Schema) => (event: any) => {
    R.contains(schema, addedSchemas) === true
      ? removeSchema(schema)
      : addSchema(schema)
  }

  return (
    <FormControl>
      <FormLabel>Governance Schemes</FormLabel>
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
    addedSchemas: state.daoCreator.schemas,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
      addSchema: (schema: Schema) => dispatch(addSchema(schema)),
      removeSchema: (schema: Schema) => dispatch(removeSchema(schema)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
