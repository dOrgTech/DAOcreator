import {
  Card,
  CardContent,
  createStyles,
  Grid,
  List,
  ListItem,
  ListItemText,
  Switch,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import * as R from "ramda"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { AppState } from "../../AppState"
import { Scheme } from "../../lib/integrations/daoStack/arc"
import { schemes } from "../../lib/integrations/daoStack/arc/schemes"
import DaoCreatorActions, * as daoCreatorActions from "../../redux/actions/daoCreator"

interface Props extends WithStyles<typeof styles> {
  addedSchemes: Scheme[]
  actions: DaoCreatorActions
}

const AddScheme: React.SFC<Props> = ({ classes, addedSchemes, actions }) => {
  const handleChange = (scheme: Scheme) => (event: any) => {
    R.contains(scheme, addedSchemes) === true
      ? actions.remScheme(scheme)
      : actions.addScheme(scheme)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.headline} gutterBottom>
          Select Features
        </Typography>
        <Grid container spacing={16}>
          <Grid item xs={12} md={5}>
            <Typography className={classes.guideText} variant="body2">
              Let's select the features for the DAO at creation time.
              <br />
              <br />
              If the "Scheme Registrar" feature is added, it will be possible to
              add and remove features at any time after the DAO is created.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <List>
              {R.map(scheme => {
                return (
                  <ListItem key={`list-itiem-${scheme.typeName}`}>
                    <Switch
                      checked={R.contains(scheme, addedSchemes)}
                      onChange={handleChange(scheme)}
                      value={scheme.typeName}
                    />
                    <ListItemText
                      primary={scheme.displayName}
                      secondary={scheme.description}
                    />
                  </ListItem>
                )
              }, schemes)}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

// STYLE
const styles = ({  }: Theme) =>
  createStyles({
    header: {},
    card: {},
    addButton: {},
    subheader: {},
    headline: {},
    guideText: {
      fontSize: 18,
      maxWidth: 450,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 50,
      paddingBottom: 50,
      margin: "auto",
    },
  })

const componentWithStyles = withStyles(styles)(AddScheme)

// STATE
const mapStateToProps = (state: AppState) => {
  return {
    addedSchemes: state.daoCreator.schemes,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators(daoCreatorActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles)
