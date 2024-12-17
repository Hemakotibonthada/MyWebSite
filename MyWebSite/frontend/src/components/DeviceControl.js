// frontend/src/components/DeviceControl.js

import React from "react";

const DeviceControl = () => {
    const handleControl = (action) => {
        alert(`Device turned ${action}`);
    };

    return (
        <div className="device-control">
            <h3>Device Control</h3>
            <button onClick={() => handleControl("on")}>Turn On</button>
            <button onClick={() => handleControl("off")}>Turn Off</button>
        </div>
    );
};

export default DeviceControl;