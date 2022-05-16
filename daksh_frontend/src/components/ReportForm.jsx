import React, { Component, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Button,
  Box,
  Typography,
  FormControlLabel,
  FormLabel,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  TextField,
  Grid,
  RadioGroup,
  Radio,
  Stack,
  Paper,
  OutlinedInput,
  Checkbox
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../Images/Daksh-Logo.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));
function ReportForm() {
  const [form, setForm] = React.useState([]);
  const classes = useStyles();

  const handleFormChange = (event) => {
    const {
      target: { value }
    } = event;
    setForm(value);
    console.log(value);
  };
  const [startvalue, setStartValue] = useState("");
  const [endvalue, setEndValue] = useState("");

  function handleSubmit() {}

  const reportList = [{ id: 1, label: "EM1", value: 10 },{ id: 2, label: "EM2", value: 20 },{ id: 3, label: "EM3", value: 30 }]

  return (
    <div style={{backgroundColor:"white"}}>
     
        <Box
          sx={{
            p: 4,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          
        >
          <form onSubmit={handleSubmit} noValidate >
            <Grid container spacing={2}>
              <Grid item xs={6} align="left"></Grid>
              <Grid item xs={2} />
              <Grid item xs={4}></Grid>
            </Grid>{" "}
            <Box
              sx={{
                height: 30,
              }}
              
            />
            <Grid container spacing={6}>
              <Grid item xs={8} >
                <Typography variant="h4" color="primary" align="center">
                  Create A report
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <img src={logo} style={{ height: "40px" }}></img>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel variant="outlined" id="demo-simple-select-label">
                    Report
                  </InputLabel>
                  <Select
                    variant="outlined"
                    multiple
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={form}
                    input={<OutlinedInput label="Tag" />}
                    label="Age"
                    onChange={handleFormChange}
                  >
                    {reportList.map((item)=><MenuItem value={item.value} key={item.id}>{item.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="date"
                  label="Start Date"
                  type="date"
                  defaultValue="2022-02-04"
                  onChange={(e) => {
                    setStartValue(e.target.value);
                  }}
                  //className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="date2"
                  label="End Date"
                  type="date"
                  defaultValue="2022-02-04"
                  //className={classes.textField}
                  onChange={(e) => {
                    setEndValue(e.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>
                    <Typography variant="h6">Download Type</Typography>
                  </FormLabel>
                  <RadioGroup defaultValue="csv" name="radio-buttons-group">
                    <FormControlLabel
                      value="csv"
                      control={<Radio />}
                      label="csv"
                    />
                    <FormControlLabel
                      value="pdf"
                      control={<Radio />}
                      label="pdf"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" fullWidth variant="contained">
                  Get Report
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
    
    </div>
  );
}

export default ReportForm;
