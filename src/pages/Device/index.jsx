import React, { useState, useEffect } from 'react';
import { calculateRange, sliceData } from '../../utils/table-pagination';
import { fetchDeviceData } from '../../services/device.Service';
// import DashboardHeader from '../../components/DashboardHeader';
// import { withProtected } from "../../context/protectedroutes.js"
import '../styles.css';

// socket connection
const socket = new WebSocket("ws://192.168.0.141:6063/?id=999");


function Device() {
    const [device, setDevice] = useState([]);
    const [page, setPage] = useState(1);
    const [currentPageSchedule, setCurrentPageSchedule] = useState(1); // State for current page
    const [endIndexData, setEndIndexData] = useState(1); // State for current page

    const [pagination, setPagination] = useState([]);
    const [search, setSearch] = useState('');
    const [originalData, setOriginalData] = useState([]);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const result = await fetchDeviceData();
            setDevice(result.data);
            setOriginalData(result.data);
            setPagination(calculateRange(result.data, 10));
            setDevice(sliceData(result.data, page, 10));
        } catch (error) {
            // Handle the error as needed
            console.error('API call error:', error);
        }
    };

    // Handle errors
    socket.onerror = function (event) {
        console.log("Error occured ", event);
    }

    socket.onclose = function (event) {
        console.log("Connection closed ", event);
    }

    useEffect(() => {
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
    // Search
    const __handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            // let search_results = originalData.filter((item) =>
            //     item.userName.toLowerCase().includes(search.toLowerCase())
            // );
            // setDevice(search_results);
        }
        else {
            fetchData();
            __handleChangePage(1);
        }
    };

    // Change Page 
    const __handleChangePage = (new_page) => {
        setPage(new_page);
        setDevice(sliceData(device, new_page, 10));
    }

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

                    {/* <div className='dashboard-content-search'>
                        <input
                            type='text'
                            placeholder='Search..'
                            className='dashboard-content-input'
                            onChange={e => __handleSearch(e)}
                        />
                    </div> */}
                </div>

                <table style={{ textAlign: "center" }}>
                    <thead>
                        <th key="id">DEVICE-ID</th>
                        <th key="liver">LIVER STATE</th>
                        <th key="water">WATER BLOCKAGE</th>
                        <th key="temp">TEMPRETURE STATE</th>
                        <th key="connection">CONNECTION</th>
                    </thead>

                    {device.length !== 0 ?
                        <tbody>
                            {device.map((item, index) => (
                                <tr key={item.id} >
                                    <td>{item.id}</td>
                                    <td style={{ color: item.liverState === 0 ? "red" : "green" }}>{item.liverState !== undefined ? item.liverState : "NA"}</td>
                                    <td style={{ color: item.waterState === 0 ? "red" : "green" }}>{item.waterState !== undefined ? item.waterState : "NA"}</td>
                                    <td style={{ color: item.tempretureState === 'NO' ? "red" : "green" }}>{item.tempretureState !== undefined ? item.tempretureState : "NA"}</td>
                                    <td style={{ color: item.connection === 0 ? "red" : "green" }}>{item.connection === 1 ? "ACTIVE" : "IN-ACTIVE"}</td>
                                </tr>
                            ))}
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


        </div>
    )
}

// export default withProtected(Device);
export default Device;