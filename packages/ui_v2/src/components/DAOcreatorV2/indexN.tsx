import * as React from "react";
import {
  DAOForm,
  // DAOConfigForm,
  // MembersForm,
  // SchemesForm,
  toDAOMigrationParams,
  fromDAOMigrationParams,
  toJSON,
  fromJSON
} from "@dorgtech/daocreator-lib";
import { Accordion } from "react-rainbow-components";
import { Box } from "@chakra-ui/core";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import InstallStep from "./InstallStep";
// eslint-disable-next-line
interface Props {}

interface State {
  step: number;
  isMigrating: boolean;
  recoverPreviewOpen: boolean;
}

// Local Storage Key + Values
const DAO_CREATOR_STATE = "DAO_CREATOR_SETUP";
interface DAO_CREATOR_STATE {
  step: number;
  form: string;
}

class DAOcreator extends React.Component<Props, State> {
  form = new DAOForm();
  recoveredForm = new DAOForm();

  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      isMigrating: false,
      recoverPreviewOpen: false
    };
  }

  componentDidMount() {
    // Preview a saved DAO if one is found
    this.previewLocalStorage();
    window.addEventListener("beforeunload", this.saveLocalStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveLocalStorage);
  }

  saveLocalStorage = () => {
    const daoState = this.form.toState();

    // Check to see if the current form state hasn't been edited,
    // and if so early out so we don't save an empty state
    const nullForm = new DAOForm();
    if (JSON.stringify(daoState) === JSON.stringify(nullForm.toState())) {
      return;
    }

    const daoParams = toDAOMigrationParams(daoState);
    const json = toJSON(daoParams);
    const daoCreatorState: DAO_CREATOR_STATE = {
      step: this.state.step,
      form: json
    };

    localStorage.setItem(DAO_CREATOR_STATE, JSON.stringify(daoCreatorState));
  };

  resetLocalStorage = () => {
    localStorage.removeItem(DAO_CREATOR_STATE);

    this.setState({
      ...this.state,
      step: 0,
      recoverPreviewOpen: false
    });
  };

  loadLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      return;
    }

    const { step, form } = JSON.parse(daoCreatorState) as DAO_CREATOR_STATE;
    const daoParams = fromJSON(form);
    const daoState = fromDAOMigrationParams(daoParams);
    this.form.fromState(daoState);

    this.setState({
      ...this.state,
      step,
      recoverPreviewOpen: false
    });
  };

  previewLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      return;
    }

    const { form } = JSON.parse(daoCreatorState) as DAO_CREATOR_STATE;
    const daoParams = fromJSON(form);
    const daoState = fromDAOMigrationParams(daoParams);
    this.recoveredForm.fromState(daoState);

    this.setState({
      ...this.state,
      recoverPreviewOpen: true
    });
  };

  onClose = () => {
    this.setState({
      ...this.state,
      recoverPreviewOpen: false
    });
  };

  render() {
    return (
      <Box style={styles.root}>
        <h3 style={styles.header}>Create Organisation</h3>
        <Accordion id="accordion">
          <NamingStep
            form={this.form}
            daoForm={this.form}
            toReviewStep={() => {
              this.setState({ ...this.state, step: 3 });
            }}
          />
          <SchemesStep form={this.form.$.schemes} />
          <MembersStep
            form={this.form.$.members}
            getDAOTokenSymbol={(): any => {}}
          />
          <InstallStep form={this.form} daoForm={this.form} />
        </Accordion>
      </Box>
    );
  }
}

const styles = {
  root: {
    fontFamily: "Roboto",
    maxWidth: 734,
    border: "1px solid #EAEDF3",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.04)",
    borderRadius: 4
  },
  header: {
    paddingLeft: "36.5%"
  }
};

export default DAOcreator;
