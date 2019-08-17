import * as React from "react";
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  Grid,
  LinearProgress,
  Collapse
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import TopCard from "./TopCard";
import DetailsCard from "./DetailsCard";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {}

enum Selection {
  None,
  Hire,
  Join
}

const LearnMore: React.SFC<Props> = ({ classes }) => {
  const [selection, setSelection] = React.useState(Selection.None);

  const TopCardHighlight = withStyles({
    root: {
      height: "5px",
      marginTop: "5px",
      borderRadius: 250
    },
    bar: {
      backgroundColor: "#4bd2c6"
    }
  })(LinearProgress);

  return (
    <>
      <Grid
        container
        direction={"row"}
        justify={"center"}
        alignItems={"flex-start"}
      >
        <Grid item xs={5} className={classes.topCard}>
          <TopCard
            icon={"/icons/flock.svg"}
            title={"Hire dOrg"}
            description={
              "We can develop anything, from small and fast prototypes, to finished polished products."
            }
            onSelect={() =>
              setSelection(
                selection === Selection.Hire ? Selection.None : Selection.Hire
              )
            }
          />
          {selection === Selection.Hire ? (
            <TopCardHighlight variant={"determinate"} value={100} />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={5} className={classes.topCard}>
          <TopCard
            icon={"/icons/explorer.svg"}
            title={"Join dOrg"}
            description={
              "Work with a talented, ever growing, community of developers from around the world."
            }
            onSelect={() =>
              setSelection(
                selection === Selection.Join ? Selection.None : Selection.Join
              )
            }
          />
          {selection === Selection.Join ? (
            <TopCardHighlight variant={"determinate"} value={100} />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
      <Collapse
        in={selection !== Selection.None}
        className={
          selection !== Selection.None ? classes.collapse : classes.noCollapse
        }
      >
        <SwipeableViews axis={"x"} index={selection - 1} disabled={true}>
          <DetailsCard
            title={"Don't outsource, DAOsource."}
            panels={[
              {
                icon: "/icons/quality.png",
                title: "Quality Work, Guaranteed",
                description:
                  "Payment is released at pre-set milestones upon your approval."
              },
              {
                icon: "/icons/price.png",
                title: "Know The Price Upfront",
                description:
                  "Know exactly what you’ll pay. No hourly rates, just a fixed price."
              },
              {
                icon: "/icons/cust-support.png",
                title: "Customer Support",
                description:
                  "Tailored solutions and quick response times help you get what you need, when you need it."
              }
            ]}
          />
          <DetailsCard
            title={"Ready. Set. DAO."}
            panels={[
              {
                icon: "/icons/meritocratic.png",
                title: "Meritocratic by Design",
                description:
                  "Earn ownership and governance rights in proportion to your contributions."
              },
              {
                icon: "/icons/transparency.png",
                title: "Radical Transparency",
                description:
                  "Know exactly what your peers earn. No hidden hierarchies, just people."
              },
              {
                icon: "/icons/contrib-support.png",
                title: "Contributor Support",
                description:
                  "Administrative support frees you up to focus on the projects you care about."
              }
            ]}
          />
        </SwipeableViews>
      </Collapse>
    </>
  );
};

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    topCard: {
      minWidth: "380px",
      maxWidth: "420px",
      margin: "20px"
    },
    collapse: {
      width: "100%"
    },
    noCollapse: {
      width: "0px"
    }
  });

export default withStyles(styles)(LearnMore);
