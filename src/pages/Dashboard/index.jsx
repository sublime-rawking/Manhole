import React, { useEffect } from "react";
// import DashboardHeader from "../../components/DashboardHeader";
// import Header from "../../components/Headers";
// import ChartComponent from "../../components/Charts";
// import { withProtected } from "../../context/protectedroutes.js";
// import { calculateRange, sliceData } from "../../utils/table-pagination";

import "../styles.css";

function Dashboard() {
    useEffect(() => {
        // fetchData();
    }, []);

    return (
        <div className="dashboard-content">
            {/* <DashboardHeader btnText="New Order" />
            <Header data={[]} />
            <ChartComponent data={[]} /> */}

            {/* User Name MODEL */}

            <div className="dashboard-content-container">
                <h2>DASHBOARD</h2>
            </div>
        </div>
    );
}

// export default withProtected(Dashboard);
export default Dashboard;
