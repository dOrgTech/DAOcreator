import HorizontalStepper from "./horizontalStepper"
import { connect } from "react-redux"
import {
  stepperNext,
  stepperBack,
  stepperReset,
} from "../../../state/actions/DaoCreationWizard/horizontalStepper"

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    step: state.step,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    stepperNext: () => dispatch(stepperNext()),
    stepperBack: () => dispatch(stepperBack()),
    stepperReset: () => dispatch(stepperReset()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HorizontalStepper)
