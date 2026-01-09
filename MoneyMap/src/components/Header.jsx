import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/expense_logo.png'
import './Header.css'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const role = localStorage.getItem('role')
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark'
        return savedTheme
    })

    useEffect(() => {
        // Apply theme on mount and when theme changes
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
        document.body.style.backgroundColor = theme === 'dark' ? '#242424' : '#ffffff'
        document.body.style.color = theme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : '#1a1a1a'
    }, [theme])

    // Apply theme on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark'
        document.documentElement.setAttribute('data-theme', savedTheme)
        document.body.style.backgroundColor = savedTheme === 'dark' ? '#242424' : '#ffffff'
        document.body.style.color = savedTheme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : '#1a1a1a'
    }, [])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }
    }, [isMenuOpen])

    // Close menu on navigation
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])


    const handleLogout = () => {
        // Simple logout: clear auth and go home
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setIsMenuOpen(false)
        navigate('/')
    }

    const handleProfile = () => {
        // Add profile navigation logic here
        console.log('Profile clicked')
        setIsMenuOpen(false)
        navigate('/profile')
    }

    return (
        <header className="custom-header">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="MoneyMap Logo" className="header-logo" />
                        <span className="brand-text">MoneyMap</span>
                    </Link>

                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNavAltMarkup" 
                        aria-controls="navbarNavAltMarkup" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            {role !== 'ADMIN' && (
                                <NavLink className="nav-link" to="/dashboard">
                                    Dashboard
                                </NavLink>
                            )}
                            <NavLink className="nav-link" to="/about">
                                About
                            </NavLink>
                            <NavLink className="nav-link" to="/contact">
                                Contact
                            </NavLink>
                        </div>
                    </div>
                    
                    <div className="user-menu-container">
                        <button 
                            className="user-menu-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="User menu"
                        >
                            <svg 
                                className="menu-icon" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                            >
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                        
                        {isMenuOpen && (
                            <>
                                <div 
                                    className="menu-overlay"
                                    onClick={() => setIsMenuOpen(false)}
                                ></div>
                                <div className="user-menu-dropdown">
                                    <button 
                                        className="menu-item"
                                        onClick={handleProfile}
                                    >
                                        <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <span>Profile</span>
                                    </button>
                                    
                                    <div className="menu-divider"></div>
                                    
                                    <button 
                                        className="menu-item menu-item-danger"
                                        onClick={handleLogout}
                                    >
                                        <svg className="menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}
