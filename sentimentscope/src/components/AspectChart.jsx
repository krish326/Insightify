// src/components/AspectChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AspectChart({ aspectBreakdown }) {
  if (!aspectBreakdown || Object.keys(aspectBreakdown).length === 0) {
    return <p className="text-center text-gray-500">No aspect data available.</p>;
  }

  const chartData = {
    labels: Object.keys(aspectBreakdown).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [
      {
        label: 'Positive',
        data: Object.values(aspectBreakdown).map(d => d.positive),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Negative',
        data: Object.values(aspectBreakdown).map(d => d.negative),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Neutral',
        data: Object.values(aspectBreakdown).map(d => d.neutral),
        backgroundColor: 'rgba(201, 203, 207, 0.6)',
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    scales: { x: { stacked: true }, y: { stacked: true } },
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Sentiment Breakdown by Product Feature', font: { size: 18 } },
    },
  };

  return <Bar options={options} data={chartData} />;
}

export default AspectChart;