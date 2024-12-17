// frontend/src/components/RealTimeChart.js

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const RealTimeChart = ({ title }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev) => [...prev, Math.random() * 100]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="chart">
            <h3>{title}</h3>
            <Line
                data={{
                    labels: Array.from({ length: data.length }, (_, i) => i),
                    datasets: [
                        {
                            label: "Real-Time Data",
                            data,
                            borderColor: "rgb(75, 192, 192)",
                            tension: 0.1,
                        },
                    ],
                }}
            />
        </div>
    );
};

export default RealTimeChart;