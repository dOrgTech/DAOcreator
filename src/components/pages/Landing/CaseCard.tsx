import * as React from "react";
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton
} from "@material-ui/core";
import TestIcon from "@material-ui/icons/ExitToApp";
import GitHubIcon from "../../common/icons/GitHub";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  icon: string;
  title: string;
  description: string;
  github: string;
  test?: string;
}

const CaseCard: React.SFC<Props> = ({
  classes,
  icon,
  title,
  description,
  github,
  test
}) => (
  <Card className={classes.background}>
    <CardMedia image={icon} className={classes.icon} />
    <CardContent>
      <Grid
        container
        direction={"column"}
        justify={"flex-start"}
        alignItems={"center"}
      >
        <Typography variant={"h4"} className={classes.title}>
          {title}
        </Typography>
        <Typography align={"center"} className={classes.description}>
          {description}
        </Typography>
        <Grid container direction={"row"} justify={"center"}>
          <IconButton
            className={classes.iconButton}
            onClick={() => window.open(github)}
          >
            <GitHubIcon />
          </IconButton>
          {test ? (
            <IconButton
              className={classes.iconButton}
              onClick={() => window.open(test)}
            >
              <TestIcon />
            </IconButton>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    background: {
      background: "rgba(2, 46, 46, 0.2)",
      pointerEvents: "all",
      padding: "10px",
      minHeight: "515px"
    },
    icon: {
      minHeight: "300px",
      maxWidth: "300px",
      margin: "auto"
    },
    title: {
      color: "#4bd2c6"
    },
    description: {
      color: "white"
    },
    iconButton: {
      margin: "10px",
      color: "#4bd2c6",
      backgroundColor: "rgba(2, 46, 46, 0.5)",
      "&:hover": {
        backgroundColor: "black"
      }
    }
  });

export default withStyles(styles)(CaseCard);
