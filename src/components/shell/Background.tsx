import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Paper
} from "@material-ui/core";
import Particles from "react-particles-js";

interface Props extends WithStyles<typeof styles> {}

const Background: React.SFC<Props> = ({ classes }) => (
  <Paper square={true} className={classes.background}>
    <Particles
      className={classes.particles}
      params={{
        particles: {
          number: {
            value: 80
          },
          size: {
            value: 5
          }
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: "bubble"
            }
          }
        }
      }}
    />
  </Paper>
);

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundColor: "#4e4e4e",
      position: "fixed",
      width: "100vw",
      height: "100vh"
    },
    particles: {
      //padding: "5px",
      //borderRadius: "90px",
      backgroundImage:
        "radial-gradient(circle at bottom left, rgb(0%, 26.6%, 30.8%), #38ffeb);",
      backgroundOrigin: "border-box",
      backgroundClip: "content-box, border-box;",
      overflow: "hidden",
      position: "fixed",
      width: "100%",
      height: "100%",
      flexGrow: 1,
      minWidth: 0, // So the Typography noWrap works
      minHeight: "100vh"
    }
  });

export default withStyles(styles)(Background);
