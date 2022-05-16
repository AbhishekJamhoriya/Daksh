export default Report;
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
  createTheme,
  ThemeProvider,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import Logo from "../../Images/Daksh-Logo.png";
import MaterialTable from "material-table";
import { backendUrl } from "../../actions/backendUrl";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
// import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
toast.configure();
const alerttoast = (name) => {
  toast.error(name);
};





function Report() {
  const [report, setReport] = useState("energyReport");
  const startDate = useRef("");
  const endDate = useRef("");
  const startTime = useRef("");
  const endTime = useRef(" ");
  const selectedRows = useRef([]);
  const preselectedenergyrows=useRef([]);
  const preselectedrawhistoryrows=useRef([]);
  const selectestartddate=useRef("")
  const selectedenddate=useRef("")
  const [energyRows,setEnergyRows]=useState([]);
  const [ProgressbarState,setProgressbarState]=useState(false);
  const [RawHistoricalReportRows,setRawHistoricalReportRows]=useState([]);
  const url = backendUrl;
  
  const downloadUrl = "E:/avl project/Daksh/daksh_backend/report/excel_reports/";
  //This is the function to get the rows of the enrgy report from the backend on each rendering
  // the item being sent is a python list so first convert it to js array using json.dumps or something before using this request

  
  const energyColumns = [
    { title: "ID", field: "id", headerName: "ID", width: 90 },
    { title: "Code", field: "code" },
  ];

    const RawHistoricalReportColumns=[
      { title: "ID", field: "id", headerName: "ID", width: 90 },
    { title: "DEVICE", field: "Device" },
    { title: "CHANNEL", field: "Channel" },
    ]
  
  const getEnergyDevices=()=>{
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${url}/report/get-devices/`,requestOptions)
      .then((response) => response.json())
      .then((data) => {
        
        const devices=[]
        data.list[1].map((item,i)=>{
          devices.push({id:i+1,code:item})
          
        })
        console.log("List Devices",devices);
        setEnergyRows(devices);
      
      });
  }
  const getRawHistoricalDevicesChannels=()=>{
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${url}/report/get-devices/`,requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const devices=[]
        var count=1;
        data.list[0].map((item,i)=>{
          data.list[1].map((channellist,j)=>{
            devices.push({id:count,Device:item,Channel:channellist})
            count+=1;
          })
          
          
        })
        setRawHistoricalReportRows(devices);
      });
  }



  useEffect(() => {
    getEnergyDevices()
    getRawHistoricalDevicesChannels()
    
  },[]);



  let finalSelectedRows = [];

  //this is the function to get enrgyreport
  //here to check if the js array of selected rows sent is being recived properly on the python end.

   const getEnergyReport=()=>{
     console.log("selectedRow",selectestartddate )
    if(selectedRows.current.length==0){
      alerttoast("Please select atleast one channel to generate a report");
    }
    else if(selectestartddate.current=="" || selectedenddate.current==""){
      if(selectedenddate.current!=""){
        alerttoast("Start Date not selected");
      }
      else if(selectestartddate.current!=""){
        alerttoast("End Date not selected");
      }
      else{
        alerttoast("Date not selected");
      }
    }
    else{
      setProgressbarState(true)
      selectedRows.current.forEach((row) => finalSelectedRows.push(row.code));

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report: report,
          start_date: startDate.current,
          end_date: endDate.current,
          start_time:startTime.current,
          end_time:endTime.current,
          selected_rows: selectedRows.current,
        }),
      };
      console.log(requestOptions);
  
      // console.log(finalSelectedRows);
  
      fetch(`${url}/report/getreport/`, requestOptions).then(function(response) {
        //here beings the downloading part of the frontend
        return response.blob();
      }).then(function(blob) {
      saveAs(blob, 'Energy Report.xlsx');
      setProgressbarState(false)
      })  
    }
    
  }
  const getRawDataReport=()=>{
    if(selectedRows.current.length===0){
      alerttoast("Please select atleast one channel to generate a report");
    }
    else if(selectestartddate.current=="" || selectedenddate.current==""){
      if(selectedenddate.current!=""){
        alerttoast("Start Date not selected");
      }
      else if(selectestartddate.current!=""){
        alerttoast("End Date not selected");
      }
      else{
        alerttoast("Date not selected");
      }
    }
    else{
      setProgressbarState(true)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report : report,
        start_date: startDate.current,
        end_date: endDate.current,
        start_time:startTime.current,
        end_time:endTime.current,
        selected_rows: selectedRows.current,
      }),
    };
    console.log(requestOptions);

    // console.log(finalSelectedRows);

    fetch(`${url}/report/getreport/`, requestOptions).then(function(response) {
      //here beings the downloading part of the frontend
      return response.blob();
    }).then(function(blob) {
    saveAs(blob, ' Raw_Data_Report.csv');
    setProgressbarState(false)
    })  }
  }
  const getHistoricalDataReport=()=>{
    if(selectedRows.current.length===0){
      alerttoast("Please select atleast one channel to generate a report");
    }
    else if(selectestartddate.current=="" || selectedenddate.current==""){
      if(selectedenddate.current!=""){
        alerttoast("Start Date not selected");
      }
      else if(selectestartddate.current!=""){
        alerttoast("End Date not selected");
      }
      else{
        alerttoast("Date not selected");
      }
    }
    else{
      setProgressbarState(true)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        report : report,
        start_date: startDate.current,
        end_date: endDate.current,
        start_time:startTime.current,
        end_time:endTime.current,
        selected_rows: selectedRows.current,
      }),
    };
    console.log(requestOptions);

    // console.log(finalSelectedRows);

    fetch(`${url}/report/getreport/`, requestOptions).then(function(response) {
      //here beings the downloading part of the frontend
      return response.blob();
    }).then(function(blob) {
    saveAs(blob, 'Historical Report.pdf');
    setProgressbarState(false)
    }) 
    
  } 

  }


  function handleStartDateChange(e) {
  
    startDate.current = e.target.value.split("T")[0];
    startTime.current = e.target.value.split("T")[1];
    selectestartddate.current=e.target.value
   
    
  }
  function handleEndDateChange(e) {
    
    endDate.current = e.target.value.split("T")[0];
    endTime.current = e.target.value.split("T")[1];
    selectedenddate.current=e.target.value
  }

  function Searchgrid(props) {
    
    if(props.title=="Energy Data"){
      selectedRows.current=preselectedenergyrows.current;
    }
    else{
      selectedRows.current=preselectedrawhistoryrows.current;
    }

    function handleSelectedDevices(e) {
      selectedRows.current = e;
      if(props.title=="Energy Data"){
        preselectedenergyrows.current=e;
      }
      else{
        preselectedrawhistoryrows.current=e;
      }
      
    }
    console.log(props.title, selectedRows.current);

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
        <div style={{ width: "100%" }}>
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
              onSelectionChange={handleSelectedDevices}
           
            />
          </ThemeProvider>
        </div>
      </div>
    );
  }

const ProgressBar=()=>{
    return(
      <Dialog
      open={ProgressbarState}
      aria-labelledby="simple-dialog-title"
   

      
      >
         <DialogTitle id="simple-dialog-title">Generating the report</DialogTitle>
        <DialogContent   style={{paddingLeft:"40%"}}>
        <CircularProgress /> 
     
        </DialogContent>
      </Dialog>
    )
  }
  

  const RawDataReport = () => {
    
    return (
      <div>
         <ProgressBar/>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Searchgrid  title="Raw Data" columns={RawHistoricalReportColumns} rows={RawHistoricalReportRows}/>
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="date"
              label="Start Date"
              type="datetime-local"
              defaultValue={selectestartddate.current}
              onChange={handleStartDateChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="date2"
              label="End Date"
              type="datetime-local"
              defaultValue={selectedenddate.current}
              variant="outlined"
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              // id="date2"
              label="Report Type"
              // type="date"
              defaultValue="CSV"
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12}></Grid>

          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#1e90ff", color: "whitesmoke" }}
              onClick={getRawDataReport}
            >
              Get Report
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  };
  const HistoryDataReport = () => {
    
    return (
      <div>
        <ProgressBar/>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Searchgrid title="History Statistics" columns={RawHistoricalReportColumns} rows={RawHistoricalReportRows} />
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="date"
              label="Start Date"
              type="datetime-local"
              defaultValue={selectestartddate.current}
              variant="outlined"
              onChange={handleStartDateChange}
              //className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="date2"
              label="End Date"
              type="datetime-local"
              defaultValue={selectedenddate.current}
              variant="outlined"
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              // id="date2"
              label="Report Type"
              // type="date"
              defaultValue="PDF"
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#1e90ff", color: "whitesmoke" }}
              onClick={getHistoricalDataReport}
            >
              Get Report
            </Button>
            
          </Grid>
          
        </Grid>
      </div>
    );
  };
  const EnergyDataReport = () => {
    return (
      <div >
         <ProgressBar/>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Searchgrid
              title="Energy Data"
              rows={energyRows}
             columns={energyColumns}
            />
          </Grid>

          <Grid item xs={5}>
            <TextField
              id="date"
              label="Start Date"
              type="datetime-local"
              defaultValue={selectestartddate.current}
              variant="outlined"
              onChange={handleStartDateChange}
              //className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="date2"
              label="End Date"
              type="datetime-local"
              defaultValue={selectedenddate.current}
              variant="outlined"
              //className={classes.textField}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              // id="date2"
              label="Report Type"
              // type="date"
              defaultValue="EXCEL"
              variant="outlined"
              disabled
            />
          </Grid>

          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              style={{backgroundColor: "#1e90ff", color: "whitesmoke" }}
              onClick={getEnergyReport}
            >
              Get Report
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  };
  const ProvideReport = () => {
  
   
    switch (report) {
      case "rawData":
        return <RawDataReport  />;
      case "energyReport":
        return <EnergyDataReport/>;
      case "historyReport":
        return <HistoryDataReport />;
      default:
        return null;
    }
  };

  return (
    <div style={{backgroundColor:"rgb(6, 58, 92)",height: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Container maxWidth="md" component="main">
      <Paper elevation={2}>
        <Box
          sx={{
            px: 2,
            py:1,
            mx: 2,
            mb:2,
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
                Generate report
              </Typography>
            </Grid>
            <Grid item>
              <img src={Logo} style={{ height: "35px" }}></img>
            </Grid>
          </Grid>
          <Grid container >
            <Grid item xs={2}><Typography variant="h6" style={{opacity: "0.5", margin: "15px"}}>Report Type</Typography></Grid>
            <FormControl>
              <RadioGroup
                row
                name="position"
                defaultValue="energyReport"
                onChange={(e) => {
                  setReport(e.target.value);
                }}
              >
                <FormControlLabel
                  value="historyReport"
                  control={<Radio color="primary" />}
                  label="Historical Report"
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
            </FormControl></Grid>
            <ProvideReport />
          
        </Box>
      </Paper>
    </Container>
    </div>
  );
}
