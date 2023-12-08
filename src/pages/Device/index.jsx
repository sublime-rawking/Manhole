import React, { useState, useEffect } from 'react';
import { calculateRange, sliceData } from '../../utils/table-pagination';
import { fetchDeviceData } from '../../services/device.Service';
// import DashboardHeader from '../../components/DashboardHeader';
// import { withProtected } from "../../context/protectedroutes.js"
import '../styles.css';


function Device() {
    const [device, setDevice] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);
    const [search, setSearch] = useState('');
    const [originalData, setOriginalData] = useState([]);

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

    useEffect(() => {
        fetchData();
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

    return (
        <div className='dashboard-content'>
            {/* <DashboardHeader /> */}

            <div className='dashboard-content-container'>
                <div className='dashboard-content-header'>
                    <h2>Devices</h2>

                    <div className='dashboard-content-search'>
                        <input
                            type='text'
                            placeholder='Search..'
                            className='dashboard-content-input'
                            onChange={e => __handleSearch(e)}
                        />
                    </div>
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
                                    <td style={{ color: item.liverState === 'OFF' ? "red" : "green" }}>{item.liverState !== undefined ? item.liverState : "NA"}</td>
                                    <td style={{ color: item.waterState === 'NO' ? "red" : "green" }}>{item.waterState !== undefined ? item.waterState : "NA"}</td>
                                    <td style={{ color: item.tempretureState === 'NO' ? "red" : "green" }}>{item.tempretureState !== undefined ? item.tempretureState : "NA"}</td>
                                    <td style={{ color: item.connection === 0 ? "red" : "green" }}>{item.connection === 1 ? "ACTIVE" : "IN-ACTIVE"}</td>
                                </tr>
                            ))}
                        </tbody>
                        : null}
                </table>

                {device.length !== 0 ?
                    <div className='dashboard-content-footer'>
                        {pagination.map((item, index) => (
                            <span
                                key={index}
                                className={item === page ? 'active-pagination' : 'pagination'}
                                onClick={() => __handleChangePage(item)}>
                                {item}
                            </span>
                        ))}
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