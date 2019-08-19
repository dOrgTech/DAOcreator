import * as React from "react";
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Card,
  CardContent,
  Button,
  Grid,
  CardMedia
} from "@material-ui/core";

interface PanelData {
  icon: string;
  title: string;
  description: string;
}

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  title: string;
  panels: PanelData[];
  link: string;
}

const DetailsCard: React.SFC<Props> = ({ classes, title, panels, link }) => (
  <Grid container justify={"center"}>
    <Card className={classes.background}>
      <CardContent>
        <Grid container direction={"column"} alignItems={"center"}>
          <Typography variant={"h4"} align={"center"} className={classes.title}>
            {title}
          </Typography>
          <Grid
            container
            direction={"row"}
            justify={"space-evenly"}
            alignItems={"center"}
          >
            {panels.map(panel => (
              <>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="center"
                  className={classes.panel}
                >
                  <CardMedia image={panel.icon} className={classes.panelIcon} />
                  <CardContent>
                    <Typography
                      align={"center"}
                      variant={"h5"}
                      className={classes.title}
                    >
                      {panel.title}
                    </Typography>
                    <Typography
                      align={"center"}
                      className={classes.description}
                    >
                      {panel.description}
                    </Typography>
                  </CardContent>
                </Grid>
              </>
            ))}
          </Grid>
          <Button
            className={classes.button}
            variant={"contained"}
            onClick={() => window.open(link)}
          >
            Learn More
          </Button>
        </Grid>
      </CardContent>
    </Card>
  </Grid>
);

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    background: {
      background: "rgba(2, 46, 46, 0.2)",
      pointerEvents: "all",
      padding: "10px",
      minWidth: "425px",
      maxWidth: "800px",
      minHeight: "450px",
      marginRight: "20px",
      marginLeft: "20px"
    },
    title: {
      color: "#4bd2c6",
      marginBottom: "25px"
    },
    description: {
      color: "white"
    },
    panel: {
      maxWidth: "175px",
      minHeight: "285px",
      margin: "5px"
    },
    panelIcon: {
      width: "100px",
      height: "100px"
    },
    button: {
      marginTop: "10px",
      color: "#4bd2c6",
      width: "130px",
      backgroundColor: "rgba(2, 46, 46, 0.5)",
      "&:hover": {
        backgroundColor: "black"
      }
    }
  });

export default withStyles(styles)(DetailsCard);
