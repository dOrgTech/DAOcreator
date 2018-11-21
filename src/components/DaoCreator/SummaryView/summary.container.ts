import Summary from "./summary"
import { connect } from "react-redux"

const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onNext: (data: any) => {
      // 1. save data in the store
      // 2. navigate to next DaoSummary view
      console.log("Next!")
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary)
