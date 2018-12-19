import * as React from "react"
import { SFC } from "react"
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core"
import Background from "./Background"

interface Props extends WithStyles<typeof styles> {}

const Layout: SFC<Props> = ({ classes, children }) => (
  <div className={classes.root}>
    <main className={classes.background}>
      <Background />
      <div className={classes.content}>{children}</div>
    </main>
  </div>
)

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
    },
    background: {
      flexGrow: 1,
      minWidth: 0, // So the Typography noWrap works
      backgroundColor: "#000000",
      minHeight: "100vh",
    },
    content: {
      padding: spacing.unit * 3,
      paddingTop: 64,
    },
  })

export default withStyles(styles)(Layout)
