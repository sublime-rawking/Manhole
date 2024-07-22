import React, { useState, useEffect } from 'react';
import { sliceData } from '../../utils/table-pagination';
import { fetchDeviceData } from '../../services/device.Service';
import { withProtected } from "../../context/protectedroutes.js"
import '../styles.css';
import checked from '../../assets/images/check.png'
import errorAnimation from '../../assets/animation/error.gif';

// socket connection
const socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET}/?id=999`);


function Device() {
    const [device, setDevice] = useState([]);
    const [page, setPage] = useState(1);
    const [currentPageSchedule, setCurrentPageSchedule] = useState(1); // State for current page
    const [endIndexData, setEndIndexData] = useState(1); // State for current page
    const [originalData, setOriginalData] = useState([]);

    // Handle errors
    /**
     * Handle error events from the WebSocket connection.
     * Logs the error event to the console.
     *
     * @param {Event} event - The error event.
     */
    socket.onerror = function (event) {
        console.log("Error occured ", event);
    }

    /**
     * Handle close events from the WebSocket connection.
     * Logs the close event to the console.
     *
     * @param {Event} event - The close event.
     */
    socket.onclose = function (event) {
        console.log("Connection closed ", event);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchDeviceData();
                setOriginalData(result.data);
                setDevice(sliceData(result.data, page, 10));
            } catch (error) {
                // Handle the error as needed
                console.error('API call error:', error);
            }
        };
        fetchData();
        // Listen for connection established event
        socket.onopen = function (event) {
            console.log("Connection established");
        }

        // Listen for messages
        // When a message is received, parse the JSON data and update the device state
        socket.addEventListener("message", async event => {
            try {
                const deviceScoketData = JSON.parse(event.data);

                // Update the device state with the new value
                setDevice(prevState => {
                    const updatedDevices = prevState.map(device => {
                        // Check if the device id matches the one in the message
                        if (device.id === Number(deviceScoketData.id)) {
                            // Update the specific property based on the key in the message
                            device[deviceScoketData.key] = deviceScoketData.value;
                        }
                        return device;
                    });
                    return updatedDevices
                })
            } catch (error) {
                // Handle the error as needed
                console.log('Error parsing JSON:', error.message);
            }
        });
    }, []);


    // Handle the previous page button
    const handlePrevious = () => {
        // Only allow navigating to previous page if not already on the first page
        if (currentPageSchedule > 1) {
            // Update the current page state
            setCurrentPageSchedule((prevState) => {
                setPage(prevState - 1)
                return prevState - 1
            })
            // Calculate the start and end indices for the new slice of data
            const startIndex = currentPageSchedule * 10;
            const endIndex = startIndex - 10;
            // Update the end index state
            setEndIndexData(endIndex)
            // Update the device state with the new slice of data
            setDevice(sliceData(device, page, 10));
        }
    };

    // Handle the next page button
    const handleNext = () => {
        // Update the current page state
        setCurrentPageSchedule((prevState) => {
            setPage(prevState + 1)
            return prevState + 1
        })
        // Calculate the start and end indices for the new slice of data
        const startIndex = currentPageSchedule * 10;
        const endIndex = startIndex + 10;
        // Update the end index state
        setEndIndexData(endIndex)
        // Update the device state with the new slice of data
        setDevice(sliceData(device, page, 10));
    };

    return (
        <div className='dashboard-content'>
            {/* <DashboardHeader /> */}

            <div className='dashboard-content-container'>
                <div className='dashboard-content-header'>
                    <h2>Devices</h2>
                </div>

                <table style={{ textAlign: "center" }}>
                    <thead>
                        <th key="id">DEVICE-ID</th>
                        <th key="liver">LIVER STATE</th>
                        <th key="water">WATER BLOCKAGE</th>
                        <th key="temp">TEMPRETURE STATE</th>
                        <th key="connection">BATTERY</th>
                        <th key="status">STATUS</th>
                    </thead>

                    {device.length !== 0 ?
                        <tbody>
                            {device.map((item, index) => {
                                let showStatus = true;
                                if (item.liverState === 1 || item.waterState === 1 || item.batteryStatus === 'low' || Number(item.tempretureState).toFixed(2) >= 30) {
                                    showStatus = false
                                }
                                return (
                                    <tr key={index} >
                                        <td>{item.id}</td>
                                        <td style={{ color: item.liverState === 1 ? "red" : "green" }}>{item.liverState !== undefined ? item.liverState === 1 ? "OPEN" : "CLOSE" : "NA"}</td>
                                        <td style={{ color: item.waterState === 1 ? "red" : "green" }}>{item.waterState !== undefined ? item.waterState === 1 ? "HIGH" : "NORMAL" : "NA"}</td>
                                        <td style={{ color: Number(item.tempretureState).toFixed(2) >= 30 ? "red" : "green" }}>{item.tempretureState !== undefined ? Number(item.tempretureState).toFixed(2) : "NA"}</td>
                                        <td style={{ color: item.batteryStatus === 'low' ? "red" : "green" }}>{item.batteryStatus !== undefined ? item.batteryStatus.toUpperCase() : "NA"}</td>
                                        <td ><img src={showStatus ? checked : errorAnimation} alt="status" width={showStatus ? "20" : "40"} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        : null}
                </table>

                {device.length !== 0 ?
                    <div className='dashboard-content-footer'>
                        <ul className="pagination">
                            <li className="page-item">
                                <span>
                                    <button
                                        className="page-link"
                                        id="previous"
                                        onClick={() => handlePrevious()}
                                        disabled={currentPageSchedule === 1}
                                    >
                                        Previous
                                    </button>
                                </span>
                            </li>
                            <li className="page-item">
                                <span className="page-link">{currentPageSchedule}</span>
                            </li>
                            <li className="page-item">
                                <span>
                                    <button
                                        className="page-link"
                                        id="next"
                                        type="button"
                                        onClick={() => handleNext()}
                                        disabled={endIndexData >= originalData.length || originalData.length < 10}
                                    >
                                        Next
                                    </button>
                                </span>
                            </li>
                        </ul>
                    </div>
                    :
                    <div className='dashboard-content-footer'>
                        <span className='empty-table'>No data</span>
                    </div>
                }

            </div>


        </div >
    )
}

export default withProtected(Device);