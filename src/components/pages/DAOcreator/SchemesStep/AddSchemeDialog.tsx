import {
  createStyles,
  Dialog,
  DialogTitle,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as React from "react"

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

export default withStyles(styles)(AddSchemeDialog)
