//CapExpense.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import apiService from '../services/apiService';
import '../../styles/CapExpense.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import Alert from 'react-s-alert';

const CapExpense = ({ onAddBudgetCapacity, username, token }) => {
  const [budgetName, setBudgetName] = useState('');
  const [budgetNumber, setBudgetNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addBudgetMessage, setAddBudgetMessage] = useState('');
  const [capacityData, setCapacityData] = useState([]);

  const handleAddBudgetCapacity = async () => {
    try {
      if (typeof onAddBudgetCapacity !== 'function') {
        console.error('onAddBudgetCapacity is not a function');
        return;
      }

      const data = { budgetName, budgetNumber, selectedMonth: parseInt(selectedMonth, 10) };
      const response = await onAddBudgetCapacity(data);

      if (response && response.success) {
        setAddBudgetMessage(response.message);
        Alert.success(response.message, {
          position: 'top-right',
          effect: 'slide',
          timeout: 3000,
        });
        
        setBudgetName('');
        setBudgetNumber('');
        setSelectedMonth('');
      } else {
        console.error('Failed to add budget capacity:', response ? response.message : 'Unknown error');
        setAddBudgetMessage(response ? response.message : 'Failed to add budget capacity');
        Alert.error(response ? response.message : 'Failed to add budget capacity', {
          position: 'top-right',
          effect: 'slide',
          timeout: 3500,
        });
      }
    } catch (error) {
      console.error('Error adding budget capacity:', error.message);
      setAddBudgetMessage('Error adding budget capacity');
      Alert.error('Error adding budget capacity', {
        position: 'top-right',
        effect: 'slide',
        timeout: 3500,
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const capacityEndpoint = selectedMonth
    ? `/budgets/capacity/${selectedMonth}`
    : '/budgets/capacity';

  useEffect(() => {
    const fetchCapacityData = async () => {
      try {
        const response = await apiService.get(capacityEndpoint, token);
        setCapacityData(response.data || []);
      } catch (error) {
        console.error('Error fetching capacity data:', error);
      }
    };

    fetchCapacityData();
  }, [capacityEndpoint, token]);

  return (
    <div className="budget-container">
      <div className="add-budget-box">
        <h3 className="header">Welcome!!Happily Add Your Expense here</h3>
        <div className="form-group">
          <label htmlFor="selectedMonth">Select Month:</label>
          <select
            id="selectedMonth"
            className="select-dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Select Month</option>
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
        </div>
        <div className="form-group">
          <label htmlFor="budgetName">Category of Expense:</label>
          <input
            id="budgetName"
            className="input-field"
            type="text"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="budgetNumber">Amount of Expense:</label>
          <input
            id="budgetNumber"
            className="input-field"
            type="text"
            value={budgetNumber}
            onChange={(e) => setBudgetNumber(e.target.value)}
          />
        </div>
        <button className="add-budget-button" onClick={handleAddBudgetCapacity}>
        Record a New Expense Category
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Budget Message"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{addBudgetMessage}</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>

      <Alert stack={{ limit: 3 }} />
    </div>
  );
};

export default CapExpense;
