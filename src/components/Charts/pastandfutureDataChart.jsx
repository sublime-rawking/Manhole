import React from "react";
import { Bar, Pie } from "react-chartjs-2";
export default function PastandfutureDataChart({
  selectTypeOfChart,
  options,
  tripCount,
  orderCount,
}) {
  const pastAndFutureDataChart = {
    labels: ["Past", "Future"],
    datasets: [
      {
        maxBarThickness: 40,
        label: "Trips",
        data: [tripCount.past, tripCount.future],
        // backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for trips
        backgroundColor: "#176B87", // Color for trips
      },
      {
        maxBarThickness: 40,
        label: "Order",
        data: [orderCount.past, orderCount.future],
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
  const pastAndFutureTripCount = {
    labels: ["Past", "Future"],
    datasets: [
      {
        maxBarThickness: 10,
        label: "Trip",

        data: [tripCount.past, tripCount.future],
        backgroundColor: ["#176B87", "#64CCC5"], // Color for trips

        borderWidth: 1,
      },
    ],
  };
  const pastAndFutureOrderCount = {
    labels: ["Past", "Future"],
    datasets: [
      {
        maxBarThickness: 10,
        label: "Order",
        data: [orderCount.past, orderCount.future],
        backgroundColor: ["#176B87", "#64CCC5"], // Color for trips
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className=" my-4 mx-2 ChartCard">
      <div className="card card-default">
        <div className="card-header">
          <h4>Past and Future , Trips and Orders </h4>
        </div>
        {selectTypeOfChart === 1 ? (
          <div className="card-body">
            <div className="chart-wrapper">
              <Bar
                data={pastAndFutureDataChart}
                options={options}
                className="bar-chart"
              />
            </div>
          </div>
        ) : (
          <div className="MainPieWarapper ">
            <div className="card-body">
              <div className=" PieWrapper">
                <Pie data={pastAndFutureTripCount} options={opt} />
                <h5 className="text-center my-2  fw-normal">Trips</h5>
              </div>
            </div>

            <div className="card-body">
              <div className=" PieWrapper">
                <Pie data={pastAndFutureOrderCount} options={opt} />
                <h5 className="text-center my-2  fw-normal">Orders</h5>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
