import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Alert_date from "./Alert_date";

// =====================================================

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

let setSaveResolutions = {};

function Alarm_History() {
  //==================================================================================
  const [DateData, setDateData] = useState([]);
  const [ChangeData, setChangeData] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEquipments, setSelectedEquipments] = useState("");
  const [selectedEvents, setSelectedEvents] = useState("");
  const [status, setStatus] = useState(null);

  const [From, setFrom] = useState(new Date());
  const [To, setTo] = useState(new Date());

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //===========================================================================

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DateData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ======================gettime function for selction dates from Calender =====================
  const gettime = async () => {
    let startDate = new Date(document.getElementById("Date1").value);
    let endDate = new Date(document.getElementById("Date2").value);

    const url = `http://127.0.0.1:8080/alarm-history-data`;
    let postgreData = await fetch(url);
    let parsedData = await postgreData.json();
    let data = parsedData["result"];
    let Filter_Date_Time = data.filter(
      (e) =>
        startDate <= new Date(e.Date_time) && new Date(e.Date_time) <= endDate
    );
    setDateData(Filter_Date_Time); // DateData
    setChangeData(Filter_Date_Time); // ChangeData
  };

  //============================ get unique objects =========================================
  const getUniqueDate = (arr, comp) => {
    let uniqueArray = arr
      .map((e) => e[comp])
      .map((e) => e.split(" ")[0])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return uniqueArray;
  };
  const getUniqueEquip = (arr, comp) => {
    let uniqueArray = arr
      .map((e) => e[comp])
      // .map((e) => e.split(" ")[0])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return uniqueArray;
  };

  //================= They are used in drop down menu ==================
  let uniqueDates = getUniqueDate(ChangeData, "Date_time");
  let uniqueEquipments = getUniqueEquip(ChangeData, "Equipment");
  let uniqueEvents = getUniqueEquip(ChangeData, "Event");

  //======================== Data after selecting Date from drop down menu =========================

  const onChangeDate = (e) => {
    setSelectedDate(e.target.value);
    if ( e.target.value === "All" || e.target.value === "") {
      setDateData(ChangeData);
    } else {
      let filterDropdownData = ChangeData.filter(function (ev) {
        return ev.Date_time.split(" ")[0] === e.target.value.split(" ")[0];
      });
      setDateData(filterDropdownData);
    }
  };
  //======================== Data after selection Equipment from drop down menu =========================
  const onChangeEquipment = (e) => {
//     setSelectedEquipments(e.target.value);
    var filterDropdownData;
    if (selectedDate === "All" ||selectedDate ==="" ) {
      filterDropdownData = ChangeData;
    } else {
      filterDropdownData = ChangeData.filter(function (ev) {
        return ev.Date_time.split(" ")[0] === selectedDate.split(" ")[0];
      });
    }
    if (e.target.value === "All" || e.target.value==="") {
      setDateData(filterDropdownData);
    } else {
      let filterDropdownData1 = filterDropdownData.filter(function (ev) {
        return ev.Equipment === e.target.value;
      });
      setDateData(filterDropdownData1);
    }
  };

  //======================== Data after selection Events from drop down menu =========================
  const onChangeEvents = (e) => {
//     setSelectedEvents(e.target.value);

    var filterDropdownData;
    if (selectedDate === "All" || selectedDate === "") {
      filterDropdownData = ChangeData;
    } else {
      filterDropdownData = ChangeData.filter(function (ev) {
        return ev.Date_time.split(" ")[0] === selectedDate.split(" ")[0];
      });
    }
    
    var filterDropdownData1;
    if (selectedEquipments === "All" || selectedEquipments === "") {
      filterDropdownData1 = filterDropdownData;
    } 
    else {
      filterDropdownData1 = filterDropdownData.filter(function (ev) {
        return ev.Equipment === selectedEquipments;
      });
    }
    if (e.target.value === "All" || e.target.value ==="") {
      let filterDropdownData3 = filterDropdownData1;
      setDateData(filterDropdownData3);
    } else {
      let filterDropdownData3 = filterDropdownData1.filter(function (ev) {
        return ev.Event === e.target.value;
      });
      setDateData(filterDropdownData3);
    }
  };

  const handleResolutionChange = (e) => {
    setSaveResolutions[e.target.id] = e.target.value;
  };

  const handleOnSubmit = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(setSaveResolutions),
    };
    const response1 = await fetch(
      "http://127.0.0.1:5050/alarm-resolution",
      requestOptions
    );
    console.log(response1)
    if (response1) {
      setStatus(response1);
      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }
  };

  useEffect(() => {
    gettime();
  }, [From, To]);

  return (
    <>
      <div className="my-4">
        <div className="d-flex justify-content-md-around align-content-center">
          <div>
            <Button
              variant="outlined"
              sx={{
                color: "Blue",
                backgroundColor: "#D1EBFF",
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              }}
              onClick={handleOnSubmit}
            >
              {" "}
              &nbsp;Save&nbsp;
            </Button>
            {status ? (
              <Alert_date
                severity="success"
                value="Data is saved in Postgresql"
              />
            ) : null}
          </div>
          <div>
            <h3 className="text-center  text-primary"> ALARM HISTORY</h3>
          </div>
          <div>
            <div className="">
              <TextField
                id="Date1"
                name="From"
                size="small"
                label="From Date"
                type="datetime-local"
                value={From}
                variant="outlined"
                onChange={(e) => setFrom(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="Date2"
                name="To"
                size="small"
                label="End Date"
                type="datetime-local"
                value={To}
                variant="outlined"
                onChange={(e) => setTo(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="custom pagination table">
            {/* ============ Table Head ================= */}
            <TableHead>
              <TableRow sx={{ backgroundColor: " #007FFF" }}>
                {/*=============== Selction for Date/Time ===================*/}

                <TableCell>
                  <Typography
                    variant="button"
                    style={{ color: "white", fontWeight: 700, fontSize: 15 }}
                    gutterBottom
                  >
                    Date/Time &nbsp;
                  </Typography>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedDate}
                    label="Date/Time"
                    onChange={onChangeDate}
                    style={{
                      height: 30,
                      color: "white",
                      border: "1px solid white",
                    }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {uniqueDates.map((e) => (
                      <MenuItem value={e.Date_time} key={e.id}>
                        {e.Date_time.split(" ")[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/*=============== Selction for Equipments ===================*/}
                <TableCell>
                  <Typography
                    variant="button"
                    style={{ color: "white", fontWeight: 700, fontSize: 15 }}
                    gutterBottom
                  >
                    Equipments &nbsp;
                  </Typography>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedEquipments}
                    label="Date/Time"
                    onChange={onChangeEquipment}
                    style={{
                      height: 30,
                      color: "white",
                      border: "1px solid white",
                    }}
                  >
                    {" "}
                    <MenuItem value="All">All</MenuItem>
                    {uniqueEquipments.map((e) => (
                      <MenuItem value={e.Equipment} key={e.id}>
                        {e.Equipment}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/*=============== Selction for Events ===================*/}
                <TableCell>
                  <Typography
                    variant="button"
                    style={{ color: "white", fontWeight: 700, fontSize: 15 }}
                    gutterBottom
                  >
                    Event &nbsp;
                  </Typography>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedEvents}
                    label="Events"
                    onChange={onChangeEvents}
                    style={{
                      height: 30,
                      color: "white",
                      border: "1px solid white",
                    }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {uniqueEvents.map((e) => (
                      <MenuItem value={e.Event} key={e.id}>
                        {e.Event}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                {/*=============== Fix Input For Resolution ===================*/}
                <TableCell
                  style={{ color: "white", fontWeight: 700, fontSize: 15 }}
                >
                  RESOLUTION&nbsp;
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ============ Table Body ================= */}
            <TableBody>
              {(rowsPerPage > 0
                ? DateData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : DateData
              ).map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.Date_time}
                  </TableCell>
                  <TableCell>{row.Equipment}</TableCell>
                  <TableCell>{row.Event}</TableCell>
                  <TableCell>
                    <TextField
                      style={{ width: "100%" }}
                      id={row.id.toString()}
                      name={row.id.toString()}
                      onChange={handleResolutionChange}
                      defaultValue={row.Resolution}
                      variant="standard"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            {/* ============ Table Footer ================= */}
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={DateData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
export default Alarm_History;
