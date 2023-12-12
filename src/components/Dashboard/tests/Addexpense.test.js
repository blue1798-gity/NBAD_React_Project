// Addexpense.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Addexpense from '../Addexpense';
import axios from 'axios';

jest.mock('axios');

describe('Addexpense component', () => {
  it('should render the form with input fields and a submit button', () => {
    render(<Addexpense token="dummyToken" />);

    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Expense' })).toBeInTheDocument();
  });

  it('should display error notifications when input fields are empty', async () => {
    render(<Addexpense token="dummyToken" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

    await waitFor(() => {
      expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
    });
  });

  it('should submit the form data and display a success notification on successful submission', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Budget added successfully' } });

    render(<Addexpense token="dummyToken" />);

    const categoryInput = screen.getByTestId('category-input'); 
    const budgetAmountInput = screen.getByTestId('amount-input'); 
    const submitButton = screen.getByTestId('add-button'); 

    userEvent.type(categoryInput, 'Groceries');
    userEvent.type(budgetAmountInput, '100');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Budget added successfully')).toBeInTheDocument();
    });
  });

  it('should display an error notification when the API request fails', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Error adding budget' } } });

    render(<Addexpense token="dummyToken" />);

    const categoryInput = screen.getByTestId('category-input'); 
    const budgetAmountInput = screen.getByTestId('amount-input'); 
    const submitButton = screen.getByTestId('add-button'); 

    userEvent.type(categoryInput, 'Groceries');
    userEvent.type(budgetAmountInput, '100');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Error adding budget')).toBeInTheDocument();
    });
  });
});
