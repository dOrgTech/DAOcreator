import {
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
import { bindActionCreators, Dispatch } from "redux"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import DaoCreatorActions, * as daoCreatorActions from "src/redux/actions/daoCreator"
import { schemas } from "src/lib/integrations/daoStack/arc/schemas"
import { Schema } from "src/lib/integrations/daoStack/arc"
import { AppState } from "src/AppState"

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
