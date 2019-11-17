import * as React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  AppBar,
  Toolbar,
  CardMedia,
  Grid,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MailIcon from "@material-ui/icons/Mail";
import GitHubIcon from "components/common/icons/GitHub";
import DiscordIcon from "components/common/icons/Discord";
import "./NeonGlow.css";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  gotoHome: () => void;
  gotoAbout: () => void;
  gotoDapp: () => void;
}

const TopBar: React.SFC<Props> = ({
  classes,
  gotoHome,
  gotoAbout,
  gotoDapp
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <AppBar position={"static"} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          onClick={() => setOpen(true)}
          className={classes.menuButton}
        >
          <MenuIcon className={classes.menuIcon} />
        </IconButton>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          anchor={"left"}
          classes={{
            paper: classes.menuPaper
          }}
        >
          <List>
            {[
              { title: "Home", onClick: gotoHome },
              { title: "About", onClick: gotoAbout },
              { title: "Create A DAO", onClick: gotoDapp },
              {
                title: "Hire dOrg",
                onClick: () =>
                  window.open("https://dorgtech.typeform.com/to/Q1LOP1")
              },
              {
                title: "Join dOrg",
                onClick: () =>
                  window.open("https://dorgtech.typeform.com/to/a1rMob")
              },
              {
                title: "View Our DAO",
                onClick: () =>
                  window.open(
                    "https://alchemy.daostack.io/dao/0xbe1a98d3452f6da6e0984589e545d4fc25af7526"
                  )
              }
            ].map(item => (
              <ListItem
                button
                key={item.title}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
              >
                <ListItemText
                  primary={item.title}
                  className={classes.menuItem}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Grid container justify={"center"} alignItems={"center"}>
          <div className={classes.bracket}>{"{"}</div>
          <CardMedia image={"/icons/dOrg.svg"} className={classes.image} />
          <div className={classes.bracket}>{"}"}</div>
        </Grid>
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
      position: "relative",
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
    }
  });

const componentWithStyles = withStyles(styles)(TopBar);

// STATE
const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    gotoHome: () => {
      dispatch(push("/"));
    },
    gotoAbout: () => {
      dispatch(push("/about"));
    },
    gotoDapp: () => {
      dispatch(push("/dapp"));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles);
