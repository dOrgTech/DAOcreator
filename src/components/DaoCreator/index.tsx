import * as React from "react"
import { withStyles, Theme, WithStyles, createStyles } from "@material-ui/core"
import SetupStepper from "./SetupStepper"
import NamingStep from "./NamingStep"
import FoundersStep from "./FoundersStep"

interface Props extends WithStyles<typeof styles> {}

const DaoCreator: React.SFC<Props> = () => (
  <SetupStepper
    steps={[
      {
        title: "Summary",
        content: <NamingStep />,
      },
      {
        title: "Founders",
        content: <FoundersStep />,
      },
    ]}
  />
)

const styles = ({  }: Theme) => createStyles({})

export default withStyles(styles)(DaoCreator)
