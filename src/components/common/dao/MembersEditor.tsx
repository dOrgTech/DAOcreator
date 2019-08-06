import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid,
  Fab,
  Typography,
  FormControl
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemIcon from "@material-ui/icons/Remove";
import MemberEditor from "./MemberEditor";
import {
  MemberForm,
  MembersForm,
  CreateMemberForm,
  CreateMembersForm
} from "../../../lib/forms";

interface Props extends WithStyles<typeof styles> {
  form: MembersForm;
  getDAOTokenSymbol: () => string;
}

@observer
class MembersEditor extends React.Component<Props> {
  @observable addError: string | null | undefined = undefined;
  @observable memberForm: MemberForm = CreateMemberForm(
    this.props.getDAOTokenSymbol
  );

  render() {
    const { classes, form, getDAOTokenSymbol } = this.props;
    const memberForm = this.memberForm;

    return (
      <>
        <Grid container spacing={1} key={"new-member"} justify={"center"}>
          <MemberEditor form={memberForm} editable={true} />
          <Grid item className={classes.button}>
            <FormControl fullWidth>
              <Fab
                size={"small"}
                color={"primary"}
                disabled={memberForm.hasError}
                onClick={async () => {
                  // See if the new member for has errors
                  const formValidate = await memberForm.validate();
                  if (formValidate.hasError) {
                    return;
                  }

                  // See if the new member can be added to the array
                  // without any errors
                  const arrayCopy = CreateMembersForm(getDAOTokenSymbol, form);
                  arrayCopy.$.push(memberForm);

                  const arrayValdiate = await arrayCopy.validate();
                  if (arrayValdiate.hasError) {
                    this.addError = arrayCopy.error;
                    return;
                  }

                  this.addError = undefined;

                  // Finally add the new member to the form
                  form.$.push(CreateMemberForm(getDAOTokenSymbol, memberForm));
                  memberForm.reset();
                }}
              >
                <AddIcon />
              </Fab>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container justify={"center"}>
          {this.addError ? (
            <Typography color={"error"}>{this.addError}</Typography>
          ) : (
            <></>
          )}
        </Grid>

        {form.$.length > 0 ? (
          <Typography variant="h6">Members</Typography>
        ) : (
          <></>
        )}

        {form.$.map((member, index) => (
          <Grid
            container
            spacing={1}
            key={`member-${index}`}
            justify={"center"}
          >
            <MemberEditor form={member} editable={false} />
            <Grid item className={classes.button}>
              <Fab
                size={"small"}
                color={"secondary"}
                onClick={() => form.$.splice(index, 1)}
              >
                <RemIcon />
              </Fab>
            </Grid>
          </Grid>
        ))}
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    button: {
      alignSelf: "center"
    }
  });

export default withStyles(styles)(MembersEditor);
