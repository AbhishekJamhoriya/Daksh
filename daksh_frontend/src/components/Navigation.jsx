import { NavLink as Link, useHistory,Route } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import React, { useState, useEffect } from "react";
import { AddCurrUser } from "../actions/user/userActions";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import axios from "axios";
import logo from "../Images/Daksh-Logo.png";
import { backendUrl } from "../actions/backendUrl";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { func } from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Col, Row } from "react-bootstrap";

const userUrl = (process.env.REACT_APP_DEV_URL || backendUrl) + "/user";
const sensorUrl = (process.env.REACT_APP_DEV_URL || backendUrl) + "/sensor";
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function Navigation(props) {
  /********************************************************* Hooks ************************************************** */
  const classes = useStyles();
  var history = useHistory();
  const bull = <span className={classes.bullet}>•</span>;
  const currUser = useSelector((state) => state.curr_user, shallowEqual);
  const dispatch = useDispatch();
  /********************************************************* States ************************************************** */
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [requests, setRequests] = useState([]);
  const [statusChanges, setStatusChanges] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetchingStatusChanges, setIsFetchingStatusChanges] = useState(true);
  const [isFetchingRequests, setIsFetchingRequests] = useState(true);
  const [isFetchingCurrUser, setIsFetchingCurrUser] = useState(true);
  /********************************************************* Body ************************************************** */
  var viewSensorsBool = false;
  if (currUser.is_approved) {
    viewSensorsBool = true;
  }
  console.log(currUser);
  /********************************************************* Functions ************************************************** */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleNavbarOnClick = () => {
    if (window.innerWidth <= 989) {
      return toggle();
    }
  };

  const clearStatusNotification = () => {
    setStatusChanges(0);
    toggleNavbarOnClick();
  };

  const getChip = () => {
    if (currUser.is_approved) {
      if (currUser.is_admin) {
        return (
          <Chip label="Admin" style={{ marginLeft: "5px" }} color="secondary" />
        );
      } else if (currUser.is_staff) {
        return (
          <Chip
            label="Site Admin"
            style={{
              marginLeft: "5px",
              backgroundColor: "#008000",
              color: "#FFFFFF",
            }}
          />
        );
      } else {
        return (
          <Chip label="Viewer" style={{ marginLeft: "5px" }} color="primary" />
        );
      }
    }
  };
  const getBellNotificaionAdmin = () => {
    if (currUser.is_approved) {
      if (currUser.is_admin) {
        return (
          <div>
            {currUser.is_admin && (
              <>
                <NavItem style={{ marginLeft: "100px" }}>
                  <IconButton component="span"></IconButton>
                </NavItem>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {requests.map((req, i) => {
                    return (
                      <MenuItem>
                        <Card className={classes.root}>
                          <CardContent>
                            <Typography
                              className={classes.title}
                              color="textSecondary"
                              gutterBottom
                            >
                              User: {req.username}
                            </Typography>
                            <Typography variant="h5" component="h2">
                              Staff Request
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              startIcon={<SaveIcon />}
                              onClick={() => {
                                handleReq(req.username, "True");
                                handleClose();
                              }}
                            >
                              Accept
                            </Button>

                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                handleReq(req.username, "False");
                                handleClose();
                              }}
                            >
                              Reject
                            </Button>
                          </CardActions>
                        </Card>
                      </MenuItem>
                    );
                  })}
                  {requests.length == 0 && (
                    <MenuItem>No Pending Requests</MenuItem>
                  )}
                </Menu>
              </>
            )}
          </div>
        );
      }
    }
  };
  const userIsAuthenticatedEmail = () => {
    if (props.authenticated) {
      return (
        <div  >
          <UncontrolledDropdown
            nav
            className="nav-item dropdown"
            key="email-auth"

          >
            <DropdownToggle
              nav
              caret
              className="nav-link"
              style={{ color: "white" }}
            >
              Account
            </DropdownToggle>
            <DropdownMenu
              className="dropdown-menu"
              style={{ backgroundColor: "black", width: "200px",marginLeft:"-2rem",marginLeft:"-6rem"}}
            >
              <Button
                variant="outlined"
                style={{ height: "40px", margin: "5px"}}
              >
                <span key="home">
                  <NavLink
                    onClick={toggleNavbarOnClick}
                    style={{ color: "white", margin: "0px", fontSize: "14px" }}
                  >
                    {currUser.username}
                    {getChip()}
                  </NavLink>
                </span>
              </Button>
              <Button
                variant="outlined"
                style={{ height: "40px", margin: "5px" }}
              >
                <span key="signout" onClick={props.logoutAction}>
                  <NavLink
                    tag={Link}
                    to="/signout"
                    onClick={toggleNavbarOnClick}
                    style={{ color: "white", margin: "0px", fontSize: "14px" }}
                  >
                    Log out
                  </NavLink>
                </span>
              </Button>

                <Button
                  variant="outlined"
                  style={{ height: "40px", margin: "5px" }}
                >
                  {/* <NavLink
                    tag={Link}
                    to="http://localhost:8000/report/getreport/"
                    // key="sign-up"

                    onClick={toggleNavbarOnClick}
                    style={{ color: "white", margin: "0px", fontSize: "14px" }}
                  >
                    Generate Report
                  </NavLink> */}
                  <a
                    href="http://localhost:3000/report/"
                    target="_blank"
                    style={{
                      color: "white",
                      marginLeft: "9px",
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    Generate Report
                  </a>
                </Button>

              {currUser.is_admin || currUser.is_manager ? (<Button
                  variant="outlined"
                  style={{ height: "40px", margin: "5px" }}
                >
                  <NavLink
                    tag={Link}
                    to="/register"
                    // key="sign-up"

                    onClick={toggleNavbarOnClick}
                    style={{ color: "white", margin: "0px", fontSize: "14px" }}
                  >
                    Create User
                  </NavLink>
                </Button>): null}


                <Button
                  variant="outlined"
                  style={{ height: "40px", margin: "5px" }}
                >
                  <NavLink
                    tag={Link}
                    to="/manage-schedule"
                    // key="sign-up"

                    onClick={toggleNavbarOnClick}
                    style={{ color: "white", margin: "0px", fontSize: "14px" }}
                  >
                  Schedules
                  </NavLink>
                </Button>
                <Button
                  variant="outlined"
                  style={{ height: "40px", margin: "5px" }}
                >
                  <NavLink
                    tag={Link}
                    to="/alarm-graph"
                    // key="sign-up"

                    onClick={toggleNavbarOnClick}
                    style={{ color: "white", margin: "0px", fontSize: "14px" }}
                  >
                  Alarm Graph
                  </NavLink>
                </Button>
                <Button
                  variant="outlined"
                  style={{ height: "40px", margin: "5px" }}
                >
                  <NavLink
                    tag={Link}
                    to="/alarm-history"
                    // key="sign-up"

                    onClick={toggleNavbarOnClick}
                    style={{ color: "white", margin: "0px", fontSize: "14px" }}
                  >
                  Alarm History
                  </NavLink>
                </Button>


              {currUser.is_admin ? (
                <Button
                  variant="outlined"
                  style={{ height: "40px", margin: "5px" }}
                >
                  <a
                    href={backendUrl+"/admin/"}
                    target="_blank"
                    style={{
                      color: "white",
                      marginLeft: "9px",
                      fontSize: "14px",
                      textDecoration: "none",
                    }}
                  >
                    Admin Panel
                  </a>
                  {/* <NavLink
                  tag={Link}
                  to="http://localhost:8000/admin/"

                  onClick={toggleNavbarOnClick}
                  style={{color:"white",margin:"0px",fontSize:"14px"}}
                >  Edit User
                </NavLink> */}
                </Button>
              ) : null}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    }
  };
  const userIsNotAuthenticated = () => {
    if (!props.authenticated) {
      return <></>;
    }
  };
  const handleReq = async (username, paylaod) => {
    let url = `${userUrl}/approval/${username}/`;

    const formData = new FormData();
    formData.append("key", paylaod);
    const resp = await axios
      .post(url, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `JWT ${localStorage.getItem("jwt_token")}`,
        },
      })
      .catch((err) => console.log(err));
    setRefresh(refresh + 1);
  };

  /********************************************************* useEffects ************************************************** */
  useEffect(async () => {
    setIsFetchingCurrUser(true);
    if (props.authenticated) {
      let url = `${userUrl}/name/`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("jwt_token")}`,
        },
      });
      dispatch(AddCurrUser(res.data));
      setIsFetchingCurrUser(false);
    }
  }, [props.authenticated]);

  useEffect(async () => {
    setIsFetchingRequests(true);
    if (props.authenticated) {
      let url = `${userUrl}/approval/`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("jwt_token")}`,
        },
      });
      setRequests([...res.data]);
      setIsFetchingRequests(false);
    }
    props.refreshToken();
    setInterval(function () {
      props.refreshToken();
    }, 900000);
  }, [refresh, props.authenticated]);

  /********************************************************* RenderFunction ************************************************** */
  return (
    <>
      <div>
        <Navbar
          color="faded"
          className="navbar navbar-toggleable-md navbar-inverse "
          expand="md"
          style={{ height: "6vh" ,backgroundColor:"#001f29"}}
        >
          <NavbarBrand href="/">
            <img
              style={{
                width: "150px",
                height: "30px",
                backgroundColor: "white",
              }}
              src={logo}
            ></img>
          </NavbarBrand>
          <NavbarToggler
            onClick={() => {
              toggle();
            }}
          />
          <Collapse isOpen={isOpen} navbar style={{width:"auto",marginLeft:"auto",marginRight:".5rem"}}>
            <Nav navbar >
              <NavItem >
                <NavLink
                  tag={Link}
                  to="/"
                  activeClassName="active"
                  exact
                  onClick={toggleNavbarOnClick}
                >
                  Home
                </NavLink>
              </NavItem >
              {userIsNotAuthenticated()}
              {userIsAuthenticatedEmail()}
              {/* {!isFetchingRequests && getBellNotificaionAdmin()} */}
              {/* <NavItem style={{color:"white",marginTop:"0.5rem",marginLeft:"11px"}}>
                <a href="http://localhost:8000/admin/" target="_blank" style={{color:"white",fontSize:"18px",textDecoration:"none"}}>Edit Users</a>
              </NavItem> */}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    </>
  );
}
export default Navigation;
