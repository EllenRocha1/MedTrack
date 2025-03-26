import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MeuGrafico = ({ dados }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: dados,
            options: { responsive: true }
        });

        return () => {
            chartInstance.current.destroy();
        };
    }, [dados]);

    return <canvas ref={chartRef}></canvas>;
};
