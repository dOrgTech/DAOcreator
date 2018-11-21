import Home from "./home"
import { connect } from "react-redux"
import { push } from "connected-react-router"

const mapStateToProps = (state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    createDao: () => {
      dispatch(push("/create-dao"))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
