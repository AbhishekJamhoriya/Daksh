import React, { Component } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/styles";
import {
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
  Checkbox,
  FormControlLabel,
  FormLabel,
} from "@material-ui/core";
import { blue, purple } from "@material-ui/core/colors";

import { styles } from "./customStylesMui";
import logo from "../../Images/Daksh-Logo.png"
import  "./style.css"
import {backendUrl} from "../../actions/backendUrl";

class InnerLoginForm extends Component {

  componentDidMount() {
    fetch(`${backendUrl}/report/start-scheduler/`)
    .then(res => res.json())
    .then(data => {console.log(data)})
  }

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
      handleReset,
      classes,
    } = this.props;

    return (
      <ThemeProvider
        theme={createTheme({
          palette: {
            primary: blue,
            secondary: purple,
          },
        })}
      >
        <div className="loginpage">
        <Container component="main" maxWidth="xs" className="logindiv">
         
            <Box
              sx={{
                // px: 1,
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
             
            >
              <div className="loginlogodiv">
              <div className="loginanddakshlogo" >
                
                <Typography variant="h5" component="h1" color="primary">
                    Login
                  </Typography>
                  <img src={logo} style={{height:"35px"}}></img>
              </div>
               
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        name="username"
                        type="text"
                        fullWidth
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.username && touched.username}
                        helperText={
                          errors.username && touched.username && errors.username
                        }
                        label="Username"
                        //className={classes.textField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password && touched.password}
                        helperText={
                          errors.password && touched.password && errors.password
                        }
                        label="Password"
                        //className={classes.textField}
                      />
                    </Grid>
                    {/* <div style={{width:"100%"}}>
                      <Grid container>
                        
                        <div style={{marginLeft:"auto",marginRight:"1rem"}}>
                          <Link to="/resetpassword">
                            <Typography color="secondary">
                              Forgot password?
                            </Typography>
                          </Link>
                          </div>
                      </Grid>
                    </div> */}
                    <Grid item xs={12}>
                      {/* <Grid item xs={3}>
                      <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className={classes.button}
                        type="button"
                        onClick={handleReset}
                        disabled={!dirty || isSubmitting}
                      >
                        Reset
                      </Button>
                    </Grid> */}
                      <Button
                        variant="contained"
                        fullWidth
                        className="signinbtn"
                        color="primary"
                        //className={classes.button}
                        type="submit"
                        disabled={isSubmitting}
                        style={{height:"3rem"}}
                      >
                        Sign in
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                {/* <span>Do not have an account?</span>{" "}
              <Link to="/register" className={classes.links}>
                Register
              </Link> */}
                <div className={classes.container} />
              </div>
            </Box>
      
        </Container>
        </div>
      </ThemeProvider>
    );
  }
}
const EnhancedForm = withFormik({
  mapPropsToValues: () => ({
    username: "",
    password: "",
  }),
  validationSchema: Yup.object().shape({
    username: Yup.string().required("This field is required"),
    password: Yup.string()
      .min(4, "The password must be at least 4 characters")
      .required("Password is required"),
  }),
  handleSubmit: (
    { username, password },
    { props, setSubmitting, setErrors }
  ) => {
    props.loginAction({ username, password }).then((response) => {
      if (response.non_field_errors) {
        setErrors({ password: response.non_field_errors[0] });
      } else {
        props.authenticateAction(
          response,
          props.dispatch,
          props.location.pathname,
          props.history.push
        );
      }
    });
    setSubmitting(false);
  },
  displayName: "LoginForm", //hlps with react devtools
})(InnerLoginForm);

export const Login = withStyles(styles)(EnhancedForm);
