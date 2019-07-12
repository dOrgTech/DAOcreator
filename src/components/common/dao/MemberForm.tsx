import * as React from "react"
import { Grid } from "@material-ui/core"
import FormField from "../FormField"
import EthAddressAvatar from "../EthAddressAvatar"
import { MemberForm as Form, GetStringOrEmpty } from "../../../lib/forms"

export enum MemberFormState {
  Edit,
  Set,
}

interface Props {
  form: Form
  initState: MemberFormState
}

interface State {
  state: MemberFormState
}

// TODO: upon clicking button, call the "changeState" function with current and new state,
// and see if the parent wants to allow the transition.
// - duplicate addresses
// - set parent form drawer to an invalid state (unable to resume)
class MemberForm extends React.Component<Props> {
  render() {
    const { form } = this.props
    const address = GetStringOrEmpty(form.$.address)

    return (
      <>
        <Grid container spacing={16} key={`founder-${address}`}>
          <Grid item xs={1}>
            <EthAddressAvatar address={address} />
          </Grid>
          <Grid item xs={6}>
            <FormField.Text
              id={"address"}
              label={"Member Address"}
              field={form.$.address}
            />
          </Grid>
          <Grid item xs={2}>
            <FormField.Text
              id={"reputation"}
              label={"Reputation"}
              field={form.$.reputation}
            />
          </Grid>
          <Grid item xs={2}>
            <FormField.Text
              id={"tokens"}
              label={"Tokens"}
              field={form.$.tokens}
            />
          </Grid>
        </Grid>
      </>
    )
  }
}

export default MemberForm
