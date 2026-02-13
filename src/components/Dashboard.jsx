import React from 'react';
import PeriodTracker from './PeriodTracker';
import PadRequest from './PadRequest';
import NearbyRequests from './NearbyRequests';

const Dashboard = ({ user, onLogout }) => {
    return (
        <div className="dashboard-container">
            <div className="header">
                <h2>{user.username}'s Safe Space</h2>
                <button onClick={onLogout} className="logout-btn">Lock & Logout</button>
            </div>

            <PeriodTracker user={user} />
            <PadRequest user={user} />
            <NearbyRequests user={user} />

            <div className="card">
                <h3>Community Support</h3>
                <p>Connect with verified helpers nearby.</p>
                <button style={{ marginTop: '10px' }}>Find Helpers</button>
            </div>
        </div>
    );
};

export default Dashboard;
