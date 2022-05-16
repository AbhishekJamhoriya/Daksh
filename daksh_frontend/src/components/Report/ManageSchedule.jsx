import React, { Component, useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Button,
  Typography,
  ThemeProvider,
  createTheme,
  Snackbar
} from "@material-ui/core";
import Logo from "../../Images/Daksh-Logo.png";
import MaterialTable from "material-table";
import { backendUrl } from "../../actions/backendUrl";
import { useHistory } from "react-router-dom";
import ScheduleReport from "./ScheduleReport";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function ManageSchedule() {
  const [scheduleRows, setScheduleRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const history = useHistory();
  const [showMain, setShowMain] = useState(true);
  const [isModified, setIsmodified] = useState(false);

  const [report, setReport] = useState("energyReport");
  const [freq, setFreq] = useState("daily");
  const [schedule, setSchedule] = useState("day");
  const [highlightedEnergyRows, setHighlightedEnergyRows] = useState([]);
  const [
    highlightedRawHistoricalReportRows,
    setHighlightedRawHistoricalReportRows,
  ] = useState([]);
  const [highlightedRecipients, setHighlightedRecipients] = useState([]);
  const [freqNum, setFreqNum] = useState(1);
  const [scheduleNum, setScheduleNum] = useState(1);
  const [time, setTime] = useState("12:00");
  const [day, setDay] = useState("");
  const [date, setDate] = useState();
  const [scheduleId, setScheduleId] = useState("");

  const [deleteOpen,setDeleteOpen] = useState(false);
  const [modifyOpen,setModifyOpen] = useState(false);


  // const scheduleRows = [{id:"Hello",reportType:"History",schedulingDate:new Date(),frequency:"daily",duration:"2 days"},
  // {id:"Hello",reportType:"History",schedulingDate:new Date(),frequency:"daily",duration:"2 days"}]

  const url = backendUrl;
  const scheduleColumns = [
    { title: "Report Type", field: "reportType" },
    { title: "Schdeuled on", field: "schedulingDate", type: "date" },
    { title: "Frequency", field: "frequency" },
    { title: "Duration", field: "duration" },
  ];

  const handleRowLoading = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${url}/report/get-schedule/`, requestOptions)
      .then((response) => response.json())
      .then((body) => {
        setScheduleRows(body.list);
      });
  };

  const handleDeleteSchedules = () => {
    if(selectedRows.length <1){
      setDeleteOpen(true);
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selected_rows: selectedRows,
      }),
    };
    fetch(`${url}/report/get-schedule/`, requestOptions).then(
      history.push("/")
    );
  };

  const handleRowModification = () => {
    if (selectedRows.length < 1) {
      const freq = "daily";
      const freqNum = 1;
      const schedule = "day";
      const scheduleNum = 1;
      const reportType = "energyReport";
      const day = "";
      const time = "12:00";
      const date = "";
      const highlightedRecipient = [];
      const hilightedSelectedRows = [];

      setFreq(freq);
      setFreqNum(freqNum);
      setSchedule(schedule);
      setScheduleNum(scheduleNum);
      setReport(reportType);
      setDate(date);
      setTime(time);
      setDay(day);
      setHighlightedEnergyRows(hilightedSelectedRows);
      setHighlightedRawHistoricalReportRows(highlightedSelectedRows);
      setHighlightedRecipients(highlightedRecipient);
      return;
    }
    const modif_data = selectedRows[0];
    var reportType = "";
    const prettyReportType = modif_data["reportType"];
    if (prettyReportType === "Raw Report") {
      reportType = "rawData";
    }
    if (prettyReportType === "Energy Report") {
      reportType = "energyReport";
    }
    if (prettyReportType === "Historical Data Model") {
      reportType = "historyReport";
    }
    const prettyFrequency = modif_data["frequency"];
    var freq = "";
    var freqNum = 1;
    if (prettyFrequency == "daily") {
      freq = "daily";
      freqNum = 1;
    } else {
      const freqArr = prettyFrequency.split(" ");
      freqNum = parseInt(freqArr[1]);

      const freqFormat = freqArr[2];

      if (freqFormat == "month" || freqFormat == "months") {
        freq = "monthly";
      } else if (freqFormat == "week" || freqFormat == "weeks") {
        freq = "weekly";
      }
    }

    const prettySchedule = modif_data["duration"];
    const scheduleArr = prettySchedule.split(" ");
    const scheduleNum = parseInt(scheduleArr[0]);
    const scheduleFormat = scheduleArr[1];
    var schedule = "";
    if (scheduleFormat === "day") {
      schedule = "day";
    } else if (scheduleFormat == "month" || scheduleFormat == "months") {
      schedule = "month";
    } else if (scheduleFormat == "week" || scheduleFormat == "weeks") {
      schedule = "week";
    }

    const day = modif_data["day"];
    const date = modif_data["date"];
    const time = modif_data["time"].slice(0, 5);
    const highlightedRecipient = modif_data["recipient"];
    const highlightedSelectedRows = modif_data["selected_rows"];
    const scheduleId = modif_data["id"];

    setFreq(freq);
    setFreqNum(freqNum);
    setSchedule(schedule);
    setScheduleNum(scheduleNum);
    setReport(reportType);
    setDate(date);
    setTime(time);
    setDay(day);
    setHighlightedEnergyRows(highlightedSelectedRows);
    setHighlightedRawHistoricalReportRows(highlightedSelectedRows);
    setHighlightedRecipients(highlightedRecipient);
    setScheduleId(scheduleId);
    console.log(highlightedEnergyRows);
  };

  const handleModifyButtonClick = () => {
    if(selectedRows.length !=1){
      setModifyOpen(true);
      return;
    }
    handleRowModification();
    setIsmodified(true);
    setShowMain(false);
  };
  const handleNewButtonClick = () => {
    setIsmodified(false);
    setShowMain(false);
  };

  const closeDeleteOpen=(event, reason)=>{
    if (reason === "clickaway") {
      return;
    }

    setDeleteOpen(false);

  }
  const closeModifyOpen=(event, reason)=>{
    if (reason === "clickaway") {
      return;
    }

    setModifyOpen(false);


  }

  useEffect(() => {
    handleRowLoading();
  }, []);

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

  if (showMain) {
    return (
<ThemeProvider theme={theme}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center",height:"94vh",backgroundColor:"rgb(6,58,92)"}}>
        <Container maxWidth="md" component="main" style={{backgroundColor:"white"}}>
          <Box
            sx={{
              p: 2,
            
              alignItems: "space-between",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Typography variant="h5" color="primary">
                  Manage Schedules
                </Typography>
              </Grid>
              <Grid item>
                <img src={Logo} style={{ height: "40px" }}></img>
              </Grid>
            </Grid>

            <Box sx={{ py: 2 }}>
              <MaterialTable
                title="Delete Schedules"
                data={scheduleRows}
                columns={scheduleColumns}
                options={{
                  selection: true,
                  headerStyle: {
                    backgroundColor: "#1e90ff",
                    color: "#FFF",
                  },
                }}
                onSelectionChange={(e) => {
                  setSelectedRows(e);
                }}
              />
            </Box>
            <Box
              sx={{
                py: 2,
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Button color="warning" onClick={handleDeleteSchedules}>
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="primary" onClick={handleNewButtonClick}>
                    New Schedule
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="primary" onClick={handleModifyButtonClick}>
                    Modify
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>{" "}
        <Snackbar
        open={deleteOpen}
        autoHideDuration={5000}
        onClose={closeDeleteOpen}
      >
        <Alert onClose={closeDeleteOpen} severity="error">
          Select atleast one row for deleting
        </Alert>
      </Snackbar>
      <Snackbar
        open={modifyOpen}
        autoHideDuration={5000}
        onClose={closeModifyOpen}
      >
        <Alert onClose={closeModifyOpen} severity="error">
          You can modify exacly one row at a time
        </Alert>
      </Snackbar>

      </div>
      </ThemeProvider>
    );
  }
  return (
    <ScheduleReport
      report={report}
      freq={freq}
      schedule={schedule}
      freqNum={freqNum}
      scheduleNum={scheduleNum}
      day={day}
      date={date}
      time={time}
      highlightedRecipient={highlightedRecipients}
      highlightedEnergyRows={highlightedEnergyRows}
      highlightedRawHistoricalReportRows={highlightedRawHistoricalReportRows}
      isModified={isModified}
      scheduleId={scheduleId}
      selectedScheduleRows = {selectedRows}
      
    />
  );
}

export default ManageSchedule;
