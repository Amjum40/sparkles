import React, { useState, useEffect } from 'react';
import axios from '../config/api';

const PeriodTracker = ({ user }) => {
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCycles();
    }, []);

    const fetchCycles = async () => {
        try {
            const res = await axios.get(`/api/cycles/${user.id}`);
            setCycles(res.data.cycles);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const logPeriod = async () => {
        const today = new Date().toISOString().split('T')[0];
        try {
            await axios.post('/api/cycles', { userId: user.id, startDate: today });
            fetchCycles();
            alert('Period logged for today!');
        } catch (err) {
            alert('Failed to log period.');
        }
    };

    return (
        <div className="card">
            <h3>Period Tracker</h3>
            <button onClick={logPeriod} style={{ marginBottom: '10px' }}>Log Period Start (Today)</button>
            {loading ? <p>Loading history...</p> : (
                <ul>
                    {cycles.map((cycle) => (
                        <li key={cycle.id}>Started: {cycle.start_date}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PeriodTracker;
