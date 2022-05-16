import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Navigation from "../components/Navigation";
import { logoutAction, refreshToken } from "../actions/auth/authActions";

// Add authentication info to every state update.
function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

// Make logoutAction function available for use in HTML
function mapDispatchToProps(dispatch) {
  return {
    logoutAction: () => dispatch(logoutAction()),
    refreshToken: () => dispatch(refreshToken())
  };
}

// Register Navigation to receive redux store updates.
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
