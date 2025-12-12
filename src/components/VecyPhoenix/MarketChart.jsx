
import React from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const MarketChart = () => {
    const data = {
        datasets: [
            {
                label: 'Comparables Mercado',
                data: [
                    { x: 74, y: 408 },
                    { x: 75, y: 420 },
                    { x: 81, y: 370 },
                    { x: 72, y: 415 },
                    { x: 73, y: 424 }
                ],
                backgroundColor: '#0ea5e9', // Sky Blue 500
                pointRadius: 6,
                pointHoverRadius: 8
            },
            {
                label: 'SUJETO (Propuesta)',
                data: [{ x: 72, y: 375 }], // Updated to 375M
                backgroundColor: '#d97706', // Amber 600
                pointRadius: 10,
                pointHoverRadius: 12,
                pointStyle: 'star'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#cbd5e1', // Slate 300
                    font: { family: "'Inter', sans-serif" }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return `$${context.raw.y}M (${context.raw.x}m²)`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Precio (Millones COP)', color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#cbd5e1' }
            },
            x: {
                title: { display: true, text: 'Área (m²)', color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#cbd5e1' }
            }
        }
    };

    return <Scatter options={options} data={data} />;
};

export default MarketChart;
