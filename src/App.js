import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { UserAuthProvider } from './components/Auth/AuthenticationState';
import UserLogin from './components/Auth/CredLogin';
import UserRegistration from './components/Auth/CreateAccount';
import UserDashboard from './components/Dashboard/PersonalDash';
import BudgetOverview from './components/Dashboard/ViewExpense';
import FinancialChart from './components/Dashboard/Charts';
import AddBudgetCapacity from './components/Dashboard/CapExpense';
import CreateBudget from './components/Dashboard/Addexpense';
import authService from './components/services/authService';
import './styles/style.css';
import Footer from './components/Footer/Footer';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="header">
        <h1 className="welcome-message">Welcome to Your Financial Journey</h1>
        <h2>Your Budget, Your Future</h2>
      </div>
      <div className="features-container">
        <ul className="dashboard-features">
          <li>Create and Manage Your Budgets</li>
          <li>Customize Your Budget Settings</li>
          <li>Analyze Financial Charts and Insights</li>
          <li>List All Your Budgets in One Place</li>
        </ul>
        <div className="button-container">
          <Link to="/login" className="home-button">
            Log In
          </Link>
          <Link to="/signup" className="home-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};


const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [token, setUserToken] = useState(null);
  const [isTokenRefreshModalOpen, setIsTokenRefreshModalOpen] = useState(false);

  const handleUserLogin = (token) => {
    setUserToken(token);
    setIsUserLoggedIn(true);
  };

  useEffect(() => {
    const checkUserTokenExpiry = async () => {
      if (authService.checkUserTokenExpiry()) {
        setIsTokenRefreshModalOpen(true);
      }
    };

    checkUserTokenExpiry();
  }, []);


  return (
    <Router>
      <UserAuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLogin onUserLogin={handleUserLogin} />} />
          <Route path="/signup" element={<UserRegistration />} />
          <Route
            path="/dashboard"
            element={isUserLoggedIn ? <UserDashboard token={token} /> : <Navigate to="/login" />}
          />
          {isUserLoggedIn && (
            <>
              <Route path="/dashboard/budget-list" element={<BudgetOverview />} />
              <Route path="/dashboard/budget-chart" element={<FinancialChart />} />
              <Route path="/dashboard/configure-budget" element={<AddBudgetCapacity />} />
              <Route path="/dashboard/add-budget" element={<CreateBudget token={token} />} />
            </>
          )}
        </Routes>
      </UserAuthProvider>
      <Footer />
    </Router>
  );
};
export default App;