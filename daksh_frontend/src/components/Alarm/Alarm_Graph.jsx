
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import BarChart from "./Charts/BarChart";
import PieChart from "./Charts/PieChart";
import Alert_date from "./Alert_date";

import * as moment from "moment";

// import { getTime } from "date-fns";

const Alarm_Graph = () => {
  const [pieData1, setpieData1] = useState({ label: [], value: [] });
  const [pieData2, setpieData2] = useState({ label: [], value: [] });
  const [barData, setbarData] = useState({ label: [], value: [] });

  const [TopAlarm, setTopAlarm] = useState(5);
  const [TopEquipment, setTopEquipment] = useState(5);

  // const [From, setFrom] = useState(new Date("2022-02-04T16:40:00"));
  // const [To, setTo] = useState(new Date("2022-02-04T16:40:00"));

  const [Dates, setDates] = useState({
    From: new Date("2022-02-04T16:40:00"),
    To: new Date("2022-02-04T16:40:00"),
  });

  const handleChange = (e) => {
    let value = e.target.value;
    setDates({ ...Dates, [e.target.name]: value });
    // getTime();
  };

  const gettime = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_date: moment(Dates.From).format("YYYY-MM-DD HH:mm"),
        end_date: moment(Dates.To).format("YYYY-MM-DD HH:mm"),
      }),
    };
    const requestOptions1 = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: moment(Dates.From).format("YYYY-MM-DD"),
        end: moment(Dates.To).format("YYYY-MM-DD"),
      }),
    };
    const response1 = await fetch(
      "http://127.0.0.1:5000/top-alarm-equipments",
      requestOptions
    );
    const response2 = await fetch(
      "http://127.0.0.1:5000/top-frequent-alarms",
      requestOptions
    );
    const response3 = await fetch(
      "http://127.0.0.1:5000/alarm-frequency",
      requestOptions1
    );

    const data1 = await response1.json();
    const data2 = await response2.json();
    const data3 = await response3.json();
 
    // console.log(data1)
    // console.log(data2)
    // console.log(data3)
    
    var pie1_values = data1.result.map((e) => e.id);
    var pie1_label = data1.result.map((e) => e.tag);

    var pie2_values = data2.result.map((e) => e.id);
    var pie2_label = data2.result.map((e) => e.tag);
    
    var bar_values = data3.result.map((e) => e.count);
    var bar_label = data3.result.map((e) =>
      moment(new Date(e.tag)).format("YYYY-MM-DD")
    );
  
    function calculate_per(arr) {
      function round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return (Math.round(m) / 100) * Math.sign(num);
      }
      var sum = 0;
      arr.forEach((x) => {
        sum += x;
      });
      var per_value = arr.map((x) => round((x / sum) * 100));
      return per_value;
    }

    function Update_label(label, percentage) {
      var new_label = [];
      for (let i = 0; i < label.length; i++) {
        new_label.push(label[i] + " (" + percentage[i].toString() + " %)");
      }
      return new_label;
    }

    var percentage1 = calculate_per(pie1_values);
    var percentage2 = calculate_per(pie2_values);

    var new_pie_label1 = Update_label(pie1_label, percentage1);
    var new_pie_label2 = Update_label(pie2_label, percentage2);

   

    if ((new Date(Dates.To).getTime() - new Date(Dates.From).getTime())/ (1000 * 3600 * 24) <100) {
      setpieData1({ label: new_pie_label1, value: pie1_values });
      setpieData2({ label: new_pie_label2, value: pie2_values });
      setbarData({ label: bar_label, value: bar_values });
      setTopAlarm(new_pie_label1.length);
      setTopEquipment(new_pie_label1.length);

    } else {
      setpieData1({ label: [], value: [] });
      setpieData2({ label: [], value: [] });
      setbarData({ label: [], value: [] });
      setTopAlarm(new_pie_label1.length);
      setTopEquipment(new_pie_label1.length);
    }
  };



  useEffect(() => {
    gettime();
  }, [Dates.From, Dates.To]);

  return (
    <>
      <div className="container-fluid">
        <div className="d-flex justify-content-md-around align-content-center mt-2">
          <div>
            <h4 className="text-center  text-primary">
              {" "}
              ALARM ANALYSIS DASHBOARD
            </h4>
          </div>
          <div>
            <div className="">
              <TextField
                id="Date1"
                name="From"
                size="small"
                label="From Date"
                type="datetime-local"
                value={Dates.From}
                variant="outlined"
                onChange={handleChange}
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
                value={Dates.To}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* {barData.label.length <6 ? <Alert_date/>:null} */}
              {(new Date(Dates.To).getTime() - new Date(Dates.From).getTime()) /
                (1000 * 3600 * 24) >
              100 ? (
                <Alert_date  
                severity="warning"
                value="You can select max 100 days"/> 
              ) : null}
              {/* <Alert_date/> */}
            </div>
          </div>
        </div>
        <div className="container border border-dark my-2">
          <div className="row mt-2">
            <div className="col-md-6">
              <p className="text-center  text-primary">
                Most Frequent Alarm in Top {TopEquipment} Equipments
              </p>
              <div className="border border-dark p-2">
                <PieChart label={pieData1.label} data={pieData1.value} />
              </div>
            </div>
            <div className="col-md-6">
              <p className="text-center  text-primary">
                Most Frequently Top {TopAlarm} Alarms
              </p>
              <div className="border border-dark p-2">
                <PieChart label={pieData2.label} data={pieData2.value} />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="border border-dark">
                <BarChart label={barData.label} data={barData.value} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alarm_Graph;
