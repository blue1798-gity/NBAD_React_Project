//Chart.js
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import apiService from '../services/apiService';
import '../../styles/EconomicChart.css';

const EconomicChart = ({ token }) => {
  const barChartCanvasRef = useRef(null);
  const areaChartCanvasRef = useRef(null);
  const pieChartCanvasRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState([]);
  const [budgetCapacity, setBudgetCapacity] = useState([]);

  useEffect(() => {
    const fetchDataAndCreateCharts = async () => {
      try {
        const budgetEndpoint = selectedMonth
          ? `/budgets/getAllBudgets/${selectedMonth}`
          : '/budgets/getAllBudgets';

        const capacityEndpoint = selectedMonth
          ? `/budgets/capacity/${selectedMonth}`
          : '/budgets/capacity';

        const [budgetResponse, capacityResponse] = await Promise.all([
          apiService.get(budgetEndpoint, token, {
            params: { month: parseInt(selectedMonth, 10) },
          }),
          apiService.get(capacityEndpoint, token),
        ]);

        const budgetData = budgetResponse.data || [];
        const capacityData = capacityResponse.data || [];

        setBudgetData(budgetData);
        setBudgetCapacity(capacityData);
        setLoading(false);

        createBarChart();
        pieChartCanvasRef();
        createAreaChart();
        
      } catch (error) {
        console.error('Error fetching budget data: ', error);
        setLoading(false);
      }
    };

    fetchDataAndCreateCharts();
  }, [token, selectedMonth]);

  useEffect(() => {
    if (!loading) {
      createBarChart();
      createPieChart();
      createAreaChart();
      
    }
  }, [loading, budgetData, budgetCapacity]);


  const createAreaChart = () => {
    const canvas = areaChartCanvasRef.current; // Use the new canvas ref
    if (!canvas) {
      console.error('Area Chart Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for Area Chart canvas');
      return;
    }

    try {
      if (canvas.chart) {
        canvas.chart.destroy();
      }

      const combinedData = budgetData.map(dataItem => {
        const matchingCapacity = budgetCapacity.find(capacityItem => capacityItem.budgetname === dataItem.budgetname);
        return {
          budgetName: dataItem.budgetname,
          actualExpenditure: dataItem.budgetnumber,
          budgetCapacity: matchingCapacity ? matchingCapacity.budgetnumber : null,
        };
      });

      const chartData = {
        labels: combinedData.map(item => item.budgetName),
        datasets: [
          {
            label: 'Actual Expenditure',
            backgroundColor: 'rgba(255, 51, 162, 0.5)',
            borderColor: 'rgba(255, 51, 162, 1)',
            borderWidth: 1,
            fill: true, 
            data: combinedData.map(item => item.actualExpenditure),
          },
          {
            label: 'Budget',
            backgroundColor: 'rgba(126, 51, 162, 0.5)',
            borderColor: 'rgba(126, 51, 162, 1)',
            borderWidth: 1,
            fill: true, 
            data: combinedData.map(item => item.budgetCapacity),
          },
        ],
      };

      canvas.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            x: { stacked: true }, 
            y: { stacked: true }, 
          },
        },
      });
    } catch (error) {
      console.error('Error creating area chart: ', error);
    }
  };
  const createPieChart = () => {
    const pieCanvas = pieChartCanvasRef.current;

    if (!pieCanvas) {
      console.error('Pie Canvas element not found');
      return;
    }

    const pieCtx = pieCanvas.getContext('2d');
    if (!pieCtx) {
      console.error('Unable to get 2D context for pie canvas');
      return;
    }

    try {
      if (pieCanvas.chart) {
        pieCanvas.chart.destroy();
      }

      const combinedData = budgetData.map(dataItem => {
        const matchingCapacity = budgetCapacity.find(capacityItem => capacityItem.budgetname === dataItem.budgetname);
        return {
          budgetname: dataItem.budgetname,
          actualExpenditure: dataItem.budgetnumber,
          budgetCapacity: matchingCapacity ? matchingCapacity.budgetnumber : null,
        };
      });

      const pieData = combinedData.map((item, index) => {
        const actualExpenditure = item.actualExpenditure || 0;
        const budgetCapacity = item.budgetCapacity || 0;
        const remainingBudget = budgetCapacity - actualExpenditure;

        const backgroundColors = [
          '#FF5733', '#33FF7E', '#33A2FF', '#FF33A2', '#7E33FF', '#FF7E33', '#33FFA2', '#A2FF33', '#FF3333', '#33FF33',
          '#FFA233', '#FF33F5', '#7E7E7E', '#3333FF', '#7E33A2', '#7E33FF', '#33A2A2', '#33FF33', '#FFA27E', '#33A233',
        ];
        

        return {
          label: item.budgetname,
          data: [actualExpenditure, remainingBudget],
          backgroundColor: backgroundColors[index % backgroundColors.length],
        };
      });

      console.log('pieChartData:', pieData);

      pieCanvas.chart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: pieData.map(item => item.label),
          datasets: [{
            data: pieData.map(item => item.data[0]),
            backgroundColor: pieData.map(item => item.backgroundColor),
          }],
        },
      });
    } catch (error) {
      console.error('Error creating pie chart: ', error);
    }
  };




  const createBarChart = () => {
    const canvas = barChartCanvasRef.current;
    if (!canvas) {
      console.error('Bar Chart Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for Bar Chart canvas');
      return;
    }

    try {
      if (canvas.chart) {
        canvas.chart.destroy();
      }

      const combinedData = budgetData.map(dataItem => {
        const matchingCapacity = budgetCapacity.find(capacityItem => capacityItem.budgetname === dataItem.budgetname);
        return {
          budgetName: dataItem.budgetname,
          actualExpenditure: dataItem.budgetnumber,
          budgetCapacity: matchingCapacity ? matchingCapacity.budgetnumber : null,
        };
      });

      const chartData = {
        labels: combinedData.map(item => item.budgetName),
        datasets: [
          {
            label: 'Actual Expenditure',
            backgroundColor: '#FF33A2',
            data: combinedData.map(item => item.actualExpenditure),
          },
          {
            label: 'Budget',
            backgroundColor: '#7E33A2', 
            data: combinedData.map(item => item.budgetCapacity),
          },
        ],
      };

      canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            x: { stacked: true }, 
            y: { stacked: true }, 
          },
        },
      });
    } catch (error) {
      console.error('Error creating bar chart: ', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="budget-chart">
      <h3>Multiple of Budget Analysis</h3>
      <div className="label-container">
        <label>
          Select Month:
          <select value={selectedMonth} onChange={handleMonthChange} className="select-dropdown">
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </label>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="scrollable-container">
          <div className="charts-container">
            <div className="chart">
              <h3>Budget Allocation for the Current Period Compared to Cumulative Budget</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-canvas" ref={barChartCanvasRef}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
            </div>
            <div className="chart">
              <h3>Budget Allocation for the Current Period</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-pie-canvas" ref={pieChartCanvasRef}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
            </div>
            <div className="chart">
              <h3>Budget Allocation for the Current Period Compared to Cumulative Budget on Area Chart</h3>
              {budgetData.length > 0 && budgetCapacity.length > 0 && (
                <canvas className="budget-area-canvas" ref={areaChartCanvasRef}></canvas>
              )}
              {budgetData.length === 0 && budgetCapacity.length > 0 && <p>No budget data available.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomicChart;