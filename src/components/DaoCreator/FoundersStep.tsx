import * as React from "react"
import { connect } from "react-redux"
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
  ListItem,
} from "@material-ui/core"

interface Props extends WithStyles<typeof styles> {}

const FoundersStep: React.SFC<Props> = ({ classes }) => (
  <>
    <Card className={classes.card}>
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <Typography>aaa</Typography>
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Typography>aaa</Typography>
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Typography>aaa</Typography>
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItem>
      <CardContent>
        <Typography>Something something something.</Typography>
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
)

// STYLE
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
  })

const componentWithStyles = withStyles(styles)(FoundersStep)

// STATE
const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
