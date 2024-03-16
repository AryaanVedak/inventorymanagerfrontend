import { useState, useEffect } from 'react';
import { LineChart  } from '@mui/x-charts';

// eslint-disable-next-line react/prop-types
function MonthlyIncomeBarChart({ transactions }) {
  const [monthwiseGSTData, setMonthwiseGSTData] = useState([]);

  useEffect(() => {
    const extractMonthwiseEarningData = (transaction) => {
      const monthwiseGSTData = [];
      transaction.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const month = transactionDate.getMonth(); // Get 0-indexed month
  
        const existingMonthData = monthwiseGSTData.find(
          (monthData) => monthData.month === getMonthName(month) // Use month name
        );
  
        if (existingMonthData) {
          existingMonthData.totalGST += transaction.gst;
          existingMonthData.payment += transaction.taxable;
        } else {
          monthwiseGSTData.push({
            month: getMonthName(month), 
            payment: transaction.taxable,
            totalGST: transaction.gst,
          });
        }
      });
      return monthwiseGSTData;
    };
  
    const getMonthName = (monthNumber) => {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[monthNumber];
    };
  
    const data = extractMonthwiseEarningData(transactions);
    setMonthwiseGSTData(data);
  }, [transactions]);
  
  return (
    <div>
      {/* <h2>GST Data by Month</h2> */}
      {monthwiseGSTData.length > 0 && (
        <LineChart 
          dataset={monthwiseGSTData} // Use monthwiseGSTData directly
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[
            // { dataKey: 'totalGST', label: 'GST' }, 
            { dataKey: 'payment', label: 'Total without GST' }, 
          ]}
          // width={500}
          height={300}
        />
      )}
    </div>
  );
}

export default MonthlyIncomeBarChart;
