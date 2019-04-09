import * as React from "react"
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Card,
  CardContent,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import { RootState } from "../../../../state"
import { connect } from "react-redux"
import { Dispatch } from "redux"

interface Props extends WithStyles<typeof styles> {
  open: boolean
}

const AddSchemeDialog: React.SFC<Props> = ({ open, classes }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Select Scheme</DialogTitle>
    </Dialog>
  )
}

// STYLE
const styles = ({  }: Theme) => createStyles({})

const componentWithStyles = withStyles(styles)(AddSchemeDialog)

// STATE
const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
