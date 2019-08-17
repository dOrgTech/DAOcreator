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
  IconButton,
  Grid
} from "@material-ui/core";
import QuestionIcon from "@material-ui/icons/Help";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  icon: string;
  title: string;
  description: string;
  onSelect: () => void;
}

const TopCard: React.SFC<Props> = ({
  classes,
  icon,
  title,
  description,
  onSelect
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
        <IconButton onClick={onSelect} className={classes.button}>
          <QuestionIcon />
        </IconButton>
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
      padding: "10px"
    },
    icon: {
      minHeight: "200px",
      maxWidth: "200px",
      margin: "auto"
    },
    title: {
      color: "#4bd2c6"
    },
    description: {
      color: "white"
    },
    button: {
      marginTop: "10px",
      color: "#4bd2c6",
      backgroundColor: "rgba(2, 46, 46, 0.5)",
      "&:hover": {
        backgroundColor: "black"
      }
    }
  });

export default withStyles(styles)(TopCard);
