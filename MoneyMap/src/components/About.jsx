import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import './About.css'

export default function About() {
  return (
    <div className="about-container">
      <Header />
      <div className="about-content">
        <div className="about-hero">
          <h1 className="about-title">About MoneyMap</h1>
          <p className="about-subtitle">Your Personal Financial Companion</p>
        </div>

        <div className="about-section">
          <div className="about-card">
            <div className="about-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h2>Track Your Expenses</h2>
            <p>
              Easily record and categorize all your expenses. From daily coffee runs to monthly bills, 
              MoneyMap helps you keep track of every dollar spent with an intuitive and user-friendly interface.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </div>
            <h2>Smart Filtering</h2>
            <p>
              Find what you're looking for instantly with our powerful filtering system. Filter expenses by 
              category, date range, or amount to get detailed insights into your spending patterns.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h2>Visual Insights</h2>
            <p>
              Get a clear picture of your financial health with real-time statistics and summaries. 
              Understand where your money goes and make informed decisions about your spending.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h2>Secure & Private</h2>
            <p>
              Your financial data is stored locally on your device using secure browser storage. 
              Your privacy is our priority - no cloud sync, no external servers, just you and your data.
            </p>
          </div>
        </div>

        <div className="about-mission">
          <h2>Our Mission</h2>
          <p>
            At MoneyMap, we believe that managing your finances should be simple, accessible, and stress-free. 
            We've created a tool that empowers you to take control of your spending habits without complexity 
            or hidden fees.
          </p>
          <p>
            Whether you're saving for a big purchase, trying to cut down on unnecessary expenses, or simply 
            want to understand where your money goes, MoneyMap is here to help you achieve your financial goals.
          </p>
        </div>

        <div className="about-features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Easy Expense Entry</h3>
              <p>Quickly add expenses with a simple form</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Multiple Categories</h3>
              <p>Organize expenses by category</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Edit & Delete</h3>
              <p>Full control over your expense records</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Advanced Search</h3>
              <p>Filter by date, category, and amount</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Dark & Light Mode</h3>
              <p>Choose your preferred theme</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Offline Access</h3>
              <p>Works without internet connection</p>
            </div>
          </div>
        </div>

        <div className="about-cta">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who are taking control of their finances with MoneyMap</p>
          <Link to="/dashboard" className="cta-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Start Tracking Now
          </Link>
        </div>
      </div>
    </div>
  )
}

