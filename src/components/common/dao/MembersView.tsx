import * as React from "react"
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid,
  Button,
} from "@material-ui/core"
import MemberView from "./MemberView"
import { MembersForm, MemberForm, CreateMemberForm } from "../../../lib/forms"

interface Props extends WithStyles<typeof styles> {
  form: MembersForm
}

class MembersView extends React.Component<Props> {
  memberForm: MemberForm = CreateMemberForm()

  render() {
    const { classes, form } = this.props
    const memberForm = this.memberForm

    return (
      <>
        <Grid container spacing={16} className={classes.addLine}>
          <MemberView form={memberForm} editable={true} />
          <Grid item xs={1} className={classes.addButtonWrapper}>
            <Button
              onClick={() => {
                form.$.push(memberForm)
                memberForm.reset()
              }}
              className={classes.addButton}
              color="primary"
              variant="contained"
              aria-label="Add"
              disabled={memberForm.hasError}
            >
              Add
            </Button>
          </Grid>
        </Grid>
        {form.$.map(memberForm => (
          <MemberView form={memberForm} editable={false} />
        ))}
      </>
    )
  }
}

const styles = (theme: Theme) =>
  createStyles({
    addLine: {
      marginBottom: 10,
      justifyContent: "center",
    },
    addButton: {},
    addButtonWrapper: {
      marginTop: "auto",
      marginRight: theme.spacing.unit,
    },
  })

export default withStyles(styles)(MembersView)
