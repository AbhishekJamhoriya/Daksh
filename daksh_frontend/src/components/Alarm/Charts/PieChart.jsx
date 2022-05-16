import React from "react";
import { defaults, Pie } from "react-chartjs-2";

defaults.global.tooltips.enabled = false;
defaults.global.legend.position = "bottom";

const PieChart = ({label, data}) => {
// const pieChartColor = ()=>{
//   let backgroundColor = [];
//   for(let i = 0; i < label.length; i++) {
//     const r = Math.floor(Math.random() *255)
//     const g = Math.floor(Math.random() *255)
//     const b = Math.floor(Math.random() *255)
//     backgroundColor.push('rgb(' + r + ',' + g + ',' + b+', 0.8)')
//   }
//   return backgroundColor
// }
  return (
    <>
      <Pie
        data={{
          labels:label,
          datasets: [
            {
              label: "# of votes",
              data: data,
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(0,128,0)",
                "rgb(0,0,128)",
              ],
              borderColor: "white",
              borderWidth: 2,
            },
          ],
        }}
        height={180}
        width={200}
        options={{
          tooltips: false,
          maintainAspectRatio: false,
          legend: {
            position : 'right',
            labels: {
              fontSize: 10,
              
            }
          },
          pieceLabel: {
            render: 'percentage',
            fontColor: 'white',
            fontSize: 14,
          },
        }}
      
      />
    </>
  );
};
export default PieChart;
