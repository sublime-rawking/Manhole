import { Link, useParams } from "react-router-dom";
import L from 'leaflet';
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { pinIcon } from '../../assets/index.js';
import { withProtected } from "../../context/protectedRoutes.js";
import "../styles.css";
import { fetchDeviceData } from "../../services/device.Service.js";
import { IoIosArrowBack } from "react-icons/io";


const customIcon = L.icon({
    iconUrl: pinIcon, // Replace with your PNG image path
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});


function DeviceDetails() {
    const { deviceId } = useParams();
    const [deviceDetails, setDeviceDetails] = useState({
        CH4: 0,
        CO: 0,
        Lidar: 6,
        NH3: 0,
        batteryStatus: "mid",
        city: "",
        connection: 0,
        id: 1,
        lat: 19.024945,
        liverState: 0,
        lng: 73.02407,
        waterState: 0,
    });



    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchDeviceData();
                const deviceData = result.data.find(data => data.id === Number(deviceId));
                setDeviceDetails(deviceData);
            } catch (error) {
                // Handle the error as needed
                console.error('API call error:', error);
            }
        };
        fetchData();
    }, [deviceId]);


    return (
        <div className="dashboard-content">
            {/* <DashboardHeader btnText="New Order" /> */}

            <div className="dashboard-content-container">
                <div className="d-flex align-content-center gap-2 " >
                    <Link to="/device" className="" >
                        <IoIosArrowBack  size={30}/>
                    </Link>
                    <h3 className="fw-bold">Device Information</h3>
                </div>
                <div>
                    <div className="container mt-4">
                        <div className="row">
                            <div className="col">

                                <div className="">
                                    <strong>ID:</strong> {deviceDetails.id}
                                </div>

                                <div className="">
                                    <strong>City:</strong> {deviceDetails.city}
                                </div>

                                <div className="">
                                    <strong>Latitude:</strong> {deviceDetails.lat}
                                </div>
                                <div className="">
                                    <strong>Longitude:</strong> {deviceDetails.lng}
                                </div>
                                <div className="">
                                    <strong>Battery Status:</strong> {deviceDetails.batteryStatus}
                                </div>
                            </div>
                            <div className="col">
                                <div className="">
                                    <strong>CH4:</strong> {deviceDetails.CH4}
                                </div>
                                <div className="">
                                    <strong>CO:</strong> {deviceDetails.CO}
                                </div>
                                <div className="">
                                    <strong>Lidar:</strong> {deviceDetails.Lidar}
                                </div>
                                <div className="">
                                    <strong>NH3:</strong> {deviceDetails.NH3}
                                </div>

                                <div className="">
                                    <strong>Liver State:</strong> {deviceDetails.liverState}
                                </div>

                                <div className="">
                                    <strong>Water State:</strong> {deviceDetails.waterState}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height: '100%', width: '100%' }}>
                    <MapContainer center={[19.024842, 73.02202]} zoom={13} style={{ height: '400px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <Marker position={[deviceDetails.lat, deviceDetails.lng]} icon={customIcon} >
                            <Popup>
                                Latitude: {deviceDetails.lat}, Longitude: {deviceDetails.lng}
                            </Popup>
                        </Marker>

                    </MapContainer>
                </div>
            </div>
        </div>
    )
}
export default withProtected(DeviceDetails);
