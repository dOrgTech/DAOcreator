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
  Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemIcon from "@material-ui/icons/Remove";
import MemberEditor from "./MemberEditor";
import { MemberForm, MembersForm } from "lib/forms";
import MembersSaveLoad from "./MembersSaveLoad";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: MembersForm;
  editable: boolean;
  getDAOTokenSymbol: () => string;
  scrollHeight?: string;
}

@observer
class MembersEditor extends React.Component<Props> {
  @observable addError: string | null | undefined = undefined;
  @observable memberForm = new MemberForm(this.props.getDAOTokenSymbol);

  render() {
    const {
      classes,
      form,
      editable,
      getDAOTokenSymbol,
      scrollHeight
    } = this.props;
    const memberForm = this.memberForm;

    const onAdd = async () => {
      // See if the new member for has errors
      const memberValidate = await memberForm.validate();
      if (memberValidate.hasError) {
        return;
      }

      // See if the new member can be added to the array
      // without any errors
      form.$.push(new MemberForm(getDAOTokenSymbol, memberForm));

      const membersValidate = await form.validate();
      if (membersValidate.hasError) {
        this.addError = form.error;
        form.$.pop();
        return;
      }

      this.addError = undefined;
      memberForm.reset();
    };

    return (
      <>
        {editable ? (
          <>
            <Grid container spacing={1} key={"new-member"} justify={"center"}>
              <MemberEditor form={memberForm} editable={true} />
              <Grid item className={classes.button}>
                <Fab
                  size={"small"}
                  color={"primary"}
                  disabled={memberForm.hasError}
                  onClick={onAdd}
                >
                  <AddIcon />
                </Fab>
              </Grid>
            </Grid>

            <Grid container justify={"center"}>
              {this.addError ? (
                <Typography color={"error"}>{this.addError}</Typography>
              ) : (
                <></>
              )}
            </Grid>

            <Grid direction={"column"}>
              <Typography variant="h6">Members</Typography>
              <MembersSaveLoad form={form} />
            </Grid>
          </>
        ) : (
          <> </>
        )}
        <Grid
          container
          style={
            scrollHeight
              ? {
                  maxHeight: scrollHeight,
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  overflowX: "hidden"
                }
              : {}
          }
        >
          {form.$.map((member, index) => (
            <Grid
              container
              spacing={1}
              key={`member-${index}`}
              justify={"center"}
            >
              <MemberEditor form={member} editable={false} />
              {editable ? (
                <Grid item className={classes.button}>
                  <Fab
                    size={"small"}
                    color={"primary"}
                    onClick={() => form.$.splice(index, 1)}
                  >
                    <RemIcon />
                  </Fab>
                </Grid>
              ) : (
                <> </>
              )}
            </Grid>
          ))}
        </Grid>
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
