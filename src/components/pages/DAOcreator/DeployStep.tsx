// TODO: list of steps to take, each with their own transactions that need to be sent.
// TODO: move away from using redux
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../../lib/state";
import { Member, Scheme } from "../../../lib/dependency/arc";

interface Props extends WithStyles<typeof styles> {
  daoName: string;
  tokenName: string;
  tokenSymbol: string;
  founders: Member[];
  schemes: Scheme[];
  stepNumber: number;
  stepValid: boolean;
}

const DeployStep: React.SFC<Props> = ({}) => <></>;

// STYLE
const styles = (theme: Theme) => createStyles({});

const componentWithStyles = withStyles(styles)(DeployStep);

// STATE
const mapStateToProps = (state: RootState) => {
  return {
    daoName: state.daoCreator.config.daoName,
    tokenName: state.daoCreator.config.tokenName,
    tokenSymbol: state.daoCreator.config.tokenSymbol,
    founders: state.daoCreator.members,
    schemes: state.daoCreator.schemes
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithStyles);
