import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { GrafikPermintaanBukuResponse } from '../interface/TrenPermintaanBuku';

interface PermintaanBukuChartProps {
  data: GrafikPermintaanBukuResponse[];
  selectedCabangsCount: number;
}

// Function to convert month number to month name
const getMonthName = (month: number): string => {
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  return monthNames[month - 1];
};

const generateColors = (count: number) => {
  const baseColors = [
    '#8884d8', "#C71585", '#177978', '#ff7300', "#8A2BE2", "#B8860B", "#C50C3D",
    '#00c49f', '#0088FE', '#FF8042', '#1f8e18', "#DC143C", "#808000", '#8e1882'
  ];
  return Array.from({ length: count }, (_, index) => baseColors[index % baseColors.length]);
};

const PermintaanBukuChart: React.FC<PermintaanBukuChartProps> = ({ data, selectedCabangsCount }) => {
  // Step 1: Sort data by year and month
  const sortedData = data.sort((a, b) => {
    const [monthA, yearA] = a.monthYear.split('-').map(Number);
    const [monthB, yearB] = b.monthYear.split('-').map(Number);
    return yearA === yearB ? monthA - monthB : yearA - yearB;
  });

  // Step 2: Extract all unique monthYear values
  const monthYears = Array.from(new Set(sortedData.map(d => d.monthYear)));
  
  // Step 3: Group by monthYear, then populate each cabang's data
  const structuredData = monthYears.map(month => {
    const entry: any = { monthYear: month };
    const [monthNum, year] = month.split('-').map(Number); // Split and convert to numbers
    entry.monthYearString = `${getMonthName(monthNum)}-${year}`; // Set monthYearString
    sortedData.filter(d => d.monthYear === month).forEach(d => {
      entry[d.nomorCabang] = d.totalOrders;
    });
    return entry;
  });
  
  // Step 4: Get all unique nomorCabang and sort them
  const cabangs = Array.from(new Set(data.map(d => d.nomorCabang)))
    .sort((a, b) => {
      const numA = isNaN(Number(a)) ? Infinity : Number(a);
      const numB = isNaN(Number(b)) ? Infinity : Number(b);
      return numA - numB; // Sort numerically
    });
  
  const colors = generateColors(selectedCabangsCount);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={structuredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthYearString" />
        <YAxis />
        <Tooltip />
        <Legend />
        {cabangs.map((cabang, index) => (
          <Line
            key={cabang}
            type="monotone"
            dataKey={cabang}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PermintaanBukuChart;