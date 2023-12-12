// CapExpense.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CapExpense from '../CapExpense';
import apiService from '../../services/apiService';

jest.mock('../../services/apiService');

describe('CapExpense component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    render(<CapExpense />);

    expect(screen.getByText('Welcome!!Happily Add Your Expense here')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Month:')).toBeInTheDocument();
    expect(screen.getByLabelText('Category of Expense:')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount of Expense:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Record a New Expense Category' })).toBeInTheDocument();
  });

  it('should fetch capacity data for the selected month', async () => {
    const mockGet = jest.spyOn(apiService, 'get');
    mockGet.mockResolvedValue({
      data: [
        { budgetname: 'Food', budgetnumber: 100 },
        { budgetname: 'Entertainment', budgetnumber: 50 },
      ],
    });

    render(<CapExpense />);

    userEvent.selectOptions(screen.getByLabelText('Select Month:'), '1');

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/budgets/capacity/1');
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  it('should send a request to the server to add the budget capacity', async () => {
    const mockPost = jest.spyOn(apiService, 'post');
    mockPost.mockResolvedValue({
      success: true,
      message: 'Budget capacity added successfully',
    });

    render(<CapExpense />);

    userEvent.type(screen.getByLabelText('Category of Expense:'), 'Travel');
    userEvent.type(screen.getByLabelText('Amount of Expense:'), '200');

    screen.getByRole('button', { name: 'Record a New Expense Category' }).click();

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/budgets/capacity', {
        budgetName: 'Travel',
        budgetNumber: '200',
        selectedMonth: '',
      });
      expect(screen.getByText('Budget capacity added successfully')).toBeInTheDocument();
    });
  });

  it('should display a success message if the budget capacity was added successfully', async () => {
    const mockPost = jest.spyOn(apiService, 'post');
    mockPost.mockResolvedValue({
      success: true,
      message: 'Budget capacity added successfully',
    });

    render(<CapExpense />);

    userEvent.type(screen.getByLabelText('Category of Expense:'), 'Travel');
    userEvent.type(screen.getByLabelText('Amount of Expense:'), '200');

    screen.getByRole('button', { name: 'Record a New Expense Category' }).click();

    expect(await screen.findByText('Budget capacity added successfully')).toBeInTheDocument();
  });

  it('should display an error message if the budget capacity was not added successfully', async () => {
    const mockPost = jest.spyOn(apiService, 'post');
    mockPost.mockResolvedValue({
      success: false,
      message: 'Failed to add budget capacity',
    });

    render(<CapExpense />);

    userEvent.type(screen.getByLabelText('Category of Expense:'), 'Travel');
    userEvent.type(screen.getByLabelText('Amount of Expense:'), '200');

    screen.getByRole('button', { name: 'Record a New Expense Category' }).click();

    expect(await screen.findByText('Failed to add budget capacity')).toBeInTheDocument();
  });
});
