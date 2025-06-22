// frontend/src/components/Dashboard.js

import React, { useEffect, useState } from "react";
import "../assets/styles/Dashboard.css";
import { fetchDeviceData, updateDeviceStatus } from "../utils/apiService";
import { Responsive, WidthProvider } from "react-grid-layout";
import Widget from "./Widget";
import RealTimeChart from "./RealTimeChart";
import DeviceControl from "./DeviceControl";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
    const [layout, setLayout] = useState([]);
    const [widgets, setWidgets] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize Layout
    const defaultLayout = [
        { i: "device1", x: 0, y: 0, w: 3, h: 4 },
        { i: "graph1", x: 3, y: 0, w: 6, h: 4 },
        { i: "control1", x: 9, y: 0, w: 3, h: 4 },
    ];

    // Fetch device data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const devices = await fetchDeviceData();
                setDeviceData(devices);
                setWidgets([
                    {
                        id: "graph1",
                        type: "chart",
                        title: "Temperature & Humidity",
                    },
                    {
                        id: "control1",
                        type: "control",
                        title: "Device Control",
                    },
                    ...devices.map((device, index) => ({
                        id: `device${index + 1}`,
                        type: "device",
                        title: device.name,
                        deviceId: device.id,
                        status: device.status,
                    })),
                ]);
                setLayout(defaultLayout);
            } catch (err) {
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle Widget Layout Change
    const onLayoutChange = (currentLayout) => {
        setLayout(currentLayout);
    };

    // Render Widgets Dynamically
    const renderWidget = (widget) => {
        switch (widget.type) {
            case "chart":
                return <RealTimeChart title={widget.title} />;
            case "control":
                return <DeviceControl />;
            case "device":
                return <Widget deviceId={widget.deviceId} title={widget.title} />;
            default:
                return <div>Unknown Widget</div>;
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Dashboard</h1>
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={30}
                onLayoutChange={onLayoutChange}
            >
                {widgets.map((widget) => (
                    <div key={widget.id} className="widget-box">
                        {renderWidget(widget)}
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};

export default Dashboard;