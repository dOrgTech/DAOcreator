import * as React from "react";
import { SFC } from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {};

const Layout: SFC<Props> = ({ classes, children }) => (
  <div className={classes.root}>
    <main className={classes.content}>
      {children}
    </main>
  </div>
);

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
    },
    content: {
      flexGrow: 1,
      padding: spacing.unit * 3,
      minWidth: 0, // So the Typography noWrap works
      paddingTop: 64,
      backgroundColor: "#fdebd4",
      minHeight: "100vh",
    },
  });

export default withStyles(styles)(Layout);
