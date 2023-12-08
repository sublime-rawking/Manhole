import React from "react";
import { Bar, Pie } from "react-chartjs-2";

export default function TotalOrderChart({
  selectTypeOfChart,
  totalRequestFromCountry,
  totalRequestToCountry,
  options,
}) {
  const TotalOrderRequestFromCountrydataBar = {
    labels: ["From", "To"],

    datasets: [
      {
        maxBarThickness: 40,
        label: "USA",
        data: [totalRequestFromCountry.USA, totalRequestToCountry.USA],
        // backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for trips
        backgroundColor: "#176B87", // Color for trips
      },
      {
        maxBarThickness: 40,
        label: "India",
        data: [totalRequestFromCountry.India, totalRequestToCountry.India],
        // backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color for orders
        backgroundColor: "#64CCC5", // Color for orders
      },
    ],
  };

  const totalRequestFromCountryPieConfig = {
    labels: ["USA", "India"],
    datasets: [
      {
        maxBarThickness: 10,
        label: "From",

        data: [totalRequestFromCountry.USA, totalRequestFromCountry.India],
        backgroundColor: ["#176B87", "#64CCC5"], // Color for trips

        borderWidth: 1,
      },
    ],
  };
  const opt = {
    plugins: {
      legend: {
        display: true,
      },
      responsive: true,
      maintainAspectRatio: true,
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
  const totalRequestToCountryPieConfig = {
    labels: ["USA", "India"],
    datasets: [
      {
        maxBarThickness: 10,
        label: "To",
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
          <h4>Total requested orders by countries </h4>
        </div>
        {selectTypeOfChart === 1 ? (
          <div className="card-body">
            <div className="chart-wrapper">
              <Bar
                data={TotalOrderRequestFromCountrydataBar}
                options={options}
                className="bar-chart"
              />
            </div>
          </div>
        ) : (
          <div className="MainPieWarapper">
            <div className="card-body">
              <div className="PieWrapper">
                <Pie
                  data={totalRequestFromCountryPieConfig}
                  options={opt}
                  className=""
                />
                <h5 className="text-center my-2  fw-normal">From</h5>
              </div>
            </div>

            <div className="card-body">
              <div className="PieWrapper">
                <Pie
                  data={totalRequestToCountryPieConfig}
                  className=""
                  options={opt}
                />
                <h5 className="text-center my-2  fw-normal">To</h5>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
