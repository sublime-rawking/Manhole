import React from "react";
import { Bar, Pie } from "react-chartjs-2";

export default function TotalTripAndOrderChart({
  selectTypeOfChart,
  options,
  tripCount,
  totalRequestToCountry,
}) {
  const travellerAndOrderData = {
    labels: ["Travellers", "Purchasers"],
    datasets: [
      {
        maxBarThickness: 40,
        label: "USA",
        data: [tripCount.USA, totalRequestToCountry.USA],
        // backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for trips
        backgroundColor: "#176B87", // Color for trips
      },
      {
        maxBarThickness: 40,
        label: "India",
        data: [tripCount.India, totalRequestToCountry.India],
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
  const travellerFromData = {
    labels: ["USA", "India"],
    datasets: [
      {
        maxBarThickness: 10,
        label: "travellers",

        data: [tripCount.USA, tripCount.India],
        backgroundColor: ["#176B87", "#64CCC5"], // Color for trips

        borderWidth: 1,
      },
    ],
  };
  const purchasersToData = {
    labels: ["USA", "India"],
    datasets: [
      {
        maxBarThickness: 10,
        label: "purchasers",
        data: [totalRequestToCountry.USA, totalRequestToCountry.India],
        backgroundColor: ["#176B87", "#64CCC5"], // Color for trips
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="my-4 mx-2 ChartCard">
      <div className="card card-default">
        <div className="card-header">
          <h4> Total Travellers and Purchasers by countries </h4>
        </div>
        {selectTypeOfChart === 1 ? (
          <div className="card-body">
            <div className="chart-wrapper">
              <Bar
                data={travellerAndOrderData}
                options={options}
                className="bar-chart"
              />
            </div>
          </div>
        ) : (
          <div className="MainPieWarapper ">
            <div className="card-body">
              <div className="PieWrapper">
                <Pie data={travellerFromData} options={opt} className=""/>
                <h5 className="text-center my-2  fw-normal">Travellers</h5>
              </div>
            </div>

            <div className="card-body">
              <div className="PieWrapper">
                <Pie data={purchasersToData} options={opt} className=""/>
                <h5 className="text-center my-2  fw-normal">Purchasers</h5>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
