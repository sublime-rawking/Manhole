import React, { useState, useEffect } from 'react';
import { sliceData } from '../../utils/table-pagination';
import { fetchDeviceData } from '../../services/device.Service';
// import DashboardHeader from '../../components/DashboardHeader';
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
    socket.onerror = function (event) {
        console.log("Error occured ", event);
    }

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
        socket.onopen = function (event) {
            console.log("Connection established");
        }

        // Listen for messages
        socket.addEventListener("message", async event => {
            try {
                const deviceScoketData = JSON.parse(event.data);
                setDevice(prevState => {
                    const updatedDevices = prevState.map(device => {
                        if (device.id === Number(deviceScoketData.id)) {
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


    const handlePrevious = () => {
        if (currentPageSchedule > 1) {
            setCurrentPageSchedule((prevState) => {
                setPage(prevState - 1)
                return prevState - 1
            })
            const startIndex = currentPageSchedule * 10;
            const endIndex = startIndex - 10;
            setEndIndexData(endIndex)
            setDevice(sliceData(device, page, 10));
        }
    };

    const handleNext = () => {
        setCurrentPageSchedule((prevState) => {
            setPage(prevState + 1)
            return prevState + 1
        })
        const startIndex = currentPageSchedule * 10;
        const endIndex = startIndex + 10;
        setEndIndexData(endIndex)
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
// export default Device;