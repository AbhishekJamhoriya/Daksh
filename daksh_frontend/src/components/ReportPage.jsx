import React, { Component } from "react";
import ReportForm from "./ReportForm";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Grid,
  Container,
  Typography,
  Box,
  Button,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import { blue, purple } from "@material-ui/core/colors";
import { Row, Col } from "react-bootstrap";
function ReportPage() {
  return (
    // <div className="reportPage">
    //   <Row className="row">
    //     <Col md={4} sm={12} className="formside">
    //       <ReportForm></ReportForm>
    //     </Col>
    //     <Col md={8} sm={12}>
    //       <Container maxWidth="md">
    //         <Box
    //           sm={{
    //               p:2,
    //             marginTop: 8,
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "left",
    //           }}
    //         >
    //           <Grid container spacing={4}>
    //             <Grid item md={12}>
    //               <Typography variant="h3">Preview</Typography>
    //             </Grid>

    //             <Grid item md={12}>
    //               <Box sx={{ bgcolor: "#cfe8fc", height: "500px" }} />
    //             </Grid>
    //             <Grid item md={4}></Grid>
    //             <Grid item md={2}>
    //               <Button variant="contained"
    //               color="primary">
    //                 <Typography >Download</Typography>
    //               </Button>
    //             </Grid>
    //             <Grid item md={2}>
    //               <Button variant="contained" color="primary">
    //                 <Typography >Mail</Typography>
    //               </Button>
    //             </Grid>
    //           </Grid>
    //         </Box>
    //       </Container>
    //     </Col>
    //   </Row>
    // </div>
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: blue,
          secondary: purple,
        },
      })}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ height:"90vh",backgroundColor:"#001f29" }}
      >
        <Grid item xs={4} >
          <ReportForm />
  
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default ReportPage;
