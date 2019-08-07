import * as React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  Card,
  Button,
  CardContent
} from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {
  goHome: () => void;
  Content: React.FunctionComponent;
}

const InfoPage: React.SFC<Props> = ({ classes, goHome, Content }) => (
  <div className={classes.root}>
    <Button
      variant="contained"
      size="small"
      className={classes.button}
      onClick={goHome}
    >
      Back to Home
    </Button>
    <div className={classes.cardWrapper}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Content />
        </CardContent>
      </Card>
    </div>
  </div>
);

// STYLE
const padding = 50;
const minWidth = 800;
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      minWidth: minWidth + padding * 2,
      height: "100vh"
    },
    cardWrapper: {
      width: 0,
      position: "relative",
      left: "50%",
      pointerEvents: "none"
    },
    cardContent: {},
    card: {
      maxWidth: 1200,
      minWidth: minWidth,
      position: "inherit",
      transform: "translateX(-50%)",
      pointerEvents: "all",
      marginBottom: 40
    },
    button: {
      margin: 10
    }
  });

const componentWithStyles = withStyles(styles)(InfoPage);

// STATE
const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    goHome: () => {
      dispatch(push("/"));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles);
