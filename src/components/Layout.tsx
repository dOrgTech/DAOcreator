import * as React from "react"
import { SFC } from "react"
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core"
import Background from "./Background"

interface Props extends WithStyles<typeof styles> {}

const Layout: SFC<Props> = ({ classes, children }) => (
  <main className={classes.root}>
    <Background />
    {children}
  </main>
)

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: 1,
      position: "relative",
      display: "flex",
      width: "100%",
      height: "100%",
    },
  })

export default withStyles(styles)(Layout)
