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
  Button,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  IconButton
} from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import GitHubIcon from "../common/icons/GitHub";
import TwitterIcon from "../common/icons/Twitter";
import "./NeonGlow.css";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  gotoDapp: () => void;
}

const TopBar: React.SFC<Props> = ({ classes, gotoDapp }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <AppBar position={"static"} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Grid container justify={"center"} alignItems={"center"}>
          <div className={classes.bracket}>{"{"}</div>
          <div>
            <Button
              ref={anchorRef}
              aria-controls="menu-list-grow"
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <CardMedia image={"/icons/dOrg.svg"} className={classes.image} />
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom"
                  }}
                >
                  <Paper id="menu-list-grow" className={classes.menu}>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList>
                        <MenuItem
                          onClick={event => {
                            gotoDapp();
                            handleClose(event);
                          }}
                          className={classes.menuItem}
                        >
                          Create a DAO
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
          <div className={classes.bracket}>{"}"}</div>
        </Grid>
        <div className={classes.icons}>
          <IconButton
            className={classes.icon}
            size={"small"}
            onClick={() => window.open("https://github.com/dOrgTech")}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            className={classes.icon}
            size={"small"}
            onClick={() => window.open("https://twitter.com/dOrg_tech")}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            className={classes.icon}
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
    menu: {
      background: "rgba(2, 46, 46, 0.8)"
    },
    menuItem: {
      color: "#4bd2c6"
    },
    image: {
      height: "50px",
      width: "103px",
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
    icons: {
      position: "absolute",
      right: "10px"
    },
    icon: {
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
    gotoDapp: () => {
      dispatch(push("/dapp"));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles);
