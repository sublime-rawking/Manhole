import L from 'leaflet';
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { pinIcon } from '../../assets/index.js';
// import { withProtected } from "../../context/protectedroutes.js";
import "../styles.css";

const customIcon = L.icon({
  iconUrl: pinIcon, // Replace with your PNG image path
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


function MapView() {
  const [locations, setLocations] = useState([]);

  // const position = [19.024842, 73.02202];

  useEffect(() => {
    setLocations([
      { lat: 19.024842, lng: 73.02202 },
      { lat: 19.022916887633222, lng: 73.01822716998315 },
      { lat: 19.024596198488332, lng: 73.0218332354378 },
      { lat: 19.024497, lng: 73.022029 },
      { lat: 19.024455, lng: 73.022241 },
      { lat: 19.024408, lng: 73.022385 },
      { lat: 19.21743960425978, lng: 72.97707986673828 },
    ])
  }, []);
  console.log("LOCATION : : ", locations)

  return (
    <div className="dashboard-content">
      {/* <DashboardHeader btnText="New Order" /> */}

      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h3 className="fw-bold">Map View</h3>
          <div className="dashboard-content-search">
            {/* <input
              type="text"
              placeholder="Search.."
              className="dashboard-content-input"
            /> */}
          </div>
        </div>

        <div style={{ height: '100%', width: '100%' }}>
          <MapContainer center={[19.024842, 73.02202]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((location, index) => (
              <Marker key={index} position={[location.lat, location.lng]} icon={customIcon} >
                <Popup>
                  Latitude: {location.lat}, Longitude: {location.lng}
                </Popup>
              </Marker>
            ))}

          </MapContainer>

        </div>


        {/* <table>
          <thead>
            <th key="no">TRIP ID</th>
            <th key="date">DATE</th>
            <th key="from">FROM</th>
            <th key="to">TO</th>
            <th key="weight">WEIGHT LIMIT</th>
            <th key="user">TRAVELLER NAME</th>
            <th key="id">USER ID</th>
          </thead>

          {trips.length !== 0 ? (
            <tbody>
              {trips.map((trip, index) => (
                <tr key={trip.id}>
                  <td>
                    <span>{trip.id}</span>
                  </td>
                  <td>
                    <span>
                      {moment(trip.date_of_arrival).format("DD-MM-YYYY")}
                    </span>
                  </td>
                  <td>
                    <span>{trip.from_destination[0].country}</span> -{" "}
                    <span>{trip.from_destination[0].city}</span>
                  </td>
                  <td>
                    <span>{trip.to_destination[0].country}</span> -{" "}
                    <span>{trip.to_destination[0].city}</span>
                  </td>
                  <td>
                    <span>{trip.weight_limit[0].value}</span>
                    <span>{trip.weight_limit[0].unit}</span>
                  </td>
                  <td>
                    <div onClick={() => onPressUserName(trip.userId)}>
                      <img
                        src={IMAGE_URL + trip.image}
                        className="dashboard-content-avatar"
                        alt={trip.userName}
                      />
                      <span>{trip.userName}</span>
                    </div>
                  </td>
                  <td>
                    <span>{trip.userId}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {trips.length !== 0 ? (
          <div className="dashboard-content-footer">
            {pagination.map((item, index) => (
              <span
                key={index}
                className={item === page ? "active-pagination" : "pagination"}
                onClick={() => __handleChangePage(item)}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className="dashboard-content-footer">
            <span className="empty-table">No data</span>
          </div>
        )} */}

        
      </div>
    </div >
  );
}

// export default withProtected(MapView);
export default MapView;
