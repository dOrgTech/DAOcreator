import * as React from "react";
import { observer } from "mobx-react";
import { Button, Text, CheckboxGroup, Checkbox } from "@chakra-ui/core";
// import { AnySchemeForm } from "@dorgtech/daocreator-lib";

// eslint-disable-next-line
interface Props {
  // form: AnySchemeForm;
  form: any;
  editable: boolean;
  enabled: boolean;
  onToggle: (toggled: boolean) => void;
}

interface State {
  enabled: boolean;
}

@observer
class SchemeEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { enabled: props.enabled };
  }

  render() {
    return (
      <>
        <Text fontSize="md">Recommend Configuration</Text>
        <Text fontSize="xs">
          Your proposal uses a proposal-vote structure and can securely scale to
          a big organisation
        </Text>
        <CheckboxGroup
          variantColor="green"
          defaultValue={["reward", "penalize", "autobet"]}
        >
          <Checkbox value="reward">
            Reward voters who side with the mayority
          </Checkbox>
          <Checkbox value="penalize">
            Penalize voters who side against the mayority
          </Checkbox>
          <Checkbox value="autobet">
            Auto-bet against every proposal to incentive curation of valuable
            proposals
          </Checkbox>
        </CheckboxGroup>
        <Button variantColor="blue" variant="solid">
          Set Configuration
        </Button>
      </>
    );
  }
}

const styles = {
  card: {
    minWidth: 250,
    maxWidth: 420
  },
  schemeIcon: {
    width: "100%",
    height: "100%"
  },
  schemeDescription: {
    marginBottom: 15
  }
};

export default SchemeEditor;
