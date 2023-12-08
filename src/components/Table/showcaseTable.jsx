// import React, { useState } from 'react'
// import { sliceData } from '../../utils/table-pagination';
// import moment from 'moment';
// export default function ShowCaseTable(
//     {
//         closeModel,
//         tableData,
//         fetchData
//     }

// ) {
//     const IMAGE_URL = process.env.REACT_APP_API_IMAGE_URL;
//     const [page, setPage] = useState(1);
//     const [pageData, setPageData] = useState([]);


//     const __handleChangePage = (new_page) => {
//         setPage(new_page);   
//         setPageData(sliceData(pageData, new_page, 10));

//     }

//     const __handleSearch = (event) => {
//         let search = event.target.value;
//         if (event.target.value !== '') {

//             let search_results = tableData.filter((item) =>
//                 item.date_of_arrival.toLowerCase().includes(search.toLowerCase()) ||
//                 item.from_destination[0].country.toLowerCase().includes(search.toLowerCase()) ||
//                 item.to_destination[0].country.toLowerCase().includes(search.toLowerCase()) ||
//                 item.userName.toLowerCase().includes(search.toLowerCase())
//             );

//         }
//         else {
//             fetchData();
//             __handleChangePage(1);
//         }
//     }

//     return <>
//         <div className='dashboard-content-container'>
//             <div className='dashboard-content-header'>
//                 <h2>Trip Details</h2>
//                 <div className='dashboard-content-search'>
//                     <button onClick={closeModel} className="button-81" >CLOSE</button>
//                     <input
//                         type='text'
//                         placeholder='Search..'
//                         className='dashboard-content-input'
//                         onChange={e => __handleSearch(e)} />
//                 </div>
//             </div>

//             <table>
//                 <thead>
//                     <th key="no">SR NO.</th>
//                     <th key="date">DATE</th>
//                     <th key="from">FROM</th>
//                     <th key="to">TO</th>
//                     <th key="weight">WEIGHT LIMIT</th>
//                     <th key="user">USER NAME</th>
//                 </thead>

//                 {tableData.data.length !== 0 ?
//                     <tbody>
//                         {tableData.data.map((data, index) => (
//                             // <tr key={user.id} onClick={() => openModal(user)}>
//                             <tr key={index}>
//                                 tableData.keys.map((item)={
//                                     <td><span>{data.item}</span></td>
//                                 })
//                                 <td><span>{tableData.keys[2]}</span></td>
//                                 <td><span>{tableData.keys[3]}</span></td>
//                                 <td><span>{tableData.keys[4]}</span></td>
//                                 <td><span>{tableData.keys[5]}</span><span>{tableData.keys[6]}</span></td>
//                                 <td>
//                                     <div>
//                                         <img
//                                             src={IMAGE_URL + tableData.keys[7]}
//                                             className='dashboard-content-avatar'
//                                             alt={trip.userName} />
//                                         <span>{trip.userName}</span>
//                                     </div>
//                                 </td>
//                             </tr>
//                             // <tr key={trip.id}>
//                             //     <td><span>{index + 1}</span></td>
//                             //     <td><span>{moment(trip.date_of_arrival).format('DD-MM-YYYY')}</span></td>
//                             //     <td><span>{trip.from_destination[0].country}</span></td>
//                             //     <td><span>{trip.to_destination[0].country}</span></td>
//                             //     <td><span>{trip.weight_limit[0].value}</span><span>{trip.weight_limit[0].unit}</span></td>
//                             //     <td>
//                             //         <div>
//                             //             <img
//                             //                 src={IMAGE_URL + trip.image}
//                             //                 className='dashboard-content-avatar'
//                             //                 alt={trip.userName} />
//                             //             <span>{trip.userName}</span>
//                             //         </div>
//                             //     </td>
//                             // </tr>
//                         ))}
//                     </tbody>
//                     : null}
//             </table>

//             {tableData.length === 0 &&
//                 <div className='dashboard-content-footer'>
//                     <span className='empty-table'>No data</span>
//                 </div>
//             }
//         </div>
//     </>



// }
