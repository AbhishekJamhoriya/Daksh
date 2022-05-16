import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
require("dotenv").config();
import {
  Router,
  Route,
  Switch,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

import { store } from "./store";
import { AuthenticatedRoute, PrivateRoute } from "./customRoutes/ProtectedRoutes";

import Navigation from "./containers/NavigationContainer";
import HomePage from "./containers/HomePageContainer";
import Login from "./containers/auth/LoginContainer";
import Register from "./containers/auth/RegisterContainer";
import ChangePassword from "./containers/auth/ChangePasswordContainer";
import ResetPassword from "./containers/auth/ResetPasswordContainer";
import Report from "./components/Report/report";

import Searchgrid from "./components/Report/Searchgrid";
import ManageSchedule from "./components/Report/ManageSchedule";

import Alarm_Graph from "./components/Alarm/Alarm_Graph";
import Alarm_History from "./components/Alarm/Alarm_History";

import "./index.css";
// import LoginScreen from "./components/auth/Login";
// import Login  from "./components/Login/Login";
export const history = createHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
      <Navigation/>
        <Switch>
          <PrivateRoute exact path="/" component={HomePage}/>
          <PrivateRoute exact path="/home" component={HomePage} />
          <AuthenticatedRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/register" component={Register} />
          <AuthenticatedRoute exact path="/resetpassword" component={ResetPassword} />
          <Route exact path="/signout" render={() => <Redirect to="/login" />} />
          <Route exact path="/changepassword" component={ChangePassword} />
          <Route path = "/report" component ={Report}/>
          <Route path="/manage-schedule" component={ManageSchedule} />
          <Route path = "/alarm-graph" component={Alarm_Graph}/>
          <Route path = "/alarm-history" component={Alarm_History}/>

        </Switch>
      </div>
    </Router>
  </Provider>,

  document.getElementById("root")
);
