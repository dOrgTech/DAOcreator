import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  AppBar,
  Toolbar,
  CardMedia,
  Grid,
  IconButton
} from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import GitHubIcon from "components/common/icons/GitHub";
import DiscordIcon from "components/common/icons/Discord";
import "./NeonGlow.css";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

const TopBar: React.SFC<Props> = ({ classes }) => {
  return (
    <AppBar position={"static"} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <a
          href="https://dorg.tech"
          className={classes.logoLink}
          target="_blank"
        >
          <Grid container justify={"center"} alignItems={"center"}>
            <div className={classes.bracket}>{"{"}</div>
            <CardMedia image={"/icons/dOrg.svg"} className={classes.image} />
            <div className={classes.bracket}>{"}"}</div>
          </Grid>
        </a>
        <div className={classes.contactIcons}>
          <IconButton
            className={classes.contactIcon}
            size={"small"}
            onClick={() => window.open("https://github.com/dOrgTech")}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            className={classes.contactIcon}
            size={"small"}
            onClick={() => window.open("https://discord.gg/Z5R4CcS")}
          >
            <DiscordIcon />
          </IconButton>
          <IconButton
            className={classes.contactIcon}
            size={"small"}
            onClick={() => window.open("mailto:contact@dorg.tech")}
          >
            <MailIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      background: "rgba(2, 46, 46, 0.2)",
      pointerEvents: "all",
      // bring forward (infront of background)
      position: "relative"
    },
    toolbar: {
      marginBottom: "5px"
    },
    menuButton: {
      position: "absolute",
      left: "10px"
    },
    menuIcon: {
      color: "#4bd2c6"
    },
    menuPaper: {
      background: "rgba(2, 46, 46, 0.9)",
      height: "305px",
      top: "75px"
    },
    menuItem: {
      color: "#4bd2c6"
    },
    image: {
      height: "59px",
      width: "122px",
      marginTop: "5px"
    },
    bracket: {
      pointerEvents: "none",
      fontSize: "50px",
      color: "#4bd2c6",
      marginRight: "15px",
      marginLeft: "15px",
      "-webkit-animation": "neon 1.5s ease-in-out infinite alternate",
      "-moz-animation": "neon 1.5s ease-in-out infinite alternate",
      animation: "neon 1.5s ease-in-out infinite alternate"
    },
    contactIcons: {
      position: "absolute",
      right: "10px"
    },
    contactIcon: {
      color: "#4bd2c6",
      margin: "5px"
    },
    logoButton: {
      color: "rgba(2, 46, 46, 0.1)",
      backgroundColor: "rgba(2, 46, 46, 0.1)",
      "&:hover": {
        backgroundColor: "rgba(1, 1, 1, 0.2)"
      },
      margin: "10px"
    },
    logoLink: {
      textDecoration: "none",
      margin: "auto"
    }
  });

export default withStyles(styles)(TopBar);
