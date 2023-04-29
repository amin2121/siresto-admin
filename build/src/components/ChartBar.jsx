import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};


const ChartBar = ({ data, title }) => {
    const labels = data.map((value) => value.label);

    const dataChart = {
      labels,
      datasets: [
        {
          label: title,
          data: data.map((value) => value.value),
          backgroundColor: '#3B82F6',
        },
      ],
    };


    return <Bar options={options} data={dataChart}/>;
};

export default ChartBar;
