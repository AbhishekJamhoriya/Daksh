import React, { Component, useState, useRef, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Button,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  createTheme,
  ThemeProvider,
  Tooltip,
  Dialog,
  List,
  ListItem,
  Snackbar,
} from "@material-ui/core";
import Logo from "../../Images/Daksh-Logo.png";
import MaterialTable from "material-table";
import { backendUrl } from "../../actions/backendUrl";
import moment from "moment";
import { useHistory } from "react-router-dom";
import MuiAlert from "@material-ui/lab/Alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
toast.configure();
const alerttoast = (name) => {
  toast.success(name);
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function ScheduleReport(props) {
  //----------------------------------------------------------------- variables ----------------------------------------------------------------------------//
  const history = useHistory();
  const [report, setReport] = useState(props.report);
  const [freq, setFreq] = useState(props.freq);
  const [schedule, setSchedule] = useState(props.schedule);
  const [energyRows, setEnergyRows] = useState([]);
  const [RawHistoricalReportRows, setRawHistoricalReportRows] = useState([]);
  const selectedRows = useRef([]);
  const selectedRecipients = useRef([]);
  const [freqNum, setFreqNum] = useState(props.freqNum);
  const [scheduleNum, setScheduleNum] = useState(props.scheduleNum);
  const [recipientRows, setRecipientRows] = useState([]);
  const [time, setTime] = useState(props.time);
  const [day, setDay] = useState(props.day);
  const [date, setDate] = useState(props.date);
  const url = backendUrl;
  const [freqOpen, setFreqOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [selectedRowOpen, setSelectedRowOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const recipientCols = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
  ];

  const energyColumns = [
    { title: "ID", field: "id", headerName: "ID", width: 90 },
    { title: "Code", field: "code" },
  ];

  const RawHistoricalReportColumns = [
    { title: "ID", field: "id", headerName: "ID", width: 90 },
    { title: "DEVICE", field: "Device" },
    { title: "CHANNEL", field: "Channel" },
  ];

  const textfreq =
    "set how many " +
    (freq == "weekly" ? "weeks" : "months") +
    " after which you get the report";
  const textSchedule =
    (freq == "weekly" ? "weeks" : "months") + " for which you need report";

  //----------------------------------------------------------------- fetch ----------------------------------------------------------------------------//

  function energyReportSchedule() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report: report,
        frequency: freq,
        schedule: schedule,
        frequency_num: freqNum,
        schedule_num: scheduleNum,
        recipient_list: selectedRecipients.current,
        rows_list: selectedRows.current,
        time: time,
        day: day,
        date: date,
      }),
    };
    if (freqNum < 1 || freq == null) {
      setFreqOpen(true);
      return;
    }
    if (scheduleNum < 1 || schedule == null) {
      setScheduleOpen(true);
      return;
    }
    if (selectedRecipients.current.length < 1) {
      setRecipientOpen(true);
      return;
    }
    if (selectedRows.current.length < 1) {
      setSelectedRowOpen(true);
      return;
    }
    if (freq == 'monthly' && (date == null || date == "")) {
      setDateOpen(true);
      return;
    }
    if (freq=='weekly' &&(day == null || day == "")) {
      setDayOpen(true);
      return;
    }

    console.log("req", requestOptions);
    console.log("req", requestOptions);
    console.log(props.isModified);

    if (props.isModified) {
      console.log("true")
      const requestOptions2 = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_rows: props.selectedScheduleRows,
        }),
      };
      fetch(`${url}/report/get-schedule/`, requestOptions2)
        .then(fetch(`${url}/report/schedule-report/`, requestOptions))
        .then(history.push("/"));
      alerttoast("Modified Successfully ");
      return;
    }

    fetch(`${url}/report/schedule-report/`, requestOptions)
    .then(history.push("/"));
      alerttoast("Scheduled Successfully ");
      return;
  }

  function historyReportSchedule() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report: report,
        frequency: freq,
        schedule: schedule,
        frequency_num: freqNum,
        schedule_num: scheduleNum,
        recipient_list: selectedRecipients.current,
        rows_list: selectedRows.current,
        time: time,
        day: day,
        date: date,
      }),
    };
    if (freqNum < 1 || freq == null) {
      setFreqOpen(true);
      return;
    }
    if (scheduleNum < 1 || schedule == null) {
      setScheduleOpen(true);
      return;
    }
    if (selectedRecipients.current.length < 1) {
      setRecipientOpen(true);
      return;
    }
    if (selectedRows.current.length < 1) {
      setSelectedRowOpen(true);
      return;
    }
    if (freq == 'monthly' && (date == null || date == "")) {
      setDateOpen(true);
      return;
    }
    if (freq=='weekly' &&(day == null || day == "")) {
      setDayOpen(true);
      return;
    }
    if (props.isModified) {
      console.log("YEsw")
      const requestOptions2 = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_rows: props.selectedScheduleRows,
        }),
      };
      fetch(`${url}/report/get-schedule/`, requestOptions2)
        .then(fetch(`${url}/report/schedule-report/`, requestOptions))
        .then(history.push("/"));
      alerttoast("Modified Successfully ");
      return;
    }

    fetch(`${url}/report/schedule-report/`, requestOptions)
    .then(history.push("/"));
    alerttoast("Scheduled Successfully ");
    return;
  }

  function rawDataReportSchedule() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report: report,
        frequency: freq,
        schedule: schedule,
        frequency_num: freqNum,
        schedule_num: scheduleNum,
        recipient_list: selectedRecipients.current,
        rows_list: selectedRows.current,
        time: time,
        day: day,
        date: date,
      }),
    };
    if (freqNum < 1 || freq == null) {
      setFreqOpen(true);
      return;
    }
    if (scheduleNum < 1 || schedule == null) {
      setScheduleOpen(true);
      return;
    }
    if (selectedRecipients.current.length < 1) {
      setRecipientOpen(true);
      return;
    }
    if (selectedRows.current.length < 1) {
      setSelectedRowOpen(true);
      return;
    }
    if (freq == 'monthly' && (date == null || date == "")) {
      setDateOpen(true);
      return;
    }
    if (freq=='weekly' &&(day == null || day == "")) {
      setDayOpen(true);
      return;
    }

    console.log("req", requestOptions);

    if (props.isModified) {
      const requestOptions2 = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_rows: props.selectedScheduleRows,
        }),
      };
      fetch(`${url}/report/get-schedule/`, requestOptions2)
        .then(fetch(`${url}/report/schedule-report/`, requestOptions))
        .then(history.push("/"));
      alerttoast("Modified Successfully ");
      return;
    }

    fetch(`${url}/report/schedule-report/`, requestOptions)
    .then(history.push("/"));
    alerttoast("Scheduled Successfully ");
      return;
  }

  function getUsers() {
    console.log("hello there");
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${url}/user/getusers/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const recipientList = data.list;

        if (props.highlightedRecipient.length > 0) {
          for (let i = 0; i < props.highlightedRecipient.length; i++) {
            const highlighted_email = props.highlightedRecipient[i]["email"];
            const tableData = props.highlightedRecipient[i]["tableData"];
            for (let j = 0; j < recipientList.length; j++) {
              const recipient_email = recipientList[j]["email"];
              if (highlighted_email == recipient_email) {
                recipientList[j].tableData = tableData;
              }
            }
          }
        }
        // if(props.highlightedRecipient.length >0){
        //   for(let i = 0;i < props.highlightedRecipient.length;i++){
        //     const highlighted_id = props.highlightedRecipient[i].id;

        //     const tableData = props.highlightedRecipient[i].tableData;
        //     console.log("highlight table data",tableData)
        //     for(let j = 0;j< recipientList.length;j++){
        //       const recipient_id = recipientList[j].tableData;
        //       console.log("recipient ID",recipient_id)
        //       if(recipient_id == highlighted_id){
        //         recipientList[j].tableData = tableData;
        //       }
        //     }
        //   }
        // }
        setRecipientRows(recipientList);
      });
  }

  //----------------------------------------------------------------- handle variables ----------------------------------------------------------------------------//
  const handleRowChange = (e) => {
    selectedRows.current = e;
    console.log(selectedRows.current);
  };

  const handleRecipentChange = (e) => {
    selectedRecipients.current = e;
    console.log("recipents", selectedRecipients.current);
  };

  const handleFreqClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFreqOpen(false);
  };

  const handleScheduleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setScheduleOpen(false);
  };
  const handleRecipientClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setRecipientOpen(false);
  };

  const handleSelectedRowClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSelectedRowOpen(false);
  };

  const handleDateClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDateOpen(false);
  };

  const handleDayClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDayOpen(false);
  };

  const frequencyChange = (e) => {
    setFreq(e.target.value);
  };

  const scheduleChange = (e) => {
    setSchedule(e.target.value);
  };

  const handleFreqNumChange = (e) => {
    setFreqNum(e.target.value);
  };
  const handleScheduleNumChange = (e) => {
    setScheduleNum(e.target.value);
  };

  const handlesettime = (e) => {
    setTime(e.target.value);
  };

  const handlesetDay = (e) => {
    setDay(e.target.value);
  };
  const handlesetDate = (e) => {
    setDate(e.target.value);
  };

  const getEnergyDevices = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${url}/report/get-devices/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const devices = [];
        data.list[0].map((item, i) => {
          devices.push({ id: i + 1, code: item });
        });
        if (props.highlightedEnergyRows.length > 0) {
          for (let i = 0; i < props.highlightedEnergyRows.length; i++) {
            const highlighted_id = props.highlightedEnergyRows[i].id;

            const tableData = props.highlightedEnergyRows[i].tableData;
            for (let j = 0; j < devices.length; j++) {
              const device_id = devices[j].id;
              if (device_id == highlighted_id) {
                devices[j].tableData = tableData;
              }
            }
          }
        }

        setEnergyRows(devices);
      });
  };
  const getRawHistoricalDevicesChannels = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${url}/report/get-devices/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const devices = [];
        var count = 1;
        data.list[0].map((item, i) => {
          data.list[1].map((channellist, j) => {
            devices.push({ id: count, Device: item, Channel: channellist });
            count += 1;
          });
        });
        if (props.highlightedRawHistoricalReportRows.length > 0) {
          for (
            let i = 0;
            i < props.highlightedRawHistoricalReportRows.length;
            i++
          ) {
            const highlighted_id =
              props.highlightedRawHistoricalReportRows[i].id;

            const tableData =
              props.highlightedRawHistoricalReportRows[i].tableData;
            for (let j = 0; j < devices.length; j++) {
              const device_id = devices[j].id;
              if (device_id == highlighted_id) {
                devices[j].tableData = tableData;
              }
            }
          }
        }

        setRawHistoricalReportRows(devices);
      });
  };

  useEffect(() => {
    getEnergyDevices();
    getRawHistoricalDevicesChannels();
    getUsers();
    selectedRows.current =
      props.report == "energyReport"
        ? props.highlightedEnergyRows
        : props.highlightedRawHistoricalReportRows;
    selectedRecipients.current = props.highlightedRecipient;
  }, []);

  //-----------------------------------------------------------------components----------------------------------------------------------------------------//
  const Time = () => {
    return (
      <Box sx={{ minWidth: 150 }} style={{ display: "flex" }}>
        <TextField
          id="time"
          type="time"
          variant="outlined"
          value={time}
          onChange={handlesettime}
        />
      </Box>
    );
  };

  const Day = () => {
    const dayarray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <Box sx={{ minWidth: 100 }} style={{ display: "flex" }}>
        <Grid xs={3}>
          <FormControl fullWidth>
            <InputLabel id="dayid">Day</InputLabel>
            <Select
              labelId="dayid"
              id="day"
              defaultValue={null}
              label="Day"
              variant="outlined"
              value={day}
              onChange={handlesetDay}
            >
              {dayarray.map((item, i) => {
                return <MenuItem value={item}>{item}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={4}>
          <TextField
            id="time"
            variant="outlined"
            type="time"
            value={time}
            onChange={handlesettime}
          />
        </Grid>
      </Box>
    );
  };

  const Month = () => {
    var totaldaysinmonth = moment().daysInMonth();

    const montharray = [];
    for (let i = 1; i <= totaldaysinmonth; i++) {
      montharray[i - 1] = i;
    }

    return (
      <Box sx={{ minWidth: 100 }} style={{ display: "flex" }}>
        <Grid xs={3}>
          <FormControl fullWidth>
            <TextField
              labelId="monthid"
              id="month"
              type="date"
              variant="outlined"
              value={date}
              onChange={handlesetDate}
            ></TextField>
          </FormControl>
        </Grid>

        <Grid xs={6}>
          <TextField
            id="time"
            variant="outlined"
            type="time"
            value={time}
            onChange={handlesettime}
          />
        </Grid>
      </Box>
    );
  };

  const ProvideSchedulingInfo = () => {
    switch (freq) {
      case "daily":
        return <Time />;
      case "weekly":
        return <Day />;
      case "monthly":
        return <Month />;
      default:
        return null;
    }
  };

  function Searchgrid(props) {
    const theme = createTheme({
      palette: {
        primary: {
          main: "#1e90ff",
        },
        secondary: {
          main: "#1e90ff",
        },
      },
    });
    return (
      <div
        style={{
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "100%", height: "50%" }}>
          <ThemeProvider theme={theme}>
            <MaterialTable
              title={props.title}
              data={props.rows}
              columns={props.columns}
              options={{
                selection: true,
                headerStyle: {
                  backgroundColor: "#1e90ff",
                  color: "#FFF",
                },
              }}
              onSelectionChange={(e) => {
                props.handleSelectionChange(e);
              }}
            />
          </ThemeProvider>
        </div>
      </div>
    );
  }

  const RawDataReport = () => {
    return (
      <div style={{ marginTop: "1%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Searchgrid
              rows={RawHistoricalReportRows}
              columns={RawHistoricalReportColumns}
              title="Energy Report"
              handleSelectionChange={handleRowChange}
            ></Searchgrid>
          </Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              fullWidth
              variant="contained"
              onClick={rawDataReportSchedule}
            >
              Set Mail
            </Button>
          </Grid>
          <Grid item xs={5}></Grid>
        </Grid>
      </div>
    );
  };
  const HistoryDataReport = () => {
    return (
      <div style={{ marginTop: "1%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Searchgrid
              rows={RawHistoricalReportRows}
              columns={RawHistoricalReportColumns}
              title="Energy Report"
              handleSelectionChange={handleRowChange}
            ></Searchgrid>
          </Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              fullWidth
              variant="contained"
              onClick={historyReportSchedule}
            >
              Set Mail
            </Button>
          </Grid>
          <Grid item xs={5}></Grid>
        </Grid>
      </div>
    );
  };
  const EnergyDataReport = () => {
    return (
      <div style={{ marginTop: "1%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Searchgrid
              rows={energyRows}
              columns={energyColumns}
              title="Energy Report"
              handleSelectionChange={handleRowChange}
            ></Searchgrid>
          </Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              variant="contained"
              onClick={energyReportSchedule}
            >
              Set Mail
            </Button>
          </Grid>
          <Grid item xs={5}></Grid>
        </Grid>
      </div>
    );
  };
  const ProvideReport = () => {
    switch (report) {
      case "rawData":
        return <RawDataReport />;
      case "energyReport":
        return <EnergyDataReport />;
      case "historyReport":
        return <HistoryDataReport />;
      default:
        return null;
    }
  };
  //-----------------------------------------------------------------main component----------------------------------------------------------------------------//
  return (
    <div style={{ backgroundColor: "rgb(6, 58, 92)" }}>
      <Container maxWidth="lg" component="main">
        <Paper elevation={2}>
          <Box
            sx={{
              p: 2,

              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h5" color="primary">
                  {props.isModified ? "Modify a schedule" : "Make a schedule"}
                </Typography>
              </Grid>
              <Grid item>
                <img src={Logo} style={{ height: "40px" }}></img>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: "1%" }}>
              <Grid item xs={1}>
                <Typography variant="h6" style={{ opacity: "0.5" }}>
                  Report Type
                </Typography>
              </Grid>
              <Grid item xs={11}>
                <FormControl>
                  <RadioGroup
                    row
                    name="position"
                    defaultValue={props.report}
                    onChange={(e) => {
                      setReport(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="historyReport"
                      control={<Radio color="primary" />}
                      label="History Report"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="rawData"
                      control={<Radio color="primary" />}
                      label="Raw Data"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="energyReport"
                      control={<Radio color="primary" />}
                      label="Energy Report"
                      labelPlacement="bottom"
                      size="small"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "1%" }}>
              <Grid item container xs={6} spacing={2}>
                <Grid item xs={2}>
                  <Typography
                    variant="h6"
                    style={{ position: "relative", top: "30%", opacity: "0.5" }}
                  >
                    Frequency
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <FormControl>
                    <RadioGroup
                      row
                      name="position"
                      defaultValue={props.freq}
                      onChange={frequencyChange}
                    >
                      <FormControlLabel
                        value="daily"
                        control={<Radio color="primary" />}
                        label="Daily"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value="weekly"
                        control={<Radio color="primary" />}
                        label="Weekly"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value="monthly"
                        control={<Radio color="primary" />}
                        label="Monthly"
                        labelPlacement="bottom"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  {freq != "daily" ? (
                    <Tooltip title={textfreq}>
                      <TextField
                        type="number"
                        variant="outlined"
                        label="Every"
                        style={{ position: "relative", top: "10%" }}
                        value={freqNum}
                        onChange={handleFreqNumChange}
                      ></TextField>
                    </Tooltip>
                  ) : null}
                </Grid>
              </Grid>
              <Grid item container xs={6} spacing={2}>
                <Grid item xs={2}>
                  <Typography
                    variant="h6"
                    style={{ position: "relative", top: "30%", opacity: "0.5" }}
                  >
                    Duration
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <FormControl>
                    <RadioGroup
                      row
                      name="position"
                      defaultValue={props.schedule}
                      onChange={scheduleChange}
                    >
                      <FormControlLabel
                        value="day"
                        control={<Radio color="primary" />}
                        label="Day"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value="week"
                        control={<Radio color="primary" />}
                        label="Week"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        value="month"
                        control={<Radio color="primary" />}
                        label="Month"
                        labelPlacement="bottom"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  {schedule != "day" ? (
                    <Tooltip title={textSchedule}>
                      <TextField
                        type="number"
                        variant="outlined"
                        label="Last"
                        value={scheduleNum}
                        style={{ position: "relative", top: "10%" }}
                        onChange={handleScheduleNumChange}
                      ></TextField>
                    </Tooltip>
                  ) : null}
                </Grid>
              </Grid>
              <Grid item xs={1}>
                {freq != null ? (
                  <Typography
                    variant="h6"
                    style={{ position: "relative", top: "30%", opacity: "0.5" }}
                  >
                    Send at
                  </Typography>
                ) : null}
              </Grid>
              <Grid item xs={5}>
                <ProvideSchedulingInfo />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={1} />
              <Grid item xs={9}>
                <Searchgrid
                  title="Send mail to"
                  rows={recipientRows}
                  columns={recipientCols}
                  handleSelectionChange={handleRecipentChange}
                ></Searchgrid>
              </Grid>
            </Grid>
            <ProvideReport />
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={freqOpen}
        autoHideDuration={5000}
        onClose={handleFreqClose}
      >
        <Alert onClose={handleFreqClose} severity="error">
          Set proper frequency
        </Alert>
      </Snackbar>
      <Snackbar
        open={scheduleOpen}
        autoHideDuration={5000}
        onClose={handleScheduleClose}
      >
        <Alert onClose={handleScheduleClose} severity="error">
          Set proper Duration
        </Alert>
      </Snackbar>
      <Snackbar
        open={recipientOpen}
        autoHideDuration={5000}
        onClose={handleRecipientClose}
      >
        <Alert onClose={handleRecipientClose} severity="error">
          Select atleast one user
        </Alert>
      </Snackbar>
      <Snackbar
        open={selectedRowOpen}
        autoHideDuration={5000}
        onClose={handleSelectedRowClose}
      >
        <Alert onClose={handleSelectedRowClose} severity="error">
          Select atleast one Device or Channel
        </Alert>
      </Snackbar>
      <Snackbar open={dayOpen} autoHideDuration={5000} onClose={handleDayClose}>
        <Alert onClose={handleDayClose} severity="error">
          Select A day
        </Alert>
      </Snackbar>
      <Snackbar
        open={dateOpen}
        autoHideDuration={5000}
        onClose={handleDateClose}
      >
        <Alert onClose={handleDateClose} severity="error">
          Select a date
        </Alert>
      </Snackbar>
    </div>
  );
}
export default ScheduleReport;
