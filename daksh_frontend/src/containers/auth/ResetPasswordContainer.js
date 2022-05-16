import { connect } from "react-redux";
import { resetPassword } from "../../actions/auth/resetPasswordActions";
import { ResetPassword } from "../../components/auth/ResetPassword";

const mapStateToProps = state => ({ reset_password: state.reset_password });
const mapDispatchToProps = dispatch => ({
  resetPassword: pwDetails => dispatch(resetPassword(pwDetails))
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
