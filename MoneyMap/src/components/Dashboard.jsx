import React, { useState, useEffect } from 'react'
import Header from './Header'
import { fetchWithAuth, API_BASE_URL } from '../utils/auth'
import './Dashboard.css'

const EXPENSE_BASE_URL = "http://localhost:80/expenses";

export default function Dashboard() {

  const [expenses, setExpenses] = useState([])

  const [totalExpenses, setTotalExpenses] = useState(0); // NEW: backend total

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paymentMode: '',
    date: ''
  })

  const [filterData, setFilterData] = useState({
    paymentMode: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  })


  // --------------------------------------------
  // OLD: Load expenses from localStorage
  // --------------------------------------------
  /*
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])
  */

  // --------------------------------------------
  // NEW: Load all expenses from backend
  // --------------------------------------------
  useEffect(() => {
    // Small delay to ensure localStorage is available after redirect
    const timer = setTimeout(() => {
      // If an ADMIN logs in, keep them inside the Admin area
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');
      
      console.log("Dashboard mounted - role:", role, "token exists:", !!token);
      
      if (role === 'ADMIN') {
        window.location.href = '/admin/users';
        return;
      }
      
      if (!token) {
        console.error("No token on Dashboard mount, redirecting to login");
        window.location.href = '/';
        return;
      }
      
      loadAllExpenses();
    }, 100); // Small delay to ensure localStorage is ready
    
    return () => clearTimeout(timer);
  }, [])

  // Helper function to get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token')?.trim();
  }

  const loadAllExpenses = () => {
    const token = getAuthToken();
    console.log("loadAllExpenses called, token exists:", !!token);
    
    if (!token) {
      console.error("No token found, redirecting to login");
      window.location.href = '/';
      return;
    }

    console.log("Fetching expenses with token:", token.substring(0, 20) + "...");

    // Example: Using fetch with JWT token in Authorization header
    fetchWithAuth(`${EXPENSE_BASE_URL}/allExpense`)
      .then(res => {
        console.log("allExpense response status:", res.status);
        if (res.status === 401 || res.status === 403) {
          // Don't auto-logout on first 401 - might be temporary or token issue
          console.warn("Auth error - but not logging out immediately");
          // Show error but don't redirect - let user retry
          return null;
        }
        if (!res.ok) {
          console.error("API error (non-auth):", res.status);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          console.log("All Expenses Response:", data);
          setExpenses(data);
        }
      })
      .catch(err => {
        console.error("Error loading expenses:", err);
        // Don't redirect on network errors - token might still be valid
      });

    fetchWithAuth(`${EXPENSE_BASE_URL}/totalExpenses`)
      .then(res => {
        console.log("totalExpenses response status:", res.status);
        if (res.status === 401 || res.status === 403) {
          // Don't auto-logout on first 401
          console.warn("Auth error on totalExpenses - but not logging out immediately");
          return null;
        }
        if (!res.ok) {
          console.error("totalExpenses API error (non-auth):", res.status);
          return null;
        }
        return res.text();
      })
      .then(msg => {
        if (msg) {
          console.log("Total Expenses Response:", msg);
          setTotalExpenses(Number(msg) || 0);
        }
      })
      .catch(err => console.error("Error loading total expenses:", err));
  }


  // --------------------------------------------
  // OLD: Save to localStorage on change
  // --------------------------------------------
  /*
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])
  */
  // NEW: Backend handles storage → remove this


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  // =====================================================
  // ADD EXPENSE
  // =====================================================

  // --------------------------------------------
  // OLD: Add to local state only
  // --------------------------------------------
  /*
  const handleAddExpense = (e) => {
    e.preventDefault()
    const newExpense = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    }
    setExpenses(prev => [newExpense, ...prev])
  }
  */

  // --------------------------------------------
  // NEW: Add to backend using POST /addExpense
  // --------------------------------------------
  const handleAddExpense = (e) => {
    e.preventDefault();

    const expenseData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      paymentMode: formData.paymentMode,
      date: formData.date       // must be yyyy-mm-dd
    };

    fetchWithAuth(`${EXPENSE_BASE_URL}/addExpense`, {
      method: "POST",
      body: JSON.stringify(expenseData)
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          // Don't auto-logout on first 401
          console.warn("Auth error on addExpense - showing error message");
          alert("Authentication failed. Please try again or login.");
          return null;
        }
        if (!res.ok) {
          alert("Failed to add expense. Please try again.");
          return null;
        }
        return res.text();
      })
      .then(msg => {
        if (msg !== undefined && msg !== null) {
          alert("Expense Added");
          loadAllExpenses();   // refresh list
          resetForm();
        }
      })
      .catch(err => {
        console.error("Error adding expense:", err);
        alert("Failed to add expense. Please try again.");
      });
  };



  // =====================================================
  // EDIT EXPENSE
  // =====================================================

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setFormData({
      description: expense.description,
      amount: expense.amount,
      paymentMode: expense.paymentMode,
      date: expense.date
    })
    setShowAddForm(true)
  }


  // --------------------------------------------
  // OLD: Update in localStorage only
  // --------------------------------------------
  /*
  const handleUpdateExpense = (e) => {
    e.preventDefault()
    setExpenses(prev => prev.map(expense =>
      expense.id === editingExpense.id
        ? { ...expense, ...formData }
        : expense
    ))
  }
  */

  // --------------------------------------------
  // NEW: Update backend using PUT /update/{id}
  // --------------------------------------------
  const handleUpdateExpense = (e) => {
    e.preventDefault();

    const updatedData = {
  description: formData.description,
  amount: parseFloat(formData.amount),
  paymentMode:
    formData.paymentMode !== "" ? formData.paymentMode : editingExpense.paymentMode,
  date: formData.date
};


    fetchWithAuth(`${EXPENSE_BASE_URL}/update/${editingExpense.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData)
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          // Don't auto-logout on first 401
          console.warn("Auth error on updateExpense - showing error message");
          alert("Authentication failed. Please try again or login.");
          return null;
        }
        if (!res.ok) {
          alert("Failed to update expense. Please try again.");
          return null;
        }
        return res.text();
      })
      .then(msg => {
        if (msg !== undefined && msg !== null) {
          console.log("Update Expense Response:", msg);
          alert("Expense updated");
          loadAllExpenses();
          resetForm();
        }
      })
      .catch(err => {
        console.error("Error updating expense:", err);
        alert("Failed to update expense. Please try again.");
      });
  };


  // =====================================================
  // DELETE EXPENSE
  // =====================================================

  // --------------------------------------------
  // OLD: Delete from local array only
  // --------------------------------------------
  /*
  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }
  */

  // --------------------------------------------
  // NEW: Delete from backend using DELETE /delete/{id}
  // --------------------------------------------
  const handleDeleteExpense = (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    fetchWithAuth(`${EXPENSE_BASE_URL}/delete/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          // Don't auto-logout on first 401
          console.warn("Auth error on deleteExpense - showing error message");
          alert("Authentication failed. Please try again or login.");
          return null;
        }
        if (!res.ok) {
          alert("Failed to delete expense. Please try again.");
          return null;
        }
        return res.text();
      })
      .then(msg => {
        if (msg !== undefined && msg !== null) {
          console.log("Delete Expense Response:", msg);
          loadAllExpenses();
        }
      })
      .catch(err => {
        console.error("Error deleting expense:", err);
        alert("Failed to delete expense. Please try again.");
      });
  };


  // =====================================================
  // CANCEL & RESET FORM
  // =====================================================
  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      paymentMode: '',
      date: ''
    });
    setEditingExpense(null);
    setShowAddForm(false);
  };


  // =====================================================
  // FILTERING
  // =====================================================

  // --------------------------------------------
  // OLD: Filter on frontend only
  // --------------------------------------------
  /*
  const filteredExpenses = expenses.filter(expense => {
    if (filterData.category && expense.category !== filterData.category) return false;
    if (filterData.date && expense.date !== filterData.date) return false;
    if (filterData.minAmount && expense.amount < filterData.minAmount) return false;
    if (filterData.maxAmount && expense.amount > filterData.maxAmount) return false;
    return true;
  });
  */

  // --------------------------------------------
  // NEW: Filter using backend APIs
  // --------------------------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData(prev => ({ ...prev, [name]: value }));
  };

  // Search/Filter function - applies filters when search button is clicked
  const handleSearchFilters = () => {
    // Priority: If amount filter has both min and max, use amount filter API
    if (filterData.minAmount && filterData.maxAmount) {
      fetchWithAuth(`${EXPENSE_BASE_URL}/amountFilter?minAmount=${filterData.minAmount}&maxAmount=${filterData.maxAmount}`)
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            // Don't auto-logout on first 401
            console.warn("Auth error on amountFilter - showing error message");
            alert("Authentication failed. Please try again or login.");
            return null;
          }
          if (!res.ok) {
            console.error("Amount filter error:", res.status);
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            console.log("Amount Filter Response:", data);
            setExpenses(data);
          }
        })
        .catch(err => console.error("Error filtering by amount:", err));
      return;
    }

    // If date range is provided (from and/or to)
    if (filterData.dateFrom || filterData.dateTo) {
      const from = filterData.dateFrom || filterData.dateTo; // If only one is provided, use it for both
      const to = filterData.dateTo || filterData.dateFrom;
      fetchWithAuth(`${EXPENSE_BASE_URL}/dateFilter?from=${from}&to=${to}`)
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            // Don't auto-logout on first 401
            console.warn("Auth error on dateFilter - showing error message");
            alert("Authentication failed. Please try again or login.");
            return null;
          }
          if (!res.ok) {
            console.error("Date filter error:", res.status);
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            console.log("Date Filter Response:", data);
            setExpenses(data);
          }
        })
        .catch(err => console.error("Error filtering by date:", err));
      return;
    }

    // If category (paymentMode) is selected
    if (filterData.paymentMode) {
      fetchWithAuth(`${EXPENSE_BASE_URL}/paymentMode?paymentMode=${filterData.paymentMode}`)
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            console.error("API failed with status", res.status);
            window.location.href = '/';
            return;
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            console.log("Payment Mode Filter Response:", data);
            setExpenses(data);
          }
        })
        .catch(err => console.error("Error filtering by payment mode:", err));
      return;
    }

    // If no filters are applied, reload all expenses
    loadAllExpenses();
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    setFilterData({
      paymentMode: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    });

    loadAllExpenses();
  };


  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-content">

        <div className="dashboard-header">
          <h1>Expense Dashboard</h1>
          {!showAddForm && (
            <button
              className="add-expense-btn"
              onClick={() => setShowAddForm(true)}
            >
              Add Expense
            </button>
          )}
        </div>

        <div className="expense-stats">
          <div className="stat-card">
            <p className="stat-label">Total Expenses</p>
            <p className="stat-value">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        {/* ADD / EDIT FORM */}
        {showAddForm && (
          <form
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            className="expense-form"
          >
            <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
            />

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Amount"
            />

            <select
              name="paymentMode"
              value={formData.paymentMode || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Payment Mode</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="NETBANKING">Net Banking</option>
            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />

            <button type="submit">
              {editingExpense ? "Update" : "Add"}
            </button>
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
          </form>
        )}

        {/* FILTER SECTION */}
        <div className="filter-container">
          <h2>Filter Expenses</h2>

          <div className="filter-inputs">
            <div className="filter-group">
              <label htmlFor="filter-paymentMode">Payment Mode</label>
              <select id="filter-paymentMode" name="paymentMode" value={filterData.paymentMode || ""} onChange={handleFilterChange}>
                <option value="">All Payment Modes</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="NETBANKING">Net Banking</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-date-from">Date From</label>
              <input
                type="date"
                id="filter-date-from"
                name="dateFrom"
                value={filterData.dateFrom}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="filter-date-to">Date To</label>
              <input
                type="date"
                id="filter-date-to"
                name="dateTo"
                value={filterData.dateTo}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="filter-min-amount">Min Amount</label>
              <input
                type="number"
                id="filter-min-amount"
                name="minAmount"
                placeholder="Min Amount"
                value={filterData.minAmount}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="filter-max-amount">Max Amount</label>
              <input
                type="number"
                id="filter-max-amount"
                name="maxAmount"
                placeholder="Max Amount"
                value={filterData.maxAmount}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleSearchFilters} className="search-filter-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              Search
            </button>
            <button onClick={handleClearFilters} className="clear-filter-btn">Clear</button>
          </div>
        </div>

        {/* EXPENSES DISPLAY BLOCK */}
        <div className="expenses-display-container">
          <div className="expenses-display-header">
            <h2>All Expenses</h2>
            <p className="expenses-count">Total: {expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-expenses-state">
              <p>No expenses found. Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="expenses-list">
              {expenses.map((expense) => (
                <div key={expense.id} className="expense-card">
                  <div className="expense-card-content">
                    <h3>{expense.description}</h3>
                    <p className="expense-amount-display">${expense.amount.toFixed(2)}</p>
                    <p className="expense-payment-mode">{expense.paymentMode || expense.paymentMode}</p>
                    <p className="expense-date-display">{expense.date}</p>
                  </div>
                  <div className="expense-card-actions">
                    <button onClick={() => handleEditExpense(expense)}>Edit</button>
                    <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
