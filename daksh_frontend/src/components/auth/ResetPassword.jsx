import React, { Component } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";

import { withStyles } from "@material-ui/styles";
import { TextField, Button } from "@material-ui/core";

import { styles } from "../Login/customStylesMui";

class InnerPwForm extends Component {
  render() {
    const {
      values,
      touched,
      errors,
      dirty,
      isSubmitting,
      handleChange,
      handleBlur,
      handleSubmit,
      sendCode,
      handleReset,
      classes,
      reset_password
    } = this.props;

    return (
      <span className={classes.container}>
        <h3 style={{ textAlign: "center" }}>Reset Your Password</h3>
        {reset_password.resp_message && (
          <div className="alert alert-success" role="alert">
            <strong>{reset_password.resp_message}</strong>
          </div>
        )}
        {reset_password.err && (
          <div className="alert alert-danger" role="alert">
            <strong>{reset_password.err.message}</strong>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email && touched.email}
            helperText={
              errors.email &&
              touched.email &&
              errors.email
            }
            label="Registered Email"
            className={classes.textField}
          />

          <TextField
            name="code"
            type="code"
            value={values.code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.code && touched.code}
            helperText={
              errors.code &&
              touched.code &&
              errors.code
            }
            label="Verification Code"
            className={classes.textField}
          />
          <Button
            variant="raised"
            className={classes.button}
            type="submit"
            disabled={isSubmitting}
            onClick={sendCode}
          >
            Send code
          </Button>

          <TextField
            name="new_password"
            type="password"
            value={values.new_password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.new_password && touched.new_password}
            helperText={
              errors.new_password && touched.new_password && errors.new_password
            }
            label="New Password"
            className={classes.textField}
          />
          <TextField
            name="re_new_password"
            type="password"
            value={values.re_new_password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.re_new_password && touched.re_new_password}
            helperText={
              errors.re_new_password &&
              touched.re_new_password &&
              errors.re_new_password
            }
            label="Repeat New Password"
            className={classes.textField}
          />
          <br />
          <Button
            variant="raised"
            className={classes.button}
            type="button"
            onClick={handleReset}
            disabled={!dirty || isSubmitting}
          >
            Reset
          </Button>
          <Button
            variant="raised"
            className={classes.button}
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </form>
      </span>
    );
  }
}

const EnhancedForm = withFormik({
  mapPropsToValues: () => ({
    email: "",
    code: "",
    new_password: "",
    re_new_password: ""
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .min(4, "This field must be at least 4 characters")
      .required("This field is required"),
    code: Yup.string()
      .min(4, "This field must be at least 4 characters")
      .required("This field is required"),
    new_password: Yup.string()
      .min(4, "The password must be at least 4 characters")
      .required("New Password is required"),
    re_new_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords don't match.")
      .required("Password confirm is required")
  }),
  sendCode: (
    { email },
    { props, setSubmitting, setErrors, resetForm }
  ) => {
    props
      .sendCode({ email })
      .then(() => window.scrollTo(0, 0));
  },
  handleSubmit: (
    { email, code, new_password, re_new_password },
    { props, setSubmitting, setErrors, resetForm }
  ) => {
    props
      .resetPassword({ email, code, new_password, re_new_password })
      .then(() => window.scrollTo(0, 0))
      .then(() => resetForm());
    setSubmitting(false);
  },
  displayName: "ResetPasswordForm" //hlps with react devtools
})(InnerPwForm);

export const ResetPassword = withStyles(styles)(EnhancedForm);
