// src/components/OverallSentimentChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function OverallSentimentChart({ reviewAnalyses }) {
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

  reviewAnalyses.forEach(review => {
    const sentiment = review.overallSentiment.toLowerCase();
    if (sentiment.includes('positive')) sentimentCounts.positive++;
    else if (sentiment.includes('negative')) sentimentCounts.negative++;
    else sentimentCounts.neutral++;
  });

  const data = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      data: [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral],
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(201, 203, 207, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(201, 203, 207, 1)'],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Overall Review Sentiment', font: { size: 18 } },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default OverallSentimentChart;