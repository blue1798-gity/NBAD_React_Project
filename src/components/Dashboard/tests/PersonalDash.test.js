import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalDash from '../PersonalDash';

jest.mock('../../Auth/AuthenticationState', () => ({
  useUserAuth: () => ({
    logout: jest.fn(),
    checkUserTokenExpiration: jest.fn(),
  }),
}));

jest.mock('../Addexpense', () => ({
  __esModule: true,
  default: () => <div data-testid="AddBudget">Add Budget Component</div>,
}));

jest.mock('./ViewExpense', () => ({
  __esModule: true,
  default: () => <div data-testid="BudgetList">Budget List Component</div>,
}));

jest.mock('./Charts', () => ({
  __esModule: true,
  default: () => <div data-testid="BudgetChart">Budget Chart Component</div>,
}));

jest.mock('./CapExpense', () => ({
  __esModule: true,
  default: () => <div data-testid="AddBudgetCapacity">Add Budget Capacity Component</div>,
}));

describe('PersonalDash component', () => {
  it('should display the logout button', () => {
    render(<PersonalDash token="dummyToken" username="dummyUser" />);
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should display the navigation bar with buttons for budget list, budget chart, add budget, and add budget capacity', () => {
    render(<PersonalDash token="dummyToken" username="dummyUser" />);
    const navigationBar = screen.getByRole('navigation');
    expect(navigationBar).toBeInTheDocument();

    const budgetListButton = screen.getByRole('button', { name: 'View Financial Records' });
    expect(budgetListButton).toBeInTheDocument();

    const budgetChartButton = screen.getByRole('button', { name: 'Finanace Analysis Chart' });
    expect(budgetChartButton).toBeInTheDocument();

    const addBudgetButton = screen.getByRole('button', { name: 'Add New Expense' });
    expect(addBudgetButton).toBeInTheDocument();

    const addBudgetCapacityButton = screen.getByRole('button', { name: 'Customize Budget' });
    expect(addBudgetCapacityButton).toBeInTheDocument();
  });

  it('should display the AddBudget component when the "Add New Expense" button is clicked', () => {
    render(<PersonalDash token="dummyToken" username="dummyUser" />);
    const addBudgetButton = screen.getByRole('button', { name: 'Add New Expense' });
    fireEvent.click(addBudgetButton);

    const addBudgetComponent = screen.getByTestId('AddBudget');
    expect(addBudgetComponent).toBeInTheDocument();
  });

  it('should display the BudgetList component when the "View Financial Records" button is clicked', () => {
    render(<PersonalDash token="dummyToken" username="dummyUser" />);
    const budgetListButton = screen.getByRole('button', { name: 'View Financial Records' });
    fireEvent.click(budgetListButton);

    const budgetListComponent = screen.getByTestId('BudgetList');
    expect(budgetListComponent).toBeInTheDocument();
  });

  it('should display the BudgetChart component when the "Finance Analysis Chart" button is clicked', () => {
    render(<PersonalDash token="dummyToken" username="dummyUser" />);
    const budgetChartButton = screen.getByRole('button', { name: 'Finanace Analysis Chart' });
    fireEvent.click(budgetChartButton);

    const budgetChartComponent = screen.getByTestId('BudgetChart');
    expect(budgetChartComponent).toBeInTheDocument();
  });

  it('should display the AddBudgetCapacity component when the "Customize Budget" button is clicked', () => {
    render(<PersonalDash token="dummyToken" username="dummyUser" />);
    const addBudgetCapacityButton = screen.getByRole('button', { name: 'Customize Budget' });
    fireEvent.click(addBudgetCapacityButton);

    const addBudgetCapacityComponent = screen.getByTestId('AddBudgetCapacity');
    expect(addBudgetCapacityComponent).toBeInTheDocument();
  });
});
