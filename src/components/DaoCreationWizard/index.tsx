// TODO: create horizontal stepper with the different views
// return component that's
// <HorizontalStepper steps={[ SummaryView, FoundersView ]} />

import * as React from "react"
import { withStyles, Theme, WithStyles, createStyles } from "@material-ui/core"
import HorizontalStepper from "./HorizontalStepper"
import SummaryView from "./SummaryView"
import FoundersView from "./FoundersView"

interface Props extends WithStyles<typeof styles> {}

const DaoCreationWizard: React.SFC<Props> = () => (
  <HorizontalStepper
    steps={[
      {
        title: "Summary",
        content: SummaryView,
      },
      {
        title: "Founders",
        content: FoundersView,
      },
    ]}
  />
)

const styles = ({  }: Theme) => createStyles({})

export default withStyles(styles)(DaoCreationWizard)
