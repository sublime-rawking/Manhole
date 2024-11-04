"use client"
import { fetchDeviceData } from '@/services/device.service';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function DevicesIConfigPage({ params }) {
    const devicesId = useParams()
    console.log(devicesId);
    const [device, setDevice] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchDeviceData(true);
                setDevice(result.data);
                console.log(result);

                // setDevice(sliceData(result.data, page, 10));
            } catch (error) {
                // Handle the error as needed
                console.error('API call error:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='w-full h-full p-2 flex flex-col'>

            <div className='justify-center w-[40%]  h-1/2  px-2 relative  rounded-sm'>
                <MapContainer zoom={13} center={[19.024842, 73.02202]} style={{ height: '100%', width: '100%', borderRadius: "10px" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {device.map((location, index) => (
                        <Marker key={index} position={[location.lat, location.lng]}
                            icon={Icon

                            }

                        >
                            <Popup>
                                Latitude: {location.lat}, Longitude: {location.lng}
                            </Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </div>


    )
}
