"use client"
import errorAnimation from '@/assets/animation/error.gif';
import { fetchDeviceData } from '@/services/device.service';
import { Card, Typography } from "@material-tailwind/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheck } from "react-icons/fa6";
const socket = new WebSocket(`${process.env.WEBSOCKET}/?id=999`)

export default function DevicesPages() {
    const TABLE_HEAD = [
        "DEVICE-ID",
        "LIVER STATE",
        "WATER BLOCKAGE",
        "NH3 | C0",
        "BATTERY",
        "STATUS",
    ];

    const [device, setDevice] = useState([]);
    const [page, setPage] = useState(1);
    const [currentPageSchedule, setCurrentPageSchedule] = useState(1); // State for current page
    const [endIndexData, setEndIndexData] = useState(1); // State for current page
    const [originalData, setOriginalData] = useState([]);
    const { push } = useRouter();
    // Handle errors
    /**
     * Handle error events from the WebSocket connection.
     * Logs the error event to the console.
     *
     * @param {Event} event - The error event.
     */
    socket.onerror = function (event) {
        console.log("Error occurred ", event);
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
                setDevice(result.data);
                // setDevice(sliceData(result.data, page, 10));
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
                const deviceSocketData = JSON.parse(event.data);

                // Update the device state with the new value
                setDevice(prevState => {
                    const updatedDevices = prevState.map(device => {
                        // Check if the device id matches the one in the message
                        if (device.id === Number(deviceSocketData.id)) {
                            // Update the specific property based on the key in the message
                            device[deviceSocketData.key] = deviceSocketData.value;
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
        <div className='w-full mx-5 h-full'>

            <h2 className={`text-2xl  mx-5 `}>Devices</h2>

            <Card className=" w-full p-3  ">
                <table className="w-full min-w-max  text-left">
                    <thead>

                        <tr>
                            {
                                TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-gray-300 pb-4 pt-10">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>))
                            }
                        </tr>
                    </thead>

                    {device.length !== 0 ?
                        <tbody>
                            {device.map((item, index) => {
                                let showStatus = true;
                                const isLast = index === device.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                if (item.liverState === 1 || item.waterState === 1 || item.batteryStatus === 'low') {
                                    showStatus = false
                                }
                                return (
                                    <tr key={index}>
                                        <td className={classes}>
                                            {item.id}</td>
                                        <td className={classes} style={{ color: item.liverState === 1 ? "red" : "green" }}>{item.liverState !== undefined ? item.liverState === 1 ? "OPEN" : "CLOSE" : "NA"}</td>
                                        <td className={classes} style={{ color: item.waterState === 1 ? "red" : "green" }}>{item.waterState !== undefined ? item.waterState === 1 ? "HIGH" : "NORMAL" : "NA"}</td>
                                        <td className={classes}>
                                            <p>
                                                <span style={{ color: Number(item.NH3).toFixed(2) >= 30 ? "red" : "green" }}>{item.NH3 !== undefined ? Number(item.NH3).toFixed(2) : "NA"}</span>
                                                <span style={{ margin: "0 5px" }} />
                                                <span style={{ color: Number(item.CO).toFixed(2) >= 30 ? "red" : "green" }}>{item.CO !== undefined ? Number(item.CO).toFixed(2) : "NA"}</span>
                                            </p>
                                        </td>
                                        <td className={classes} style={{ color: item.batteryStatus === 'low' ? "red" : "green" }}>{item.batteryStatus !== undefined ? item.batteryStatus.toUpperCase() : "NA"}</td>
                                        <td className={classes}>
                                            {!showStatus ?
                                                <FaCheck className='w-6 h-6 text-green-700' />
                                                :
                                                <Image priority src={errorAnimation} alt="status" className='w-6 h-6  object-fill' width={1000} height={1000} />
                                            }
                                        </td>
                                        <td className={classes}>
                                            <button className="mt-6 bg-primary  text-sm px-3  py-2 rounded text-white"
                                                onClick={() => push(`/dashboard/devices/${item.id}`)}
                                            >

                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        : null}
                </table>
            </Card>



        </div >
    )
}
