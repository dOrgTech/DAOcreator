import * as React from "react"
import { withStyles, Theme, WithStyles, createStyles } from "@material-ui/core"
// import Particles from "react-particles-js"
import Unity from "react-unity-webgl"
var UnityContent = require("react-unity-webgl/source/UnityContent")

interface Props extends WithStyles<typeof styles> {}

type State = {
  unityContent: any
}

class Background extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.setState({
      unityContent: new UnityContent(
        "../explorer/Build/Build/Build.json",
        "../explorer/Build/Build/UnityLoader.js"
      ),
    })
  }

  public render() {
    return (
      <>
        <Unity unityContent={this.state.unityContent} />
      </>
    )
  }
}

/*const Background: React.SFC<Props> = ({ classes }) => (
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
)*/

const styles = ({  }: Theme) =>
  createStyles({
    background: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "absolute",
    },
  })

export default withStyles(styles)(Background)
