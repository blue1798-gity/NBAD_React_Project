// PersonalDash.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AddBudget from './Addexpense';
import BudgetList from './ViewExpense';
import BudgetChart from './Charts';
import AddBudgetCapacity from './CapExpense';
import { useUserAuth } from '../Auth/AuthenticationState'; 
import '../../styles/PersonalDash.css'; 
import config from '../../config';

const BASE_URL = config.apiUrl;

const PersonalDash = ({ token, username }) => {
  const {
    logout,
    checkUserTokenExpiration,
    
  } = useUserAuth();

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showBudgetList, setShowBudgetList] = useState(false);
  const [showBudgetChart, setShowBudgetChart] = useState(false);
  const [showAddBudgetCapacity, setShowAddBudgetCapacity] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isTokenRefreshed, setIsTokenRefreshed] = useState(false);

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmationYes = async () => {
    
    setIsTokenRefreshed(true);
    setShowConfirmationModal(false);
    try {
      console.log('Refreshing token...');
      console.log('Token refreshed successfully...');
      
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };
  const handleConfirmationNo = () => {
    
    setShowConfirmationModal(false);
    window.location.reload();
  };

  const handleAddBudgetClick = () => {
    setShowAddBudget(true);
    setShowBudgetList(false);
    setShowBudgetChart(false);
    setShowAddBudgetCapacity(false);
  };

  const handleBudgetListClick = () => {
    setShowAddBudget(false);
    setShowBudgetList(true);
    setShowBudgetChart(false);
    setShowAddBudgetCapacity(false);
  };

  const handleBudgetChartClick = () => {
    setShowAddBudget(false);
    setShowBudgetList(false);
    setShowBudgetChart(true);
    setShowAddBudgetCapacity(false);
  };

  const handleAddBudgetCapacityClick = () => {
    setShowAddBudget(false);
    setShowBudgetList(false);
    setShowBudgetChart(false);
    setShowAddBudgetCapacity(true);
  };

  const handleLogout = () => {
    window.location.reload();
    logout();
  };

  const handleAddBudgetCapacity = async (data) => {
   
    try {
      const apiUrl = BASE_URL + '/api/budgets/capacity';
      data.username = username;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(data),
      });

      let responseData;

      if (response.ok) {
        responseData = await response.json();
        return { success: true, message: 'Budget capacity added successfully', responseData };
      } else {
        console.error('Failed to add budget capacity:', response.statusText);

        const errorData = await response.json();
        console.error('Error Data:', errorData);

        throw new Error('Failed to add budget capacity');
      }
    } catch (error) {
      console.error('Error adding budget capacity:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true; 
  
    console.log('Setting up token refresh interval...');
    const tokenRefreshInterval = setInterval(async () => {
      if (!isTokenRefreshed && isMounted) {
        console.log('Token about to expire. Displaying confirmation modal...');
        setShowConfirmationModal(true);
        setTimeout(async () => {
          if (!isTokenRefreshed && isMounted) {
            setShowConfirmationModal(false);
            try {
              console.log('Refreshing token...');
              if (isMounted) {
                setIsTokenRefreshed(true); 
                console.log('Token refreshed successfully.');
                window.location.reload();
              }
            } catch (error) {
              console.error('Error refreshing token:', error);
              logout();
              window.location.reload();
            }
          } else {
            setShowConfirmationModal(false);
          }
        }, 20000);
      }
    }, 40000);
    return () => {
      console.log('Clearing token refresh interval...');
      clearInterval(tokenRefreshInterval);
      isMounted = false; 
    };
  }, [isTokenRefreshed, logout, checkUserTokenExpiration]);

  return (
    <div className="personal-dashboard">
      <div className="header">
        <h1 className="personal-budget">Budgeting Made Simple</h1>
        <p className="personal-budget-description">Empower Your Financial Future</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-buttons">
        <button onClick={handleBudgetListClick}>View Financial Records</button>
        <button onClick={handleBudgetChartClick}>Finanace Analysis Chart</button>
        <button onClick={handleAddBudgetClick}>Add New Expense</button>
        <button onClick={handleAddBudgetCapacityClick}>Customize Budget</button>
      </div>

      <div className="dashboard-content">
        {showAddBudget && (
          <div className="centered-component add-budget-component">
            <AddBudget token={token} /> 
          </div>
        )}
        {showBudgetList && (
          <div className="centered-component budget-list-component">
            <BudgetList token={token} /> 
          </div>
        )}
        {showBudgetChart && (
          <div className="centered-component budget-chart-component">
            <BudgetChart token={token} /> 
          </div>
        )}
        {showAddBudgetCapacity && (
          <div className="centered-component add-budget-capacity-component">
            <AddBudgetCapacity token={token} onAddBudgetCapacity={handleAddBudgetCapacity} username={username} /> 
          </div>
        )}
      </div>

      <Modal
        isOpen={showConfirmationModal}
        onRequestClose={handleCloseConfirmationModal}
        contentLabel="Token Refresh Confirmation Modal"
        className="dashboard-modal" 
      >
        <h2>WARNING!! Session Timeout </h2>
        <p>Mind extending your session to keep working?</p>
        <button onClick={handleConfirmationYes}>Yes</button>
        <button onClick={handleConfirmationNo}>No</button>
      </Modal>
    </div>
  );
};

export default PersonalDash;
