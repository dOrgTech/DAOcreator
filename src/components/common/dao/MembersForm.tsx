import * as React from "react"
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid,
  Button,
} from "@material-ui/core"
import FormField from "../FormField"
import {
  MembersForm as Form,
  MemberForm,
  CreateMemberForm,
} from "../../../lib/forms"

interface Props extends WithStyles<typeof styles> {
  form: Form
}

class MembersForm extends React.Component<Props> {
  memberForm: MemberForm = CreateMemberForm()

  render() {
    const { classes, form } = this.props

    return (
      <>
        <Grid container spacing={16} className={classes.addLine}>
          <MemberForm form={memberForm} />
          <Grid item xs={1} className={classes.addButtonWrapper}>
            <Button
              onClick={this.onAddFounder}
              className={classes.addButton}
              color="primary"
              variant="contained"
              aria-label="Add"
              disabled={!formValid}
            >
              Add
            </Button>
          </Grid>
        </Grid>
        {form.$.map(memberForm => (
          <MemberForm form={memberForm} />
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
    addButtonWrapper: {
      marginTop: "auto",
      marginRight: theme.spacing.unit,
    },
  })

export default withStyles(styles)(MembersForm)
