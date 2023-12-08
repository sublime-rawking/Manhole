import React, { useState, useEffect, useRef } from "react";
import { fetchTripList } from "../../services/trip.Service.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import Chart from "chart.js/auto";
import SegmentedControl from "./Segment.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./styles.css";


// import { fetchOrderList } from "../../services/order.Service";
import TotalOrderChart from "./totalOrderChart.jsx";
import TotalPriceChart from "./totalPriceChart.jsx";
import UserDataChart from "./userDataChart.jsx";
import PastandfutureDataChart from "./pastandfutureDataChart.jsx";
import TotalTripAndOrderChart from "./totalTripAndOrderChart.jsx";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = (props) => {
  const { activeUser, inActiveUser } = props.data;

  const [selectTypeOfChart, setSelectTypeOfChart] = useState(1);

  const [orderCount, setOrderCount] = useState({
    past: 0,
    future: 0,
  });

  const [tripCount, setTripCount] = useState({
    past: 0,
    future: 0,
    USA: 0,
    India: 0
  });


  const [totalRequestFromCountry, setTotalRequestFromCountry] = useState({
    USA: 0,
    India: 0,
    PriceUSA: 0,
    PriceIndia: 0,
  });
  const [totalRequestToCountry, setTotalRequestToCountry] = useState({
    USA: 0,
    India: 0,
    PriceUSA: 0,
    PriceIndia: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {


        // Fetch trip counting data and order counting data concurrently
        const [tripData, orderData] = await Promise.all([
          fetchTripList(),
          // fetchOrderList(),
        ]);
        // Set the trips chart and orders chart
        await tripData.data.forEach((data) => {
          setTripCount((prev) => {
            let updatedData = {
              past: prev.past,
              future: prev.future,
              USA: prev.USA,
              India: prev.India
            }
            if (data.status === 2) {
              updatedData = {
                past: prev.past + 1,
              };
            } else {
              updatedData = {
                future: prev.future + 1,
              };
            }
            if (data.from_destination[0].country === "India") {
              updatedData = {
                ...updatedData,
                India: prev.India + 1,
              };
            } else {
              updatedData = {
                ...updatedData,
                USA: prev.USA + 1,
              };

            }
            return {
              ...prev,
              ...updatedData
            };
          });


        })

        await orderData.data.forEach((data) => {
          setOrderCount((prev) => {
            let updatedData = {
              past: prev.past,
              future: prev.future,
            }
            if (data.order_status === 2) {
              updatedData = {
                past: prev.past + 1,
              };
            } else {
              updatedData = {
                future: prev.future + 1,
              };
            }
            return {
              ...prev,
              ...updatedData
            };
          });


          if (
            (data.from_location[0].country === "United States" ||
              data.from_location[0].country === "India")
            // && data.order_status === 2
          ) {

            setTotalRequestFromCountry((prev) => {
              let getAmount = 0;
              if (data.price[0].unit === "$") {
                getAmount = parseInt(data.price[0].value) / 80;
              } else {
                getAmount = parseInt(data.price[0].value);
              }

              let updatedData =
                data.from_location[0].country === "India"
                  ? {
                    India: prev.India + 1,
                    PriceIndia: prev.PriceIndia + getAmount,
                  }
                  : { USA: prev.USA + 1, PriceUSA: prev.PriceUSA + getAmount };

              return {
                ...prev,
                ...updatedData,
              };
            });
          }
          if (
            (data.to_location[0].country === "United States" ||
              data.to_location[0].country === "India")
            // && data.order_status === 2
          ) {

            setTotalRequestToCountry((prev) => {
              let getAmount = 0;
              if (data.price[0].unit === "$") {
                getAmount = parseInt(data.price[0].value) / 80;
              } else {
                getAmount = parseInt(data.price[0].value);
              }
              let updatedData =
                data.to_location[0].country === "India"
                  ? {
                    India: prev.India + 1,
                    PriceIndia: prev.PriceIndia + getAmount,
                  }
                  : { USA: prev.USA + 1, PriceUSA: prev.PriceUSA + getAmount };
              return {
                ...prev,
                ...updatedData,
              };
            });
          }
        });

        console.log(tripData, "tripData");
        console.log(orderData, "OrderData");

      } catch (error) {
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);

  // Create an object to group data by month
  // const groupedData = {};
  // // Combine the tripOutput and orderOutput arrays
  // [...tripsChart, ...ordersChart].forEach((item) => {
  //   const year = item._id.year;
  //   const month = item._id.month;
  //   const key = `${year}-${month}`;
  //   if (!groupedData[key]) {
  //     groupedData[key] = [];
  //   }
  //   groupedData[key].push(item);
  // });

  // Convert the groupedData object to an array
  // const groupedArray = Object.values(groupedData);

  ;

  Chart.register(ChartDataLabels);
  // Sample data for the chart
  // const labels = groupedArray.map(monthData => monthData[0]._id.month);
  // const labels = groupedArray.map(
  //   (monthData) => `${monthData[0]._id.year}-${monthData[0]._id.month}`
  // );
  // const tripCounts = groupedArray.map((monthData) => monthData[0].count);
  // const orderCounts = groupedArray.map((monthData) => monthData[1].count);

  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: "black",
        formatter: Math.round,
        anchor: "start",
        offset: -20,
        align: "end",
      },
    },
    legend: {
      display: true,

    },
  };



  return (
    <div className="container-fluid my-4" >
      <div className="align-items-center mx-auto ">
        <SegmentedControl
          callback={(val) => setSelectTypeOfChart(val)}
          controlRef={useRef()}
          segments={[
            {
              label: "Bar Chart",
              value: 1,
              ref: useRef(),
            },
            {
              label: "Pie Chart",
              value: 2,
              ref: useRef(),
            },
          ]}
        />
      </div>

      <div className="ChatRow">
        <TotalOrderChart
          options={options}
          selectTypeOfChart={selectTypeOfChart}
          totalRequestFromCountry={totalRequestFromCountry}
          totalRequestToCountry={totalRequestToCountry}
        />
        <TotalPriceChart
          options={options}
          selectTypeOfChart={selectTypeOfChart}
          totalRequestFromCountry={totalRequestFromCountry}
          totalRequestToCountry={totalRequestToCountry}
        />
      </div>
      <div className="ChatRow">
        <PastandfutureDataChart
          selectTypeOfChart={selectTypeOfChart}
          options={options}
          tripCount={tripCount}
          orderCount={orderCount}
        />
        <TotalTripAndOrderChart
          selectTypeOfChart={selectTypeOfChart}
          options={options}
          tripCount={tripCount}
          totalRequestToCountry={totalRequestToCountry}
        />
      </div>
      <UserDataChart
        activeUser={activeUser}
        inActiveUser={inActiveUser}
        options={options} />
    </div>
  );
};

export default ChartComponent;
