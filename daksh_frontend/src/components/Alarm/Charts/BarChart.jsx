import React from "react";
import { defaults, Bar } from "react-chartjs-2";

defaults.global.tooltips.enabled = false;
defaults.global.legend.position = "bottom";

const BarChart = ({label, data}) => {
  // var values = [];
  // var labels = []
  // for(let i = 0; i < 50; i++) {
  //   values.push(Math.floor((Math.random() * 100) + 1))
  //   labels.push("16/08/2002")
  // }
  return (
    <>
      <Bar
        data={{
          labels: label,
          datasets: [
            {
              label: "ALARM FREQUENCY",
              data: data,
              backgroundColor: "rgb(230,126,0)",
              borderColor: "rgb(230,126,0)",
              borderWidth: 1,
            },
          ],
        }}
        height={250}
        width={300}
        options={{
          maintainAspectRatio: false,
          legend: {
            labels: {
              fontSize: 10,
            },
          },
          scales: {
            xAxes: [{
                barPercentage: 0.3
            }],
            yAxes: [{
              ticks: {
                  beginAtZero: true
              },
              
          }]
          }
        }}
      />
    </>
  );
};
export default BarChart;
