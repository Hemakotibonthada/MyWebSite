// frontend/src/components/Widget.js

import React, { useState, useEffect } from "react";
import { fetchDeviceStatus } from "../utils/apiService";

const Widget = ({ deviceId, title }) => {
    const [status, setStatus] = useState("offline");

    useEffect(() => {
        const fetchStatus = async () => {
            const data = await fetchDeviceStatus(deviceId);
            setStatus(data.status);
        };

        fetchStatus();
    }, [deviceId]);

    return (
        <div className="widget">
            <h3>{title}</h3>
            <p>Status: {status}</p>
        </div>
    );
};

export default Widget;