import React, { Component } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import {TextField,Button,Container,Paper,Grid,Typography,Box,createTheme,ThemeProvider,Checkbox,FormControlLabel,FormLabel} from "@material-ui/core";
import { blue, purple } from "@material-ui/core/colors";
import { styles } from "./customStylesMui";
import logo from "../../Images/dummylogo.png"


class InnerLoginForm extends Component {
  render() {
    const {values,touched,errors,dirty,isSubmitting,handleChange,handleBlur,handleSubmit,handleReset,classes,
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
        <Container component="main" maxWidth="xs">
          <Paper elevation={4}>
            <Box
              sx={{
                px: 4,
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className={classes.container}>
              <Container className="loginlogodiv" style={{display:"flex"}}>
              
                  <Typography variant="h5" >
                    Hi, Welcome Back
                  </Typography>
                
                
                <img src={logo} style={{height:"30px"}}></img>
                <Typography>Daksh</Typography>
              </Container>
               
                
                <p style={{ textAlign: "center", marginBottom: "50px" }}>
                  <Typography variant="h4" component="h1" color="primary">
                    Login
                  </Typography>
                </p>
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
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox value="remember" color="primary" />
                            }
                            label="remember me"
                            labelPlacement="end"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Link to="/resetpassword">
                            <Typography color="secondary">
                              Forgot password?
                            </Typography>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
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
                        sx={{ mt: 3, mb: 2 }}
                        color="primary"
                        //className={classes.button}
                        type="submit"
                        disabled={isSubmitting}
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
          </Paper>
        </Container>
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
  handleSubmit: ({ username, password },{ props, setSubmitting, setErrors }) => {
    props.loginAction({ username, password }).then((response) => {
      if (response.non_field_errors) {
        setErrors({ password: response.non_field_errors[0] });
        console.log("Respose",response.non_field_errors);
      } else {
        props.authenticateAction(
          response,
          props.dispatch,
          props.location.pathname,
          props.history.push
        );
        console.log("Response",response);
      }
    });
    setSubmitting(false);
  },
  displayName: "LoginForm", //hlps with react devtools
})(InnerLoginForm);
const Login = withStyles(styles)(EnhancedForm);

export default Login;