import React, { Component, useState } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import "./style.css";
import { withStyles } from "@material-ui/styles";
import { Provider, useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  TextField,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Radio,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  FormControl,
  FormLabel,
  createTheme,
  ThemeProvider,
  InputLabel,
  Select,MenuItem
} from "@material-ui/core";
import { blue, purple } from "@material-ui/core/colors";
import { styles } from "../Login/customStylesMui";
import logo from "../../Images/Daksh-Logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {backendUrl} from '../../actions/backendUrl';
import  "./style.css";
toast.configure();
const alerttoast = (name) => {
  toast.success(name);
};
function InnerRegistrationForm(props) {
  const history = useHistory();
  const [role, setRole] = useState("employee");
  const [userName, setUserName] = useState("test1");
  const currUser = useSelector((state) => state.curr_user, shallowEqual);
  const url = backendUrl;
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
  } = props;
  const handleRoleChange = (event) => {
    handleUsernameChange();
    setRole(event.target.value);
  };
  const handleRoleUpdate = () => {
    const isAdmin = (role == "admin");
    const isStaff = (role == "employee");
    const isManager = (role == "manager");


    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userName,
        is_admin: isAdmin,
        is_manager: isManager,
        is_staff: isStaff,
      }),
    };
    fetch(`${url}/user/role/`, requestOptions).then((response) =>
      response.json()
    );
    history.push("/")
  };
  const handleTimedSubmit = () => {
    setTimeout(handleRoleUpdate, 1500);
  };
  const handleUsernameChange = () => {
    setUserName(values.username);
  };
  const GoBackScreen = () => {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            px: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          style={{ height: "89vh" }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h4" color="error" align="center">
                Unable to Access
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button color="primary" align="center" variant ="outlined" fullWidth to="/" component={Link}>
                Go back
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  };
  if (!currUser.is_admin && !currUser.is_manager && !currUser.is_root) {
    return <GoBackScreen />;
  }
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: blue,
          secondary: purple,
        },
      })}
    >
      <div style={{ backgroundColor: "rgb(6, 58, 92)", height: "94vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Container component="main" maxWidth="xs">
          <Paper elevation={3}>
            <Box
              sx={{
                px: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  color="primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  Create A User
                </Typography>
                <div
                  container
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <img src={logo} style={{ height: "40px" }}></img>
                </div>
              </div>{" "}
              <Box
              />
              <Box sx={{ mb: 2 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        name="username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.username && touched.username}
                        helperText={
                          errors.username && touched.username && errors.username
                        }
                        label="Username"
                        //className={classes.textField}
                        required
                      />
                    </Grid>
                    {/* <Grid item sm={6} xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="First Name"
                    required
                  ></TextField>
                </Grid>
                <Grid item sm={6} xs={12}>
                  {" "}
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Last Name"
                    required
                  ></TextField>
                </Grid>  */}
                    <Grid item xs={12}>
                      <TextField
                        name="email"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email && touched.email}
                        helperText={
                          errors.email && touched.email && errors.email
                        }
                        label="Email Address"
                        //className={classes.textField}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="password1"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={values.password1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password1 && touched.password1}
                        helperText={
                          errors.password1 &&
                          touched.password1 &&
                          errors.password1
                        }
                        //className={classes.textField}
                        label="Password"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="password2"
                        type="password"
                        value={values.password2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password2 && touched.password2}
                        helperText={
                          errors.password2 &&
                          touched.password2 &&
                          errors.password2
                        }
                        //className={classes.textField}
                        label="Repeat your Password"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}><FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Role</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue=''
                            label="role"
                            // value={role}
                            onChange={handleRoleChange}
                          >
                            <MenuItem value="employee">Employee</MenuItem>
                            <MenuItem value="manager">Manager</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                      </FormControl>
                    </Grid>

                    {/* <Button
                  //className={classes.button}
                  type="button"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                  variant="raised"
                >
                  Reset
                </Button> */}
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        //className={classes.button}
                        type="submit"
                        disabled={isSubmitting}
                        onClick={handleTimedSubmit}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
              {/* <Grid container spacing={0} align="center">
              <Grid item xs={12}>
                <span>Already have an account?</span>
              </Grid>
              <Grid item xs={12}>
                <Link to="/login" className={classes.links}>
                  {" "}
                  Login
                </Link>
              </Grid>
            </Grid> */}
            </Box>
          </Paper>
        </Container>
      </div>
    </ThemeProvider>
  );
}
const EnhancedForm = withFormik({
  mapPropsToValues: () => ({
    username: "",
    email: "",
    password1: "",
    password2: "",
  }),
  validationSchema: Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password1: Yup.string()
      .min(4, "The password must be at least 4 characters")
      .required("Password is required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password1"), null], "Passwords don't match.")
      .required("Password confirm is required"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email is required"),
  }),
  handleSubmit: (
    { username, email, password1 },
    { props, setSubmitting, setErrors }
  ) => {
    props
      .registerAction({ username, email, password: password1 })
      .then((resp) => {
        if (
          resp.non_field_errors ||
          Array.isArray(resp.username) ||
          Array.isArray(resp.email) ||
          Array.isArray(resp.password)
        ) {
          setErrors(resp);
        } else {
          // props.dispatch(props.registrationSuccessMessage());
          alerttoast("User created successfully");
        }
      });
    setSubmitting(false);

  },
  displayName: "RegistrationForm", //hlps with react devtools
})(InnerRegistrationForm);
export const Register = withStyles(styles)(EnhancedForm);