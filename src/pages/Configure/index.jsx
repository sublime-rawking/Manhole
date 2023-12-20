import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchDeviceData, deviceConfigure } from '../../services/device.Service';
// import DashboardHeader from '../../components/DashboardHeader';
import { withProtected } from "../../context/protectedroutes.js"
import '../styles.css';



function Device() {
    const [deviceList, setDeviceList] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [city, setCity] = useState('');

    // define the function that finds the users geolocation
    const getUserLocation = () => {
        // if geolocation is supported by the users browser
        if (navigator.geolocation) {
            // get the current users location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // save the geolocation coordinates in two variables
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude);
                    setLongitude(longitude);
                },
                // if there was an error getting the users location
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        }
        // if geolocation is not supported by the users browser
        else {
            console.error('Geolocation is not supported by this browser.');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                deviceId: selectedValue,
                latitude,
                longitude,
                city
            }
            const result = await deviceConfigure(updateData);
            if (result) {
                alert("Device configuration successful");
                setLatitude('');
                setLongitude('');
                setSelectedValue('');
                setDeviceList([]);
                window.location.reload();
            } else {
                alert("Device configuration failed");
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        try {
            setSelectedValue(e.value);
        } catch (error) {
            console.error(error);
        }

    };

    useEffect(() => {
        try {
            async function deviceList() {
                const result = await fetchDeviceData();
                const selectionData = result.data.map((item) => {
                    return {
                        label: `Device ID ${item.id}`, // ${item.id,
                        value: item.id
                    }
                })
                setDeviceList(selectionData);
            }
            deviceList();

        } catch (error) {
            // Handle the error as needed
            console.error('API call error:', error);
        }
    }, []);

    return (
        <div className='dashboard-content' >
            {/* <DashboardHeader /> */}
            <div className='dashboard-content-container' style={{ height: "100%" }}>
                <div className='dashboard-content-header'>
                    <h2>Configure</h2>
                </div>
                <>
                    <form onSubmit={handleSubmit} className='form-container'>
                        <label htmlFor="latitude">Devices:</label>

                        <Select
                            className="select-container"
                            classNamePrefix="Select Device"
                            isClearable={true}
                            name="color"
                            options={deviceList}
                            onChange={handleChange}
                        />
                        <button onClick={getUserLocation} className='locationBtn'>Get Location</button>

                        <label htmlFor="city">City:</label>
                        <input
                            className='input-container'
                            type="text"
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />

                        <label htmlFor="latitude">Latitude:</label>
                        <input
                            className='input-container'
                            type="text"
                            id="latitude"
                            name="latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            required
                        />

                        <label htmlFor="longitude">Longitude:</label>
                        <input
                            className='input-container'
                            type="text"
                            id="longitude"
                            name="longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            required
                        />

                        <button type="submit" className='buttonSubmit'>Submit</button>
                    </form>
                </>
            </div>
        </div>
    )
}

export default withProtected(Device);
// export default Device;