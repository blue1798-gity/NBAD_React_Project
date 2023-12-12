//Addexpense.js
import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/Addexpense.css'; 
import config from '../../config';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

const Addexpense = ({ token }) => {
  const [category, setCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddBudget = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/api/budgets`,
        { budgetName: category, budgetNumber: budgetAmount, selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.success('Budget added successfully', {
        position: 'top-right',
        effect: 'slide',
        timeout: 3000,
      });

      setCategory('');
      setBudgetAmount('');
      setSelectedDate(new Date());
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      Alert.error(`Error: ${errorMessage}`, {
        position: 'top-right',
        effect: 'slide',
        timeout: 3500,
      });
    }
  };

  return (
    <div className="create-budget-container">
      <h2>New Expense</h2>
      <div className="input-group">
        <label>Date:</label>
        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="number"
          placeholder="Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
        />
      </div>
      <button className="create-button" onClick={handleAddBudget}>
        Add Expense
      </button>
      <Alert stack={{ limit: 3 }} />
    </div>
  );
};

export default Addexpense;
