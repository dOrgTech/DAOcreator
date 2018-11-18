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
  ListItemIcon,
  ListItemText,
  ListSubheader,
  ListItem
} from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {};

const Home: React.SFC<Props> = ({ classes }) => (
  <>
    <Card className={classes.card}>
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          aaa
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
            bbb
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
            ccc
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItem>
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

