import React from "react";
import { withProtected } from "../../context/protectedRoutes.js";

import "../styles.css";

function Dashboard() {

    return (
        <div className="dashboard-content">
            <div className="dashboard-content-container">
                <h2>DASHBOARD</h2>
            </div>
        </div>
    );
}

export default withProtected(Dashboard);
