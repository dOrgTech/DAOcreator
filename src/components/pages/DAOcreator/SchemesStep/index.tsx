import * as R from "ramda"
import {
  Button,
  Card,
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import {
  Scheme,
  VotingMachineConfiguration,
  getScheme,
} from "../../../../lib/integrations/daoStack/arc"
import DAOcreatorActions, * as daoCreatorActions from "../../../../redux/actions/daoCreator"
import AddSchemeDialog from "./AddSchemeDialog"

interface Props extends WithStyles<typeof styles> {
  schemes: {
    schemeTypeName: string
    votingMachineConfig: VotingMachineConfiguration
  }[]
  actions: DAOcreatorActions
}

interface State {
  expanded: string | null
  addSchemeDialogOpen: boolean
}

class SchemesStep extends React.Component<Props, State> {
  public readonly state: State = {
    expanded: null,
    addSchemeDialogOpen: false,
  }

  constructor(props: Props) {
    super(props)
  }

  handleChange = (panel: any) => (event: any, expanded: boolean) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  addScheme = (
    schemeType: string,
    votingMachineConfig: VotingMachineConfiguration
  ) => {
    this.props.actions.addOrUpdateScheme(schemeType, votingMachineConfig)
  }

  setSchemeDialog = (newStatus: boolean) => () =>
    this.setState({
      addSchemeDialogOpen: newStatus,
    })

  render() {
    const { schemes, classes } = this.props
    const { expanded, addSchemeDialogOpen } = this.state

    return (
      <Card className={classes.card}>
        <div className={classes.root}>
          {R.map(({ schemeTypeName, votingMachineConfig }) => {
            const scheme = getScheme(schemeTypeName)
            const key =
              schemeTypeName + votingMachineConfig.typeName + Date.now()
            return (
              <ExpansionPanel
                expanded={expanded === key}
                onChange={this.handleChange(key)}
                key={key}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    {scheme.displayName}
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    {votingMachineConfig.typeName}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                    feugiat. Aliquam eget maximus est, id dignissim quam.
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )
          }, schemes)}
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.setSchemeDialog(true)}
        >
          Add Scheme
        </Button>
        <AddSchemeDialog
          open={addSchemeDialogOpen}
          addScheme={this.addScheme}
          close={this.setSchemeDialog(false)}
        />
      </Card>
    )
  }
}

// STYLE
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    card: {},
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    button: {
      margin: theme.spacing.unit,
      float: "right",
    },
  })

const componentWithStyles = withStyles(styles)(SchemesStep)

// STATE
const mapStateToProps = (state: any) => {
  return {
    schemes: state.daoCreator.schemes,
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
