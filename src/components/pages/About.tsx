import * as React from "react"
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
} from "@material-ui/core"
import InfoPage from "../common/InfoPage"

interface Props extends WithStyles<typeof styles> {}

const About: React.SFC<Props> = ({ classes }) => (
  <InfoPage
    Content={() => (
      <>
        <Typography variant="h2" className={classes.header}>
          About dOrg
        </Typography>
        <Typography variant="h5">What we do</Typography>
        <Typography variant="body1" className={classes.body}>
          dOrg is a cooperative of freelancers building tools for distributed
          organizations. We make ecosystem partnerships and execute on work that
          advances the open-source DAO ecosystem.
          <br />
          <br />
          For the full picture, visit our{" "}
          <a href="https://github.com/dOrgTech/vision/blob/master/README.md">
            project overview
          </a>{" "}
          on Github.
        </Typography>
        <Typography variant="h5">How we do it</Typography>
        <Typography variant="body1" className={classes.body}>
          Our freelancer co-op rests on two core technologies:
          <li className={classes.listItem}>
            <i>DAOstack:</i> We conduct 100% of our operations and governance
            through <a href="https://alchemy.daostack.io">our own DAO</a>.
          </li>
          <li className={classes.listItem}>
            <i>Blockchain Based LLC:</i> Our DAO is a legally registered{" "}
            <a href="https://legislature.vermont.gov/statutes/section/11/025/04173">
              Vermont BBLLC
            </a>
            .
          </li>
        </Typography>
        <Typography variant="h5">Get in touch</Typography>
        <Typography variant="body1" className={classes.body}>
          Contact us through <a href="mailto:contact@dorg.tech">email</a> or{" "}
          <a href="https://discord.gg/6Kujmad">Discord</a>.
        </Typography>
      </>
    )}
  />
)

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    body: {
      margin: 20,
    },
    header: {
      margin: 20,
      textAlign: "center",
    },
    listItem: {
      listStyle: "decimal",
      marginLeft: "35px",
      marginTop: "10px",
    },
  })

export default withStyles(styles)(About)
