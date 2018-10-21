import * as React from "react";
import {
  withStyles,
  Typography,
  Theme,
  WithStyles,
  createStyles,
  Card,
  CardActions,
  Button,
  CardContent,
} from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {};

const Home: React.SFC<Props> = ({ classes }) => (
  <>
    <Typography variant="h2" className={classes.header}>
      Testing 1234
    </Typography>
    <Card className={classes.card}>
      <CardContent>
        <Typography>
          Something something something.
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          href="https://github.com/dOrgTech"
          target="_blank"
        >
          Check our GitHub
        </Button>
      </CardActions>
    </Card>
  </>
);

const styles = ({  }: Theme) =>
  createStyles({
    header: {
      marginTop: 100,
      textAlign: "center",
    },
    card: {
      maxWidth: 700,
      margin: "auto",
      marginTop: 100,
    },
  });

export default withStyles(styles)(Home);
