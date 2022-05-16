import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AddCurrUser } from "../actions/user/userActions";
import Alert from "@material-ui/lab/Alert";
import {
  CardContent,
  CardActionArea,
  CardActions,
  Button,
  Card,
  Container,
  FormControl,
  Icon,
  InputLabel,
  NativeSelect,
  TextField,
  Select,
  Grid,
  Typography,
  MenuItem,
  Paper,
  Chip,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { Form } from "reactstrap";
import { backendUrl } from "../actions/backendUrl";
import { makeStyles } from "@material-ui/core/styles";

import "./style.css";
import welcomeimage from "./../Images/WelcomeScreen.png";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const useStyles = makeStyles({
  home: {
    height: "94vh",
    width: "100vw",
    display: "flex",
    // "flex-direction": "row",
    // "flex-wrap": "nowrap",
    // "margin-left": "unset",
    // minWidth: "-webkit-fill-available",
    // border: "5px solid red",
    backgroundColor: "#001f29",
  },
  root: {
    // minWidth: "-webkit-fill-available",
    // border: "5px solid cyan",
  },
  iframe: {
    position: "absolute",
    // border: "5px solid red",
    width: "100%",
    height: "100%",

    // maxWidth:""
  },
  container: {
    // "-ms-overflow-style": "none", /* for Internet Explorer, Edge */
    // border:"5px solid red",
    scrollbarWidth: "none",
    width: "auto",
    backgroundColor: "#001f29",
    margin: "0.5rem",
    paddingRight: "1rem",
    overflowY: "auto",
  },

  toggle: {
    width: "150px",
    height: "45px",
    // paddingTop:"6px",
    "background-color": "transparent",
    // border:"1px solid DodgerBlue",
    borderRadius: "12px 12px 12px 12px",
    color: "#ffffff",
    border: "1px solid #001f29",
    cursor: "pointer",
    // "border-radius": "10px",

    background: "linear-gradient(to right, DodgerBlue 50%, transparent 50%)",
    backgroundSize: "200% 100%",
    backgroundPosition: "right bottom",
    transition: "all .5s ease-out",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    textAlign: "center",
    fontVariantCaps: "all-petite-caps",
    flexDirection: "row-reverse",
    // paddingLeft:"1rem",
    "&:hover": {
      backgroundPosition: "left bottom",
    },
    // "&:hover .arrow":{
    //   transform: "rotate(360deg)"
    // }
  },
});
const sensorUrl = (process.env.REACT_APP_DEV_URL || backendUrl) + "/sensor";
const userUrl = (process.env.REACT_APP_DEV_URL || backendUrl) + "/user";

const HomePage = ({ registration_message }) => {
  /*********************************************************** Hooks ********************************************************* */
  const classes = useStyles();
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.auth.authenticated);

  /*********************************************************** States ********************************************************* */
  const [siteAdminUsername, setSiteAdminUsername] = useState("");
  const [currUser, setcurrUser] = useState({
    username: "",
    parent_name: "",
    is_root: "",
    is_admin: "",
    is_staff: "",
    is_manager: "",
    is_approved: "",
  });
  const [sentRequestNotAccepted, setSentRequestNotAccepted] = useState(false);
  const [needToSendReq, setNeedToSendReq] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [value, setValue] = useState({
    is_admin: false,
    is_root: false,
    is_manager: false,
    is_staff: false,
  });
  const [siteSelected, setSiteSelected] = useState("");
  const [sensors, setSensors] = useState([]);
  const [sortBy, setSortBy] = useState(0);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isFetchingSensors, setIsFetchingSensors] = useState(false);
  const [areSensorsFetched, setAreSensorsFetched] = useState(false);
  const [isInitializingForm, setIsInitializingForm] = useState(false);
  const [contentURL, setContentURL] = useState("");
  const [IsOpen, setIsOpen] = useState(false);
  // const [load,setload]=useState(false);
  const handle = useFullScreenHandle();
  /*********************************************************** Body ********************************************************* */
  /*********************************************************** UseEffects ********************************************************* */

  useEffect(() => {
    if (!currUser.is_approved) {
      if (!currUser.is_admin && !currUser.is_manager && !currUser.is_staff) {
        setNeedToSendReq(true);
        setSentRequestNotAccepted(false);
      } else {
        setSentRequestNotAccepted(true);
        setNeedToSendReq(false);
      }
    } else {
      setNeedToSendReq(false);
      setSentRequestNotAccepted(false);
    }
  }, [isFetchingUser]);

  useEffect(async () => {
    setIsFetchingUser(true);
    if (authenticated) {
      let url = `${userUrl}/name/`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("jwt_token")}`,
        },
      });
      setcurrUser({
        username: res.data.username,
        parent_name: res.data.parent_name,
        is_admin: res.data.is_admin,
        is_root: res.data.is_root,
        is_manager: res.data.is_manager,
        is_staff: res.data.is_staff,
        is_approved: res.data.is_approved,
      });
      setIsFetchingUser(false);
      setIsInitializingForm(true);
      let prevStateSelected = localStorage.getItem("stateSelected");
      if (prevStateSelected) {
        handleStateSelected({ target: { value: prevStateSelected } });
        // Remaining logic in useEffect as it requires stateSelected to be updated first
      } else {
        setIsInitializingForm(false);
      }
    }
  }, [refresh, authenticated]);

  useEffect(async () => {
    setIsFetchingSensors(true);
    var url = `${sensorUrl}/sensors/`;
    const resp = await axios
      .get(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("jwt_token")}`,
        },
      })
      .catch((err) => console.log(err));
    if (resp) {
      let newSensors = resp.data;
      setSensors(newSensors);
    } else {
      setSensors([]);
    }
    setIsFetchingSensors(false);
    setAreSensorsFetched(true);
  }, [refresh, authenticated]);

  /*********************************************************** Functions ********************************************************* */
  const getSensorName = (sensor) => {
    return sensor.sensor_name + " | " + sensor.id;
  };

  const handleChange = async (event) => {
    if (event.target.value == "root") {
      setValue({
        is_root: true,
        is_admin: false,
        is_staff: false,
        is_manager: false,
      });
    } else if (event.target.value == "admin") {
      setValue({
        is_root: false,
        is_admin: true,
        is_staff: false,
        is_manager: false,
      });
    } else if (event.target.value == "manager") {
      setValue({
        is_root: false,
        is_admin: false,
        is_staff: false,
        is_manager: true,
      });
    } else if (event.target.value == "staff") {
      setValue({
        is_root: false,
        is_admin: false,
        is_staff: true,
        is_manager: false,
      });
    } else if (event.target.value == "manager") {
      setValue({
        is_root: false,
        is_admin: false,
        is_staff: false,
        is_manager: true,
      });
    } else {
      setValue({
        is_root: false,
        is_admin: false,
        is_staff: false,
        is_manager: false,
      });
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    let url = `${userUrl}/name/`;
    const formUserData = new FormData();
    if (value.is_root || value.is_admin || value.is_manager || value.is_staff) {
      formUserData.append("username", currUser.username);
      formUserData.append("parent_name", siteAdminUsername);
      formUserData.append("is_root", value.is_root ? 1 : 0);
      formUserData.append("is_admin", value.is_admin ? 1 : 0);
      formUserData.append("is_approved", value.is_staff ? 1 : 0);
      formUserData.append("is_manager", value.is_manager ? 1 : 0);
      const resp = await axios
        .post(url, formUserData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `JWT ${localStorage.getItem("jwt_token")}`,
          },
        })
        .catch((err) => console.log(err));
      setRefresh(refresh + 1);
    }
  };

  /*********************************************************** Render Function ********************************************************* */
  const renderContent = () => {
    return (
      <div
        handle={handle}
        fixed
        style={{ height: "94vh", width: "100vw", position: "relative" }}
        id="imagediv"
      >
        {areSensorsFetched && sensors.length == 0 && (
          <Alert severity="info">No sensors in this topic</Alert>
        )}
        {!areSensorsFetched && sensors.length == 0 && (
          <Alert severity="info">Please select a topic</Alert>
        )}
        {contentURL != "" && (
          <FullScreen handle={handle} className={classes.iframe}>
            <iframe id="iframe-content" src={contentURL} frameBorder="0" />
          </FullScreen>
        )}
        {contentURL == "" && (
          <FullScreen handle={handle} className={classes.iframe}>
            <img
              src={welcomeimage}
              style={{ width: "100%", height: "100%" }}
            ></img>
          </FullScreen>
        )}
        <div className="screensize">
          <div className="screensizediv">
            <h6 className="tooltips">Full screen </h6>
            <button className="screensizebtn" onClick={handle.enter}>
              <FullscreenIcon className="screensizeicon" fontSize="large" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ----*******----------------********************88---------------------
  const openlist = () => {
    setIsOpen(!IsOpen);
    {
      IsOpen == false &&
        ((document.getElementById("datalist").style.display = "none"),
        (document.getElementById("dashboard").style.width = "2.7rem"),
        (document.getElementById("imagediv").style.width = "100vw"),
        (document.getElementById("heading").style.display = "none"));
    }
    {
      IsOpen == true &&
        ((document.getElementById("datalist").style.display = "flex"),
        (document.getElementById("dashboard").style.width = "auto"),
        // document.getElementById("imagediv").style.marginRight="2vw",
        (document.getElementById("heading").style.display = "block"));
    }
  };

  const renderTopicPannel = () => {
    const topLevelSensors = sensors.filter((sensor) => sensor.depth == 0);

    return (
      <div className={classes.container} id="dashboard">
        <div className="expandicondiv">
          <h4
            id="heading"
            style={{
              textAlign: "center",
              marginBottom: "10px",
              color: "white",
              fontVariant: "all-petite-caps",
            }}
          >
            Dashboard
          </h4>
          <button className="expandbtn" onClick={openlist}>
            {IsOpen == true && <ArrowForwardIosIcon />}
            {IsOpen == false && <ArrowBackIosIcon />}
          </button>
        </div>
        <div id="datalist">
          {topLevelSensors.map((topLevelSensor, i) => {
            const children = sensors.filter(
              (sensor) => sensor.parent_id == topLevelSensor.id
            );

            return (
              <div className="level1">
                <label
                  for={"btn-" + i + 1}
                  className={classes.toggle}
                  onClick={(e) => {
                    setContentURL(topLevelSensor.content_url);
                  }}
                >
                  {topLevelSensor.sensor_name}

                  <ArrowDropDownIcon
                    className={children.length == 0 ? "arrowlevel3" : "arrow"}
                  />
                </label>
                <input
                  className="dashboardinput"
                  type="checkbox"
                  id={"btn-" + i + 1}
                ></input>
                <ul className="level2">
                  {children.map((child, i) => {
                    const grandchildren = sensors.filter(
                      (sensor) => sensor.parent_id == child.id
                    );
                    return (
                      <li>
                        <li style={{ marginTop: "5px" }}>
                          <label
                            for={
                              "btn-" +
                              i +
                              1 +
                              children.length +
                              topLevelSensors.length +
                              grandchildren.length
                            }
                            className={classes.toggle}
                            onClick={(e) => setContentURL(child.content_url)}
                          >
                            {child.sensor_name}

                            <ArrowDropDownIcon
                              className={
                                grandchildren.length == 0
                                  ? "arrowlevel3"
                                  : "arrow"
                              }
                            />
                          </label>
                        </li>
                        <input
                          className="dashboardinput"
                          type="checkbox"
                          id={
                            "btn-" +
                            i +
                            1 +
                            children.length +
                            topLevelSensors.length +
                            grandchildren.length
                          }
                        />
                        <ul className="level3">
                          {grandchildren.map((supchild, i) => {
                            return (
                              <li
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <label
                                  className={classes.toggle}
                                  onClick={(e) =>
                                    setContentURL(supchild.content_url)
                                  }
                                >
                                  {supchild.sensor_name}
                                  <ArrowDropDownIcon className="arrowlevel3" />
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderApprovalForm = () => {
    return <Card></Card>;
  };

  return (
    <div>
      {registration_message && (
        <div className="alert alert-info text-center mt-4" role="alert">
          <strong>{registration_message}</strong>
        </div>
      )}
      {!isFetchingUser && (
        <div className={classes.home}>
          {/* {sentRequestNotAccepted && (
            <Alert severity="info">Request For Approval Sent</Alert>
          )} */}
          {/* {needToSendReq && renderApprovalForm()}
          {!sentRequestNotAccepted  && renderTopicPannel()}
          {!isFetchingSensors && renderContent()} */}
          {renderTopicPannel()}
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default HomePage;
