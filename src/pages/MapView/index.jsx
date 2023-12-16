import L from 'leaflet';
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { pinIcon } from '../../assets/index.js';
import { calculateRange, sliceData } from '../../utils/table-pagination';
import { cityDataArr, locationData } from '../../constants/data.js';
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
  const [cityData, setCityData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [search, setSearch] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [currentPageSchedule, setCurrentPageSchedule] = useState(1); // State for current page
  const [endIndexData, setEndIndexData] = useState(1); // State for current page

  // const position = [19.024842, 73.02202];

  useEffect(() => {
    // set locations data
    setLocations(locationData);

    // set city data
    setCityData(cityDataArr);
    setOriginalData(cityDataArr);
    setPagination(calculateRange(cityDataArr, 10));
    setCityData(sliceData(cityDataArr, page, 10));

  }, [page]);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = originalData.filter((item) =>
        item.city.toLowerCase().includes(search.toLowerCase())
      );
      setCityData(search_results);
    }
    else {
      __handleChangePage(1);
      setCityData(originalData);

    }
  };

  // Change Page 
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setCityData(sliceData(cityData, new_page, 10));
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
      setCityData(sliceData(cityData, page, 10));

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
    setCityData(sliceData(cityData, page, 10));

  };

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

        <div className="dashboard-content-header">
          <h3 className="fw-bold">Table Data</h3>
          <div className="dashboard-content-search">
            <input
              type="text"
              placeholder="Search.."
              className="dashboard-content-input"
              onChange={(e) => __handleSearch(e)}
            />
          </div>
        </div>

        <table>
          <thead>
            <th key="no">SR NO.</th>
            <th key="date">CITY</th>
            {/* <th key="from">LOCATION</th> */}
            <th key="to">COUNT</th>
          </thead>

          {cityData.length !== 0 ? (
            <tbody>
              {cityData.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    {index + 1}
                  </td>
                  <td>
                    {item.city}
                  </td>
                  {/* <td>
                    {item.locationArr[0].lat},{item.locationArr[0].lng}
                  </td> */}
                  <td>
                    {item.random_number}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {cityData.length !== 0 ? (
          <div className="dashboard-content-footer">
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
        ) : (
          <div className="dashboard-content-footer">
            <span className="empty-table">No data</span>
          </div>
        )}


      </div>
    </div >
  );
}

// export default withProtected(MapView);
export default MapView;
