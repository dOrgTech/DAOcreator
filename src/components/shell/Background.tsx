import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Paper
} from "@material-ui/core";
import Particles from "react-particles-js";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> { }

const Background: React.SFC<Props> = ({ classes }) => (
  <Paper square={true} className={classes.background}>
    <Particles
      className={classes.particles}
      params={{
        particles: {
          number: {
            value: 50
          },
          size: {
            value: 5
          }
        },
        interactivity: {
          detect_on: "window",
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
      backgroundColor: "#0e9999",
      position: "fixed",
      width: "100vw",
      height: "100vh"
    },
    particles: {
      //padding: "5px",
      //borderRadius: "90px",
      backgroundImage:
        "radial-gradient(circle at bottom left, rgb(0%, 26.6%, 30.8%), #077d7d);",
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
