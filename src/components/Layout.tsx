import * as React from "react"
import { SFC } from "react"
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core"
import Background from "./Background"
import converge from "ramda/es/converge"

interface Props extends WithStyles<typeof styles> {}

const Layout: SFC<Props> = ({ classes, children }) => (
  <div className={classes.root}>
    <main className={classes.main}>
      <Background />
      <div>{children}</div>
    </main>
  </div>
)

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: 1,
      position: "relative",
      display: "flex",
    },
    main: {
      flexGrow: 1,
      minWidth: 0, // So the Typography noWrap works
      backgroundColor: "#000000",
      minHeight: "100vh",
      overflow: "ignore",
    },
  })

export default withStyles(styles)(Layout)
