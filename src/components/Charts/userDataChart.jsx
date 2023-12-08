import React from "react";
import { Bar, Pie } from "react-chartjs-2";
export default function UserDataChart({ activeUser, inActiveUser, options }) {
  const userData = {
    labels: ["Active", "In-Active"],
    datasets: [
      {
        maxBarThickness: 10,
        label: "users",
        data: [activeUser, inActiveUser],
        backgroundColor: ["#176B87", "#64CCC5"],
        borderWidth: 1,
      },
    ],
  };

  const userDataBar = {
    labels: ["Users"],
    datasets: [
      {
        maxBarThickness: 40,
        label: "Active",
        data: [activeUser],
        // backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for trips
        backgroundColor: "#176B87", // Color for trips
      },
      {
        maxBarThickness: 40,
        label: "In-Active",
        data: [inActiveUser],
        // backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color for orders
        backgroundColor: "#64CCC5", // Color for orders
      },
    ],
  };
  const opt = {
    plugins: {
      legend: {
        display: true,
      },
      responsive: true,
      maintainAspectRatio: false,
      datalabels: {
        color: "white",
        formatter: (value, dnct1) => {
          let sum = 0;
          let dataArr = dnct1.chart.data.datasets[0].data;
          dataArr.map((data) => {
            return (sum += Number(data));
          });

          let percentage = ((value * 100) / sum).toFixed(2) + "%";
          return percentage;
        },
      },
    },
  };
  return (
    <div className=" ChatRow">
      <div className=" ChartCard  mx-2">
        <div className="card card-default ">
          <div className="card-header">
            <h4>Users</h4>
          </div>
          <div className="card-body">
            <div className="chart-wrapper ">
              <Bar data={userDataBar} options={options} className="bar-chart" />
            </div>
          </div>
        </div>
      </div>
      <div className="ChartCard mx-2 ">
        <div className="card card-default ">
          <div className="card-header">
            <h4>Users</h4>
          </div>
          <div className="card-body">
            <div className="PieWrapperdiv  mx-auto ">
              <Pie data={userData} options={opt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
