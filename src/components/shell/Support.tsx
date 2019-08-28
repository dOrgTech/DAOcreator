import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

const Support: React.SFC<Props> = ({ classes }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        className={classes.supportButton}
      >
        <ContactSupportIcon className={classes.supportIcon} />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor={"right"}
        classes={{
          paper: classes.menuPaper
        }}
      >
        <List>
          {[
            {
              title: "Report a bug",
              onClick: () =>
                window.open("https://dorgtech.typeform.com/to/Q1LOP1")
            },
            {
              title: "Request a feature",
              onClick: () =>
                window.open("https://dorgtech.typeform.com/to/a1rMob")
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
              <ListItemText primary={item.title} className={classes.menuItem} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    supportButton: {
      position: "fixed",
      right: "5px",
      bottom: "5px",
      color: "#4bd2c6",
      backgroundColor: "rgba(2, 46, 46, 0.5)",
      "&:hover": {
        backgroundColor: "black"
      }
    },
    supportIcon: {
      color: "#4bd2c6"
    },
    menuPaper: {
      background: "rgba(2, 46, 46, 0.9)",
      height: "unset",
      top: "75px"
    },
    menuItem: {
      color: "#4bd2c6"
    }
  });

const componentWithStyles = withStyles(styles)(Support);
export default componentWithStyles;
