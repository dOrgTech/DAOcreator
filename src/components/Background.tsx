import * as React from "react"
import { withStyles, Theme, WithStyles, createStyles } from "@material-ui/core"
import Particles from "react-particles-js"

interface Props extends WithStyles<typeof styles> {}

const Background: React.SFC<Props> = ({ classes }) => (
  <>
    <Particles
      params={{
        particles: {
          number: {
            value: 80,
          },
          size: {
            value: 5,
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: "repulse",
            },
          },
        },
      }}
      className={classes.background}
    />
  </>
)

const styles = ({  }: Theme) =>
  createStyles({
    background: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "fixed",
    },
  })

export default withStyles(styles)(Background)
